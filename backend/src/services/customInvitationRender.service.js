import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { getPrisma } from '../loaders/database.js';

const isProd = process.env.NODE_ENV === "production";

function getLocalChromePath() {
    if (process.platform === "win32") return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    if (process.platform === "darwin") return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    return "/usr/bin/google-chrome";
}

export async function renderCustomInvitationToImage(invitationId, userId) {
    const prisma = getPrisma();

    // 1. Fetch the custom invitation
    const invitation = await prisma.invitation.findFirst({
        where: { id: invitationId, wedding: { userId } }
    });

    if (!invitation || !invitation.isCustom) {
        throw new Error("Custom invitation not found or invalid type");
    }

    let payload = { elements: [], canvasSize: { width: 800, height: 1200 }, backgroundColor: "#ffffff" };

    if (typeof invitation.canvasData === 'string') {
        try {
            const parsed = JSON.parse(invitation.canvasData);
            if (Array.isArray(parsed)) payload.elements = parsed; // Legacy support
            else payload = { ...payload, ...parsed }; // New object support
        } catch (e) { }
    } else if (invitation.canvasData) {
        if (Array.isArray(invitation.canvasData)) payload.elements = invitation.canvasData;
        else payload = { ...payload, ...invitation.canvasData };
    }

    const elements = payload.elements || [];
    const width = payload.canvasSize?.width || 800;
    const height = payload.canvasSize?.height || 1200;

    // 2. Resolve Background Image (Directly from Disk to bypass network/localhost)
    let backgroundStyle = `background-color: ${payload.backgroundColor};`;

    if (invitation.customBackground) {
        try {
            const relativeBgPath = invitation.customBackground.startsWith('/')
                ? invitation.customBackground.slice(1)
                : invitation.customBackground;

            const bgPath = path.join(process.cwd(), relativeBgPath);
            const bgBase64 = fs.readFileSync(bgPath, { encoding: 'base64' });
            const mimeType = invitation.customBackground.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

            backgroundStyle = `background-image: url('data:${mimeType};base64,${bgBase64}'); background-size: cover; background-position: center;`;
        } catch (err) {
            console.error("Failed to load local background image for render:", err);
            // Will fallback to the default white background if file is missing
        }
    }

    // 3. Dynamically build the HTML from the canvas nodes
    const htmlElements = elements.map(el => {
        const baseStyle = `position: absolute; left: ${el.position.x}px; top: ${el.position.y}px; z-index: ${el.zIndex}; width: ${el.size.width}px; height: ${el.size.height}px;`;

        if (el.type === 'text') {
            return `
                <div style="${baseStyle} 
                    font-family: ${el.style.fontFamily}; 
                    font-size: ${el.style.fontSize}px; 
                    color: ${el.style.color};
                    font-weight: ${el.style.isBold ? 'bold' : 'normal'};
                    font-style: ${el.style.isItalic ? 'italic' : 'normal'};
                    text-align: ${el.style.textAlign};
                    line-height: ${el.style.lineHeight};
                    letter-spacing: ${el.style.letterSpacing}px;
                    text-shadow: ${el.style.textShadow || 'none'};">
                    ${el.content}
                </div>`;
        }

        if (el.type === 'shape') {
            return `
                <div style="${baseStyle} opacity: ${el.opacity}; background-color: ${el.color}; border-radius: ${el.shapeType === 'circle' ? '50%' : '0'};">
                </div>`;
        }

        if (el.type === 'image') {
            return `<img src="${el.src}" style="${baseStyle} opacity: ${el.opacity}; object-fit: cover;" />`;
        }

        return '';
    }).join('');

    // 4. Construct the final HTML document with all fonts
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Josefin+Sans:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Raleway:ital,wght@0,400;0,700;1,400&display=swap');
                
                body { margin: 0; padding: 0; background-color: ${payload.backgroundColor}; }
                .canvas-container {
                    position: relative;
                    width: ${width}px;  
                    height: ${height}px; 
                    overflow: hidden;
                    background-color: ${payload.backgroundColor};
                    ${backgroundStyle}
                }
            </style>
        </head>
        <body>
            <div class="canvas-container">
                ${htmlElements}
            </div>
        </body>
        </html>
    `;

    // 5. Fire up Puppeteer
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: isProd ? process.env.PUPPETEER_EXECUTABLE_PATH : getLocalChromePath(),
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: width, height: height });
        await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded'] });
        await page.evaluateHandle('document.fonts.ready');

        const buffer = await page.screenshot({ type: 'png' });
        return buffer;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
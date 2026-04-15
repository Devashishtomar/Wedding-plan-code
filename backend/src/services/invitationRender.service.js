import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

function getLocalChromePath() {
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  return "/usr/bin/google-chrome";
}

const isProd = process.env.NODE_ENV === "production";

export async function renderInvitationToImage(invitationResponse) {
  const browser = await puppeteer.launch({
    executablePath: isProd
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : getLocalChromePath(),

    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-crash-reporter',
      '--disable-features=Crashpad'
    ]
  });

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  const { template, resolvedFields, invitation } = invitationResponse;
  const backgroundImagePath = path.join(
    process.cwd(),
    "templates",
    "processed",
    template.category,
    template.id,
    "background.jpg"
  );

  if (!fs.existsSync(backgroundImagePath)) {
    throw new Error(
      `Background image not found at ${backgroundImagePath}`
    );
  }

  const html = `
    <html>
      <body style="margin:0;">
        <div style="
          position:relative;
          width:${template.canvas.width}px;
          height:${template.canvas.height}px;
          overflow: hidden;
        ">
        <img
          src="file://${backgroundImagePath}"
          style="
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
         "
        />
          ${Object.entries(resolvedFields)
      .map(
        ([key, field]) => `
            <div style="
              position:absolute;
              left:${field.x}px;
              top:${field.y}px;
              transform:${field.align === "center" ? "translateX(-50%)" : "none"};
              font-family:${field.fontFamily};
              font-size:${field.fontSize}px;
              color:${field.color};
              font-weight:${field.bold ? 700 : 400};
              text-align:${field.align};
              max-width:${field.maxWidth ? `${field.maxWidth}px` : "none"};
            ">
              ${invitation.content[key] || ""}
            </div>
          `
      )
      .join("")}
        </div>
      </body>
    </html>
  `;

  const tempHtmlPath = path.join(
    process.cwd(),
    "tmp",
    `invite-${invitation.id}.html`
  );

  fs.mkdirSync(path.dirname(tempHtmlPath), { recursive: true });
  fs.writeFileSync(tempHtmlPath, html);

  await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });
  await page.setViewport({
    width: template.canvas.width,
    height: template.canvas.height,
  });
  await page.evaluateHandle("document.fonts.ready");

  const buffer = await page.screenshot({
    type: "png",
    clip: {
      x: 0,
      y: 0,
      width: template.canvas.width,
      height: template.canvas.height,
    },
  });

  fs.unlinkSync(tempHtmlPath);

  await browser.close();

  return buffer;
}

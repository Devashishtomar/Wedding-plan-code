import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import slugify from "slugify";

const RAW_DIR = path.resolve("templates/raw");
const OUTPUT_DIR = path.resolve("templates/processed");

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1800;

const PREVIEW_WIDTH = 400;
const PREVIEW_HEIGHT = 600;

async function normalize() {
    const categories = await fs.readdir(RAW_DIR);

    for (const category of categories) {
        const categoryPath = path.join(RAW_DIR, category);
        const stat = await fs.stat(categoryPath);
        if (!stat.isDirectory()) continue;

        const images = await fs.readdir(categoryPath);
        let index = 1;

        for (const image of images) {
            const ext = path.extname(image).toLowerCase();
            if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

            const baseName = path.basename(image, ext);
            const slug = slugify(baseName, { lower: true, strict: true });
            const templateId = `${category}_${String(index).padStart(2, "0")}`;

            const templateDir = path.join(OUTPUT_DIR, category, templateId);
            await fs.ensureDir(templateDir);

            const inputPath = path.join(categoryPath, image);
            const bgPath = path.join(templateDir, "background.jpg");
            const previewPath = path.join(templateDir, "preview.jpg");
            const metaPath = path.join(templateDir, "meta.json");

            // Background image
            await sharp(inputPath)
                .resize(CANVAS_WIDTH, CANVAS_HEIGHT, {
                    fit: "cover",
                    position: "center",
                })
                .jpeg({ quality: 85 })
                .toFile(bgPath);

            // Preview image
            await sharp(inputPath)
                .resize(PREVIEW_WIDTH, PREVIEW_HEIGHT, {
                    fit: "cover",
                    position: "center",
                })
                .jpeg({ quality: 80 })
                .toFile(previewPath);

            // Metadata scaffold
            const meta = {
                id: templateId,
                name: templateId
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
                category,
                canvas: {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                },
                textFields: [],
            };

            await fs.writeJson(metaPath, meta, { spaces: 2 });

            console.log(`✔ Processed ${templateId}`);
            index++;
        }
    }

    console.log("\n Template normalization complete.");
}

normalize().catch((err) => {
    console.error("Error during normalization:", err);
});

import fs from "fs";
import path from "path";
import {
    FONT_OPTIONS,
    COLOR_PALETTE,
} from "../config/invitationDesign.js";

const templateCache = new Map();
/*
  templateCache = {
    templateId: {
      meta,
      backgroundUrl
    }
  }
*/

const TEMPLATES_ROOT = path.join(
    process.cwd(),
    "templates/processed"
);

/**
 * Load template meta.json from filesystem
 */
export function loadTemplateMeta(templateId) {
    if (templateCache.has(templateId)) {
        return templateCache.get(templateId);
    }

    const categories = fs.readdirSync(TEMPLATES_ROOT);

    for (const category of categories) {
        const templatePath = path.join(TEMPLATES_ROOT, category, templateId);
        const metaPath = path.join(templatePath, "meta.json");

        if (!fs.existsSync(metaPath)) continue;

        const raw = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        validateTemplateMeta(raw, templateId);

        const meta = {
            ...raw,
            backgroundUrl: `/static/templates/${category}/${templateId}/background.jpg`,
        };

        templateCache.set(templateId, meta);
        return meta;
    }

    throw new Error(`Template not found: ${templateId}`);
}

function validateTemplateMeta(meta, templateId) {
    if (!meta.id || !meta.name || !meta.category) {
        throw new Error(`Invalid meta.json (${templateId}): missing id/name/category`);
    }

    if (!meta.canvas || !meta.canvas.width || !meta.canvas.height) {
        throw new Error(`Invalid meta.json (${templateId}): invalid canvas`);
    }

    if (!Array.isArray(meta.textFields)) {
        throw new Error(`Invalid meta.json (${templateId}): textFields must be array`);
    }

    meta.textFields.forEach((field, index) => {
        if (!field.key || !field.default || !field.constraints) {
            throw new Error(
                `Invalid meta.json (${templateId}): textFields[${index}] incomplete`
            );
        }

        if (typeof field.default.x !== "number" || typeof field.default.y !== "number") {
            throw new Error(
                `Invalid meta.json (${templateId}): invalid coordinates in ${field.key}`
            );
        }

        if (
            !field.constraints.fontSize ||
            typeof field.constraints.fontSize.min !== "number" ||
            typeof field.constraints.fontSize.max !== "number" ||
            field.constraints.fontSize.min <= 0 ||
            field.constraints.fontSize.max < field.constraints.fontSize.min
        ) {
            throw new Error(
                `Invalid meta.json (${templateId}): invalid font size constraints in ${field.key}`
            );
        }


        if (
            !field.constraints.yOffset ||
            typeof field.constraints.yOffset.min !== "number" ||
            typeof field.constraints.yOffset.max !== "number" ||
            field.constraints.yOffset.max < field.constraints.yOffset.min
        ) {
            throw new Error(
                `Invalid meta.json (${templateId}): invalid yOffset constraints in ${field.key}`
            );
        }

    });
}


/**
 * Validate font family
 */
function isValidFont(font) {
    return FONT_OPTIONS.some((f) => f.value === font);
}

/**
 * Validate color
 */
function isValidColor(color) {
    return COLOR_PALETTE.includes(color);
}

/**
 * Clamp a number between min/max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Core resolver
 */
export function resolveInvitation(invitation) {
    if (!invitation || !invitation.templateId) {
        throw new Error("Invalid invitation input");
    }

    const template = loadTemplateMeta(invitation.templateId);

    const resolvedFields = {};

    for (const field of template.textFields) {
        const key = field.key;
        const defaults = field.default;
        const constraints = field.constraints;

        const overrides = invitation.styles?.[key] || {};

        const fontFamily =
            invitation.globalFontFamily ||
            overrides.fontFamily ||
            defaults.fontFamily;

        const finalFontFamily = isValidFont(fontFamily)
            ? fontFamily
            : defaults.fontFamily;

        const fontSize = clamp(
            overrides.fontSize ?? defaults.fontSize,
            constraints.fontSize.min,
            constraints.fontSize.max
        );

        const yOffset = clamp(
            overrides.yOffset ?? 0,
            constraints.yOffset.min,
            constraints.yOffset.max
        );

        const color = isValidColor(overrides.color)
            ? overrides.color
            : defaults.color;

        resolvedFields[key] = {
            x: defaults.x,
            y: defaults.y + yOffset,
            fontFamily: finalFontFamily,
            fontSize,
            color,
            bold: overrides.bold ?? defaults.bold ?? false,
            align: defaults.align,
            maxWidth: defaults.maxWidth,
        };
    }

    return {
        invitation: {
            id: invitation.id,
            weddingId: invitation.weddingId,
            token: invitation.token,
            templateId: invitation.templateId,

            content: {
                title: invitation.title,
                names: invitation.names,
                message: invitation.message,
                date: invitation.date,
                time: invitation.time,
                venue: invitation.venue,
                rsvpDate: invitation.rsvpDate,
            },

            styles: invitation.styles || {},
            globalFontFamily: invitation.globalFontFamily || null,

            createdAt: invitation.createdAt,
            updatedAt: invitation.updatedAt,
        },

        template: {
            id: template.id,
            name: template.name,
            category: template.category,
            canvas: template.canvas,
            backgroundUrl: template.backgroundUrl,
            textFields: template.textFields,
        },

        resolvedFields,
    };
}

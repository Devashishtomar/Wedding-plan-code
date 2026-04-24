import crypto from 'crypto';
import { getPrisma } from '../loaders/database.js';
import { resolveInvitation, loadTemplateMeta } from "./invitationResolver.service.js";
import { renderInvitationToImage } from "./invitationRender.service.js";
import fs from 'fs';
import path from 'path';

const TEMPLATES_ROOT = path.join(process.cwd(), 'templates/processed');

const generateToken = () =>
    crypto.randomBytes(32).toString('hex');

export const getMyInvitation = async ({ userId }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });

    if (!wedding) return null;

    const invitation = await prisma.invitation.findUnique({
        where: { weddingId: wedding.id },
    });

    if (!invitation) return null;

    if (invitation.isCustom) {
        return {
            invitation: {
                id: invitation.id,
                weddingId: invitation.weddingId,
                token: invitation.token,
                templateId: invitation.templateId, 
                isCustom: true,
                canvasData: invitation.canvasData,
                customBackground: invitation.customBackground,
                createdAt: invitation.createdAt,
                updatedAt: invitation.updatedAt,
            },
            template: null, 
            resolvedFields: {}
        };
    }

    if (!invitation.templateId) return null;

    const template = loadTemplateMeta(invitation.templateId);

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
        },
        template,
        resolvedFields: null,
    };
};


export const createInvitation = async ({ userId, message, templateId, content, styles, globalFontFamily, }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });

    if (!wedding) {
        const err = new Error('Wedding not found');
        err.statusCode = 404;
        throw err;
    }

    // 🔒 Guarantee ONE invitation per wedding
    const existing = await prisma.invitation.findUnique({
        where: { weddingId: wedding.id },
    });

    if (existing) {
        const template = loadTemplateMeta(existing.templateId);

        return {
            invitation: {
                id: existing.id,
                weddingId: existing.weddingId,
                token: existing.token,
                templateId: existing.templateId,
                content: {
                    title: existing.title,
                    names: existing.names,
                    message: existing.message,
                    date: existing.date,
                    time: existing.time,
                    venue: existing.venue,
                    rsvpDate: existing.rsvpDate,
                },
                styles: existing.styles || {},
                globalFontFamily: existing.globalFontFamily || null,
            },
            template,
            resolvedFields: null,
        };
    }

    const invitation = await prisma.invitation.create({
        data: {
            weddingId: wedding.id,
            userId,
            message: content?.message ?? '',
            templateId,
            title: content?.title,
            names: content?.names,
            date: content?.date,
            time: content?.time,
            venue: content?.venue,
            rsvpDate: content?.rsvpDate,
            styles,
            globalFontFamily,

            token: generateToken(),
        },
    });

    const template = loadTemplateMeta(invitation.templateId);

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
        },
        template,
        resolvedFields: null,
    };
};

export const updateInvitation = async ({ userId, invitationId, message, templateId, content, styles, globalFontFamily, }) => {
    const prisma = getPrisma();

    const invite = await prisma.invitation.findUnique({
        where: { id: invitationId },
        include: { wedding: true },
    });

    if (!invite || invite.wedding.userId !== userId) {
        const err = new Error('Invitation not found');
        err.statusCode = 404;
        throw err;
    }

    const updated = await prisma.invitation.update({
        where: { id: invitationId },
        data: {
            templateId,
            message: content?.message ?? invite.message,
            title: content?.title,
            names: content?.names,
            date: content?.date,
            time: content?.time,
            venue: content?.venue,
            rsvpDate: content?.rsvpDate,
            styles,
            globalFontFamily,
        },
    });

    return resolveInvitation(updated);
};

export const getInvitationByToken = async (token) => {
    const prisma = getPrisma();

    return prisma.invitation.findUnique({
        where: { token },
        include: {
            wedding: {
                select: {
                    location: true,
                    date: true,
                },
            },
        },
    });
};

export const listInvitationTemplates = async () => {
    const categories = fs.readdirSync(TEMPLATES_ROOT);
    const templates = [];

    for (const category of categories) {
        const categoryPath = path.join(TEMPLATES_ROOT, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        const templateDirs = fs.readdirSync(categoryPath);

        for (const dir of templateDirs) {
            const templatePath = path.join(categoryPath, dir);
            const metaPath = path.join(templatePath, 'meta.json');

            if (!fs.existsSync(metaPath)) continue;

            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

            templates.push({
                id: meta.id,
                name: meta.name,
                category: meta.category,
                preview: `/static/templates/${category}/${dir}/preview.jpg`,
            });
        }
    }

    return templates;
};

export const getInvitationTemplateById = async (templateId) => {
    const categories = fs.readdirSync(TEMPLATES_ROOT);

    for (const category of categories) {
        const templatePath = path.join(TEMPLATES_ROOT, category, templateId);
        const metaPath = path.join(templatePath, 'meta.json');

        if (!fs.existsSync(metaPath)) continue;

        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

        return {
            id: meta.id,
            meta,
            background: `/static/templates/${category}/${templateId}/background.jpg`,
        };
    }

    return null;
};


export const renderInvitationImage = async ({
    invitationId,
    userId,
}) => {
    const prisma = getPrisma();

    const invitation = await prisma.invitation.findFirst({
        where: {
            id: invitationId,
            wedding: {
                userId,
            },
        },
    });

    if (!invitation) {
        throw new Error("Invitation not found or access denied");
    }

    const resolved = resolveInvitation(invitation);

    return renderInvitationToImage(resolved);
};

import crypto from 'crypto';
import { getPrisma } from '../loaders/database.js';
import { resolveInvitation, loadTemplateMeta } from "./invitationResolver.service.js";
import { renderInvitationToImage } from "./invitationRender.service.js";
import fs from 'fs';
import path from 'path';

const TEMPLATES_ROOT = path.join(process.cwd(), 'templates/processed');

const generateToken = () =>
    crypto.randomBytes(32).toString('hex');

export const getInvitations = async ({ visibilityFilter }) => {
    const prisma = getPrisma();

    const invitations = await prisma.invitation.findMany({
        where: visibilityFilter,
        orderBy: { createdAt: 'desc' }
    });

    if (!invitations || invitations.length === 0) return [];

    return invitations.map(invitation => {
        if (invitation.isCustom) {
            return {
                invitation: {
                    id: invitation.id,
                    weddingId: invitation.weddingId,
                    eventId: invitation.eventId,
                    visibility: invitation.visibility,
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

        const template = invitation.templateId ? loadTemplateMeta(invitation.templateId) : null;

        return {
            invitation: {
                id: invitation.id,
                weddingId: invitation.weddingId,
                eventId: invitation.eventId,
                visibility: invitation.visibility,
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
    });
};

export const createInvitation = async ({ weddingId, eventId, visibility, userId, message, templateId, content, styles, globalFontFamily }) => {
    const prisma = getPrisma();

    const existing = await prisma.invitation.findFirst({
        where: {
            weddingId,
            eventId: eventId || null,
            visibility,
        },
    });

    if (existing) {
        const updated = await prisma.invitation.update({
            where: { id: existing.id },
            data: {
                templateId,
                updatedById: userId,
                title: content?.title ?? existing.title,
                names: content?.names ?? existing.names,
                message: content?.message ?? message ?? existing.message,
                date: content?.date ?? existing.date,
                time: content?.time ?? existing.time,
                venue: content?.venue ?? existing.venue,
                rsvpDate: content?.rsvpDate ?? existing.rsvpDate,
                styles: styles || existing.styles,
                globalFontFamily: globalFontFamily || existing.globalFontFamily,
            }
        });

        const template = loadTemplateMeta(updated.templateId);

        return {
            invitation: {
                id: updated.id,
                weddingId: updated.weddingId,
                eventId: updated.eventId,
                visibility: updated.visibility,
                token: updated.token,
                templateId: updated.templateId,
                content: {
                    title: updated.title,
                    names: updated.names,
                    message: updated.message,
                    date: updated.date,
                    time: updated.time,
                    venue: updated.venue,
                    rsvpDate: updated.rsvpDate,
                },
                styles: updated.styles || {},
                globalFontFamily: updated.globalFontFamily || null,
            },
            template,
            resolvedFields: null,
        };
    }

    const invitation = await prisma.invitation.create({
        data: {
            weddingId,
            eventId: eventId || null,
            createdById: userId,
            visibility,
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
            eventId: invitation.eventId,
            visibility: invitation.visibility,
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

export const updateInvitation = async ({ weddingId, userId, invitationId, message, templateId, content, styles, globalFontFamily }) => {
    const prisma = getPrisma();

    const invite = await prisma.invitation.findUnique({
        where: { id: invitationId }
    });

    if (!invite || invite.weddingId !== weddingId) {
        const err = new Error('Invitation not found in this workspace');
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
            updatedById: userId,
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
    weddingId,
}) => {
    const prisma = getPrisma();

    const invitation = await prisma.invitation.findFirst({
        where: {
            id: invitationId,
            weddingId,
        },
    });

    if (!invitation) {
        throw new Error("Invitation not found or access denied");
    }

    const resolved = resolveInvitation(invitation);

    return renderInvitationToImage(resolved);
};

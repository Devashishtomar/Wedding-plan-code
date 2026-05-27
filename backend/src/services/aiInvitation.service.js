import * as CoreAiEngine from './ai/aiInvitation.service.js';

/**
 * Gateway wrapper matching project standard interface patterns.
 */
export const generateCustomCanvasTemplate = async (context) => {
    return await CoreAiEngine.generateCustomCanvasTemplate(context);
};
import OpenAI from 'openai';
import { env } from '../../config/env.js';

let openaiInstance = null;


export const getOpenAIClient = () => {
    if (!openaiInstance) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing OPENAI_API_KEY environment configuration value.");
        }
        openaiInstance = new OpenAI({ apiKey });
    }
    return openaiInstance;
};
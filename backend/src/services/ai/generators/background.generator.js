import { getOpenAIClient } from '../openai.client.js';
import { buildBackgroundPrompt } from '../prompts/backgroundArt.prompt.js';

export const generateBackgroundAssetUrl = async (userPrompt, eventType) => {
    const openai = getOpenAIClient();
    const cleanPrompt = buildBackgroundPrompt(userPrompt, eventType);

    // Connecting straight down to your requested gpt-image-1 architecture profile setup
   const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: cleanPrompt,
        size: "1024x1536", // Selects optimal vertical invitation layout from supported size arrays
        // Stripped out n and quality parameters completely to adhere strictly to model limits
    });

    // Extract the base64 string from the data matrix array node
    const b64Data = response.data && response.data.length > 0 ? response.data[0].b64_json : null;
    
    if (!b64Data) {
        throw new Error("The background image generation model returned an empty base64 image data payload.");
    }

    // Convert the raw block into a valid inline data URI asset string
    return `data:image/png;base64,${b64Data}`;
};
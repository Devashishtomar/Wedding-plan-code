import { getOpenAIClient } from '../openai.client.js';
import { SYSTEM_LAYOUT_PROMPT } from '../prompts/layoutComposition.prompt.js';

/**
 * Returns a strict deterministic JSON layout structure.
 */
export const generateBaseLayoutData = async (userPrompt, textContent, size) => {
    const openai = getOpenAIClient();

    const userInstructions = `
Generate a layout configuration for a prompt: "${userPrompt}"
Target Canvas Width: ${size.width}px, Height: ${size.height}px.
Populate these literal text values securely inside the returned canvas nodes:
- Title Field Content: "${textContent.title || "The Wedding Celebration"}"
- Names Field Content: "${textContent.names || "Save the Date"}"
- Date Field Content: "${textContent.date || "Saturday, December 12, 2026"}"
- Venue Field Content: "${textContent.venue || "The Grand Pavilion Resort"}"
`;

    // Strict structure mirroring customInvitation.ts schema models exactly
    // Strict structure mirroring customInvitation.ts schema models exactly
    const strictSchemaStructure = {
        type: "object",
        properties: {
            backgroundColor: { type: "string", description: "HEX string for the card background color matching the prompt mood." },
            border: {
                type: "object",
                properties: {
                    style: { type: "string", enum: ["none", "simple", "double", "ornate", "floral", "vintage"] },
                    color: { type: "string", description: "HEX accent color matching the palette." },
                    width: { type: "number" }
                },
                required: ["style", "color", "width"],
                additionalProperties: false // Added to satisfy OpenAI strict validation rules
            },
            elements: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        type: { type: "string", enum: ["text"] },
                        content: { type: "string" },
                        position: {
                            type: "object",
                            properties: {
                                x: { type: "number" },
                                y: { type: "number" }
                            },
                            required: ["x", "y"],
                            additionalProperties: false // Added to nested positional elements
                        },
                        size: {
                            type: "object",
                            properties: {
                                width: { type: "number" },
                                height: { type: "number" }
                            },
                            required: ["width", "height"],
                            additionalProperties: false // Added to nested box size objects
                        },
                        style: {
                            type: "object",
                            properties: {
                                fontFamily: { type: "string" },
                                fontSize: { type: "number" },
                                color: { type: "string" },
                                isBold: { type: "boolean" },
                                isItalic: { type: "boolean" },
                                textAlign: { type: "string", enum: ["left", "center", "right"] },
                                lineHeight: { type: "number" },
                                letterSpacing: { type: "number" }
                            },
                            required: ["fontFamily", "fontSize", "color", "isBold", "isItalic", "textAlign", "lineHeight", "letterSpacing"],
                            additionalProperties: false // Added to nested text styling sub-schemas
                        },
                        zIndex: { type: "number" }
                    },
                    required: ["id", "type", "content", "position", "size", "style", "zIndex"],
                    additionalProperties: false // Added to array item objects wrapping custom nodes
                }
            }
        },
        required: ["backgroundColor", "border", "elements"],
        additionalProperties: false
    };
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: SYSTEM_LAYOUT_PROMPT },
            { role: "user", content: userInstructions }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "invitation_canvas_schema",
                strict: true,
                schema: strictSchemaStructure
            }
        },
        temperature: 0.2
    });

    return JSON.parse(completion.choices[0].message.content);
};
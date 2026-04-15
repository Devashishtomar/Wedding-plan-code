import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const callOpenAI = async ({ systemPrompt, context, userMessage }) => {
    const messages = [
        {
            role: "system",
            content: systemPrompt,
        },
        {
            role: "system",
            content: `CONTEXT:\n${JSON.stringify(context, null, 2)}`,
        },
        {
            role: "user",
            content: userMessage,
        },
    ];

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.4,
    });

    return response.choices[0].message.content;
};

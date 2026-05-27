
export const buildBackgroundPrompt = (userPrompt, eventType) => {
    const defaultType = eventType || "Wedding";
    return `An elegant, high-resolution artistic background backdrop texture for a digital custom ${defaultType} invitation card. Aesthetic: ${userPrompt}. The art must flank only the borders, margins, or act as an abstract subtle underlying watercolor wash or artistic theme layer. The central section of the canvas must remain completely clean, balanced, and open for text overlays. [CRITICAL QUALITY CONSTRAINT]: Completely textless. Absolutely zero characters, zero words, zero letters, zero signatures, zero names, zero typos, and zero watermarks. Pure visual backdrop graphic art asset layer only.`;
};
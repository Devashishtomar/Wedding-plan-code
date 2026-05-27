import { generateBaseLayoutData } from './generators/layout.generator.js';
import { generateBackgroundAssetUrl } from './generators/background.generator.js';

/**
 * Orchestrates multi-model execution pathways to form a single synchronized invitation dataset.
 */
export const generateCustomCanvasTemplate = async (context) => {
    const { prompt, eventType, content, canvasSize } = context;

    // Execute layout calculation and texture generation in parallel to maximize throughput performance
    const [layoutData, backgroundImage] = await Promise.all([
        generateBaseLayoutData(prompt, content, canvasSize),
        generateBackgroundAssetUrl(prompt, eventType)
    ]);

    // Stitch elements smoothly into the structural dataset contract formatting matrix
    return {
        backgroundColor: layoutData.backgroundColor,
        backgroundImage: backgroundImage,
        canvasSize: {
            width: canvasSize.width,
            height: canvasSize.height
        },
        border: layoutData.border,
        elements: layoutData.elements
    };
};
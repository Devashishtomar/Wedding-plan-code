import { getPrisma } from '../loaders/database.js';
import axios from 'axios';

/**
 * Searches high-quality wedding decor and concepts across free stock image endpoints.
 * Integrates an intelligent aesthetic backup pool if keys are missing from environmental config.
 */
export const searchExternalInspirations = async (query, page = 1, perPage = 20) => {
    const pexelsKey = process.env.PEXELS_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    const fallbackImages = [
        { id: "fb-1", url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", title: "Grand Rose Floral Wall Setup", category: "Floral Decor", tags: ["floral", "roses", "stage"], style: "Romantic" },
        { id: "fb-2", url: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800", title: "Luxury Table Settings & Centerpieces", category: "Table Settings", tags: ["table", "centerpiece", "gold"], style: "Glam" },
        { id: "fb-3", url: "https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&q=80&w=800", title: "Dreamy Hanging Fairy Lights Canopy", category: "Fairy Lights", tags: ["lighting", "lights", "canopy"], style: "Modern" },
        { id: "fb-4", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", title: "Traditional Marigold Backdrop", category: "Backdrop", tags: ["haldi", "marigold", "yellow"], style: "Bohemian" }
    ];

    // Strict developer-tier cost and infrastructure resource guard lock
    if (page > 2) {
        return [];
    }

    try {
        const promises = [];

        if (pexelsKey) {
            promises.push(
                axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=15`, {
                    headers: { Authorization: pexelsKey },
                    timeout: 5000
                }).then(res => (res.data?.photos || []).map(p => ({
                    id: `pexels-${p.id}`,
                    url: p.src.large2x || p.src.large,
                    title: p.alt || `${query} Idea`,
                    category: "Discovery",
                    tags: [query.toLowerCase()],
                    style: "Modern"
                }))).catch(() => [])
            );
        }

        if (unsplashKey) {
            promises.push(
                axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=15`, {
                    headers: { Authorization: `Client-ID ${unsplashKey}` },
                    timeout: 5000
                }).then(res => (res.data?.results || []).map(p => ({
                    id: `unsplash-${p.id}`,
                    url: p.urls.regular,
                    title: p.description || p.alt_description || `${query} Idea`,
                    category: "Discovery",
                    tags: [query.toLowerCase()],
                    style: "Romantic"
                }))).catch(() => [])
            );
        }

        if (promises.length === 0) {
            return fallbackImages.filter(img =>
                img.title.toLowerCase().includes(query.toLowerCase()) ||
                img.tags.some(t => t.includes(query.toLowerCase()))
            );
        }

        const resolvedFeeds = await Promise.all(promises);
        const blendedPool = resolvedFeeds.flat();

        return blendedPool.length === 0 ? fallbackImages : blendedPool;
    } catch (error) {
        console.error("[Inspiration Discovery API Error]:", error.message);
        return fallbackImages;
    }
};

/**
 * Persists an asset token locally inside the isolated 3-Pillar partition.
 */
export const pinInspirationItem = async ({ weddingId, eventId, visibility, createdById, url, title, category, description, tags, style }) => {
    const prisma = getPrisma();
    const cleanEventId = (eventId === 'all' || !eventId) ? null : eventId;

    return await prisma.pinnedInspiration.create({
        data: {
            weddingId,
            eventId: cleanEventId,
            visibility,
            createdById,
            imageUrl: url,
            title: title || "Wedding Concept",
            metadata: {
                category: category || "Discovery",
                description: description || "",
                tags: tags || [],
                style: style || "Modern"
            }
        }
    });
};

/**
 * Returns persisted board items corresponding directly to row filters.
 */
export const getPinnedInspirationsList = async (visibilityFilter) => {
    const prisma = getPrisma();
    const records = await prisma.pinnedInspiration.findMany({
        where: visibilityFilter,
        orderBy: { createdAt: 'desc' }
    });

    return records.map(r => {
        const meta = typeof r.metadata === 'object' && r.metadata ? r.metadata : {};
        return {
            id: r.id,
            url: r.imageUrl,
            title: r.title,
            category: meta.category || "Discovery",
            description: meta.description || "",
            tags: meta.tags || [],
            style: meta.style || "Modern",
            eventId: r.eventId,
            visibility: r.visibility
        };
    });
};

/**
 * Safely removes pinned element after cross-checking target workspace boundaries.
 */
export const unpinInspirationItem = async (id, weddingId) => {
    const prisma = getPrisma();

    const item = await prisma.pinnedInspiration.findFirst({
        where: { id, weddingId }
    });

    if (!item) {
        throw new Error("Inspiration pin not found or unauthorized cross-contamination query detected.");
    }

    return await prisma.pinnedInspiration.delete({
        where: { id }
    });
};
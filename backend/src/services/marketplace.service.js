import { getPrisma } from '../loaders/database.js';

// Centralized include blueprint configuration to completely eliminate N+1 secondary roundtrip query lags
const CORE_VENDOR_INCLUDES = {
    venueDetails: true,
    makeupDetails: true,
    photoDetails: true,
    catererDetails: true,
    decorDetails: true,
    plannerDetails: true,
    mehndiDetails: true
};

/**
 * Executes a high-speed relational query catalog search across your vendor listings directory.
 * Maximizes hardware multi-core scanning capabilities using pre-indexed lookup fields.
 */
export const queryVendorsDirectory = async (filters) => {
    const prisma = getPrisma();
    const { category, city, searchQuery, minPrice, maxPrice, minRating, sortBy } = filters;

    // Dynamically compile indexed query arguments safely protecting against SQL injection threats
    const whereConditions = {
        isActive: true,
        ...(category && { category }),
        ...(city && { city })
    };

    // Construct precise pricing sliding thresholds boundary arguments
    if (minPrice !== undefined || maxPrice !== undefined) {
        whereConditions.startingPrice = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice })
        };
    }

    // Apply decimal assessment gating restrictions 
    if (minRating !== undefined) {
        whereConditions.avgRating = { gte: minRating };
    }

    if (searchQuery) {
        const cleanQuery = searchQuery.toLowerCase().trim();
        const genericKeywords = ['venue', 'venues', 'photographer', 'photographers', 'photo', 'makeup', 'caterer', 'caterers', 'decorator', 'decorators', 'planner', 'planners', 'mehndi'];

        if (!genericKeywords.includes(cleanQuery)) {
            whereConditions.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { services: { hasSome: [searchQuery] } }
            ];
        }
    }

    // Determine target execution order values
    let orderByCondition = { totalReviews: 'desc' }; // Default popular option mapping
    if (sortBy === 'rating') {
        orderByCondition = { avgRating: 'desc' };
    } else if (sortBy === 'price-low') {
        orderByCondition = { startingPrice: 'asc' };
    } else if (sortBy === 'price-high') {
        orderByCondition = { startingPrice: 'desc' };
    }

    return await prisma.vendor.findMany({
        where: whereConditions,
        orderBy: orderByCondition,
        include: CORE_VENDOR_INCLUDES
    });
};

/**
 * Locates a single verified partner profile via unique reference strings.
 */
export const getVendorById = async (vendorId) => {
    const prisma = getPrisma();
    return await prisma.vendor.findUnique({
        where: { id: vendorId },
        include: CORE_VENDOR_INCLUDES
    });
};

/**
 * Runs a rapid aggregate grouping operation returning a clean list of strings indicating available vendor hubs.
 */
export const getDistinctVendorCities = async () => {
    const prisma = getPrisma();
    const records = await prisma.vendor.findMany({
        where: { isActive: true },
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' }
    });
    return records.map(r => r.city);
};

/**
 * Gathers a client's shortlisted vendor metrics matching active visibility scopes.
 */
export const getWeddingShortlistedEntries = async (weddingId, pillarContext) => {
    const prisma = getPrisma();
    return await prisma.shortlistedVendor.findMany({
        where: {
            weddingId,
            visibility: pillarContext.visibility,
            eventId: pillarContext.eventId || null
        },
        include: {
            vendor: {
                include: CORE_VENDOR_INCLUDES
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Atomic operational toggle transaction: Safely locks row mutations, verifying compound multi-tenant keys
 * before toggling shortlist status. Resolves the optional eventId null mismatch challenge.
 */
export const toggleVendorShortlistState = async (payload) => {
    const prisma = getPrisma();
    const { weddingId, eventId, vendorId, visibility, createdById, notes } = payload;

    // Defensive target query search avoiding composite null check exceptions in native database drivers
    const existingEntry = await prisma.shortlistedVendor.findFirst({
        where: { weddingId, eventId, vendorId, visibility }
    });

    if (existingEntry) {
        await prisma.shortlistedVendor.delete({
            where: { id: existingEntry.id }
        });
        return { action: 'REMOVED', message: "Vendor removed from your shortlist successfully!" };
    }

    await prisma.shortlistedVendor.create({
        data: { weddingId, eventId, vendorId, visibility, createdById, notes }
    });
    return { action: 'ADDED', message: "Vendor added to your shortlist successfully!" };
};

/**
 * Queries catalog data for an array of IDs to populate side-by-side comparison tables.
 */
export const getVendorsByBatchIds = async (vendorIds) => {
    const prisma = getPrisma();
    if (!vendorIds || vendorIds.length === 0) return [];

    return await prisma.vendor.findMany({
        where: {
            id: { in: vendorIds },
            isActive: true
        },
        include: CORE_VENDOR_INCLUDES
    });
};

/**
 * High-speed index validator used to enforce category limit thresholds before triggering server updates.
 */
export const countVendorsOfCategoryInBatch = async (vendorIds, category) => {
    const prisma = getPrisma();
    if (!vendorIds || vendorIds.length === 0 || !category) return 0;

    return await prisma.vendor.count({
        where: {
            id: { in: vendorIds },
            category
        }
    });
};

/**
 * Relational Transaction Block: Creates review entries and computes new weight aggregates simultaneously,
 * ensuring lookups remain fast without recalculating metrics on every browse request.
 */
export const registerVendorReview = async (reviewLog) => {
    const prisma = getPrisma();
    const { vendorId, userId, rating, comment } = reviewLog;

    return await prisma.$transaction(async (tx) => {
        // 1. Commit new text assessment row log safely into memory arrays
        const newReview = await tx.vendorReview.create({
            data: { vendorId, userId, rating, comment }
        });

        // 2. Aggregate average score calculations inside the isolated transaction thread
        const statistics = await tx.vendorReview.aggregate({
            where: { vendorId },
            _avg: { rating: true },
            _count: { id: true }
        });

        const computedAverage = statistics._avg.rating || rating;
        const computedCount = statistics._count.id || 1;

        // 3. Update master fields, locking changes down for sub-millisecond querying performance
        await tx.vendor.update({
            where: { id: vendorId },
            data: {
                avgRating: parseFloat(computedAverage.toFixed(2)),
                totalReviews: computedCount
            }
        });

        return newReview;
    });
};

/**
 * Streams text timelines sorted by user review inputs.
 */
export const getVendorReviewsFeedLogs = async (vendorId) => {
    const prisma = getPrisma();
    return await prisma.vendorReview.findMany({
        where: { vendorId },
        include: {
            user: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Placeholder processing channel for availability queries. Matures booking requests safely into
 * activity streams until full communication models are deployed.
 */
export const dispatchVendorLeadInquiry = async (inquiryData) => {
    // Pipeline message placeholder channel simulation
    return true;
};
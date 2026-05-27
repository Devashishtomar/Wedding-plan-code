import * as MarketplaceService from '../services/marketplace.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';

// Front-to-Back Case-Insensitive String Literal to Database Enum Translation Maps
const FRONT_TO_BACK_CATEGORY = {
    'venues': 'VENUE',
    'photographers': 'PHOTOGRAPHER',
    'makeup': 'MAKEUP_ARTIST',
    'caterers': 'CATERER',
    'decorators': 'DECORATOR',
    'planners': 'PLANNER',
    'mehndi': 'MEHNDI_ARTIST'
};

const BACK_TO_FRONT_CATEGORY = {
    'VENUE': 'venues',
    'PHOTOGRAPHER': 'photographers',
    'MAKEUP_ARTIST': 'makeup',
    'CATERER': 'caterers',
    'DECORATOR': 'decorators',
    'PLANNER': 'planners',
    'MEHNDI_ARTIST': 'mehndi'
};

/**
 * Transforms database record nodes into the precise nested JSON schema shape expected by the frontend components.
 */
function formatVendorResponse(vendor) {
    if (!vendor) return null;

    const frontCategory = BACK_TO_FRONT_CATEGORY[vendor.category] || 'venues';

    // Parse specific relational 1:1 details into flat comparison matrices label-value arrays
    const features = [];
    if (vendor.category === 'VENUE' && vendor.venueDetails) {
        const d = vendor.venueDetails;
        features.push({ label: 'Venue Type', value: d.venueType });
        features.push({ label: 'Hall Capacity', value: d.hallCapacity ? `${d.hallCapacity} guests` : 'N/A' });
        features.push({ label: 'Lawn Capacity', value: d.lawnCapacity ? `${d.lawnCapacity} guests` : 'N/A' });
        features.push({ label: 'Bridal Suite Available', value: d.bridalSuite });
        features.push({ label: 'Catering Option', value: d.cateringPolicy });
        features.push({ label: 'Alcohol Allowed', value: d.alcoholPolicy });
    } else if (vendor.category === 'MAKEUP_ARTIST' && vendor.makeupDetails) {
        const d = vendor.makeupDetails;
        features.push({ label: 'Experience Level', value: `${d.experienceYears} years` });
        features.push({ label: 'Travels to Location', value: d.travels });
        features.push({ label: 'Trial Session Available', value: d.trialAvailable });
        features.push({ label: 'Bridal Package Rate', value: d.bridalPrice ? `$${d.bridalPrice.toLocaleString()}` : 'N/A' });
    } else if (vendor.category === 'PHOTOGRAPHER' && vendor.photoDetails) {
        const d = vendor.photoDetails;
        features.push({ label: 'Experience Level', value: `${d.experienceYears} years` });
        features.push({ label: 'Delivery Turnaround', value: `${d.deliveryDays} days` });
        features.push({ label: 'Album Included', value: d.albumIncluded });
    } else if (vendor.category === 'CATERER' && vendor.catererDetails) {
        const d = vendor.catererDetails;
        features.push({ label: 'Vegetarian Only', value: d.vegOnly });
        features.push({ label: 'Veg Plate Rate', value: d.vegPricePerPlate ? `$${d.vegPricePerPlate}` : 'N/A' });
        features.push({ label: 'Non-Veg Plate Rate', value: d.nonVegPricePerPlate ? `$${d.nonVegPricePerPlate}` : 'N/A' });
    } else if (vendor.category === 'DECORATOR' && vendor.decorDetails) {
        const d = vendor.decorDetails;
        features.push({ label: 'Experience Level', value: `${d.experienceYears} years` });
        features.push({ label: 'Customizable Designs', value: d.customizable });
    } else if (vendor.category === 'PLANNER' && vendor.plannerDetails) {
        const d = vendor.plannerDetails;
        features.push({ label: 'Experience Level', value: `${d.experienceYears} years` });
        features.push({ label: 'Events Coordinated', value: String(d.eventsManaged) });
    } else if (vendor.category === 'MEHNDI_ARTIST' && vendor.mehndiDetails) {
        const d = vendor.mehndiDetails;
        features.push({ label: 'Experience Level', value: `${d.experienceYears} years` });
        features.push({ label: 'Bridal Mehndi Rate', value: d.bridalPrice ? `$${d.bridalPrice}` : 'N/A' });
    }

    // Fallback tagging safeguards
    if (features.length === 0) {
        features.push({ label: 'Verified Partner', value: true });
    }

    return {
        id: vendor.id,
        name: vendor.name,
        category: frontCategory,
        location: vendor.address,
        city: vendor.city,
        rating: vendor.avgRating || 0.0,
        reviews: vendor.totalReviews || 0,
        // Enforces split boundary resilience requirements format
        priceRange: vendor.startingPrice ? `$${vendor.startingPrice.toLocaleString()} - $${(vendor.startingPrice * 1.6).toLocaleString()}` : 'Contact for Pricing',
        priceValue: vendor.startingPrice || 0,
        images: vendor.images && vendor.images.length > 0 ? vendor.images : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'],
        description: vendor.description || '',
        services: vendor.services || [],
        contact: {
            phone: vendor.phone,
            email: vendor.email || '',
            website: vendor.website || '',
            address: vendor.address
        },
        features
    };
}

// O(1) high speed hash mapping space avoiding unnecessary secondary db migration clutter for transitory comparison states
const transientCompareStore = new Map();

export const fetchVendorsDirectory = async (req, res) => {
    try {
        const { category, city, q, minPrice, maxPrice, minRating, sortBy } = req.query;

        // Transform lowercase parameters to unified backend system Enums safely
        const backendCategory = FRONT_TO_BACK_CATEGORY[category];

        const queryFilters = {
            category: backendCategory,
            city: city && city !== 'all' ? city : undefined,
            searchQuery: q || undefined,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            minRating: minRating && minRating !== 'all' ? parseFloat(minRating) : undefined,
            sortBy: sortBy || 'popular'
        };

        const rawVendors = await MarketplaceService.queryVendorsDirectory(queryFilters);
        const formattedVendors = rawVendors.map(v => formatVendorResponse(v));

        return res.status(200).json({ success: true, vendors: formattedVendors });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchVendorProfileDetail = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await MarketplaceService.getVendorById(vendorId);

        if (!vendor) {
            return res.status(404).json({ success: false, message: "Target vendor profile does not exist in the master directory." });
        }

        return res.status(200).json({ success: true, vendor: formatVendorResponse(vendor) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchActiveMarketplaceCities = async (req, res) => {
    try {
        const cities = await MarketplaceService.getDistinctVendorCities();
        return res.status(200).json({ success: true, cities });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchWeddingShortlist = async (req, res) => {
    try {
        const view = req.query.view || 'SHARED';
        const pillarContext = getVisibilityFilter(req, view);

        if (req.query.eventId && req.query.eventId !== 'all') {
            pillarContext.eventId = req.query.eventId;
        }

        const rawShortlist = await MarketplaceService.getWeddingShortlistedEntries(req.weddingId, pillarContext);
        const processedVendors = rawShortlist.map(entry => formatVendorResponse(entry.vendor));

        return res.status(200).json({ success: true, shortlist: processedVendors });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postToggleShortlist = async (req, res) => {
    try {
        const { vendorId, eventId, notes } = req.body;
        const view = req.query.view || 'SHARED';
        const contextFilter = getVisibilityFilter(req, view);

        if (!vendorId) {
            return res.status(400).json({ success: false, message: "Target vendorId parameter is required." });
        }

        const payload = {
            weddingId: req.weddingId,
            eventId: eventId && eventId !== 'all' ? eventId : null,
            visibility: contextFilter.visibility,
            vendorId,
            createdById: req.user.id,
            notes: notes || null
        };

        const result = await MarketplaceService.toggleVendorShortlistState(payload);

        await logActivity(req.weddingId, req.user.id, result.action, 'MARKETPLACE_SHORTLIST', { vendorId, eventId });
        return res.status(200).json({ success: true, action: result.action, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchComparisonList = async (req, res) => {
    try {
        const keyId = req.weddingId;
        const currentCompareIds = transientCompareStore.get(keyId) || [];

        const rawVendors = await MarketplaceService.getVendorsByBatchIds(currentCompareIds);
        const mappedResponse = rawVendors.map(v => formatVendorResponse(v));

        return res.status(200).json({ success: true, compareList: mappedResponse });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postToggleComparison = async (req, res) => {
    try {
        const { vendorId, category } = req.body;
        const keyId = req.weddingId;

        if (!vendorId) {
            return res.status(400).json({ success: false, message: "Vendor identifier target is required." });
        }

        let currentCompareIds = transientCompareStore.get(keyId) || [];

        if (currentCompareIds.includes(vendorId)) {
            currentCompareIds = currentCompareIds.filter(id => id !== vendorId);
            transientCompareStore.set(keyId, currentCompareIds);
            return res.status(200).json({ success: true, action: 'REMOVED', message: "Vendor detached from evaluation metrics safely." });
        }

        // Validate Frontend Maximum 4 Items Cap Constraint Boundary Level
        if (category) {
            const backendCategory = FRONT_TO_BACK_CATEGORY[category];
            const activeCategoryMatchCount = await MarketplaceService.countVendorsOfCategoryInBatch(currentCompareIds, backendCategory);

            if (activeCategoryMatchCount >= 4) {
                return res.status(400).json({ success: false, limitReached: true, message: `Comparison boundary limit criteria reached. Maximum of 4 ${category} allowed.` });
            }
        }

        currentCompareIds.push(vendorId);
        transientCompareStore.set(keyId, currentCompareIds);

        return res.status(200).json({ success: true, action: 'ADDED', message: "Vendor attached to multi-column comparison layout matrix successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postVendorReview = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Valid assessment score parameter rating (1 to 5 stars) is required." });
        }

        const reviewData = await MarketplaceService.registerVendorReview({
            vendorId,
            userId: req.user.id,
            rating: parseFloat(rating),
            comment: comment || null
        });

        return res.status(201).json({ success: true, review: reviewData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchVendorReviewsFeed = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const feed = await MarketplaceService.getVendorReviewsFeedLogs(vendorId);
        return res.status(200).json({ success: true, reviews: feed });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postVendorInquiry = async (req, res) => {
    try {
        const { vendorId, message, eventId } = req.body;
        const view = req.query.view || 'SHARED';
        const contextFilter = getVisibilityFilter(req, view);

        if (!vendorId) {
            return res.status(400).json({ success: false, message: "Target vendor profile address token parameter is required." });
        }

        // Submits booking lead data structure down to service triggers
        const inquiryLog = {
            weddingId: req.weddingId,
            userId: req.user.id,
            vendorId,
            eventId: eventId && eventId !== 'all' ? eventId : null,
            visibility: contextFilter.visibility,
            message: message || "Inquired about date availability and package quotes matching my sub-event timeline."
        };

        await MarketplaceService.dispatchVendorLeadInquiry(inquiryLog);

        await logActivity(req.weddingId, req.user.id, 'CREATE', 'VENDOR_INQUIRY', { vendorId });
        return res.status(200).json({ success: true, message: "Availability query dispatched to partner account dashboard channels successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
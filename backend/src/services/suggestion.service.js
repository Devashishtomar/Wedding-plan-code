import { addDays, subMonths, subWeeks } from "date-fns";

const THEME_CONFIGS = {
  beach: {
    budgetWeights: {
      "Venue": 0.35,
      "Catering": 0.25,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.15, // Higher for beach setup
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Apply for Beach Wedding Permits", category: "Legal", offsetMonths: -6, priority: "HIGH" },
      { title: "Check Weather and Tides", category: "Venue", offsetWeeks: -4, priority: "MEDIUM" },
      { title: "Arrange Outdoor Sound System", category: "Entertainment", offsetMonths: -3, priority: "MEDIUM" },
      { title: "Prepare Beach-friendly Footwear (Sandals/Flip-flops)", category: "Outfits", offsetWeeks: -2, priority: "LOW" },
    ],
    note: "For beach weddings, ensure you have a backup indoor venue in case of rain."
  },
  destination: {
    budgetWeights: {
      "Venue": 0.3,
      "Catering": 0.2,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.1,
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.2, // Higher for travel/accommodation
    },
    extraTasks: [
      { title: "Research Destination Legal Requirements", category: "Legal", offsetMonths: -10, priority: "HIGH" },
      { title: "Book Flights and Accommodation", category: "Travel", offsetMonths: -8, priority: "HIGH" },
      { title: "Create Travel Guide for Guests", category: "Guests", offsetMonths: -6, priority: "MEDIUM" },
      { title: "Confirm Travel Insurance", category: "Miscellaneous", offsetMonths: -3, priority: "MEDIUM" },
    ],
    note: "Consider hiring a local wedding planner at the destination for smoother coordination."
  },
  traditional: {
    budgetWeights: {
      "Venue": 0.35,
      "Catering": 0.3,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.1,
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Consult Religious/Cultural Officiant", category: "Legal", offsetMonths: -9, priority: "HIGH" },
      { title: "Plan Traditional Rituals and Ceremonies", category: "General", offsetMonths: -6, priority: "HIGH" },
      { title: "Traditional Attire Fabric/Design Selection", category: "Outfits", offsetMonths: -6, priority: "MEDIUM" },
    ],
    note: "Traditions vary by culture; ensure all family customs are integrated into the timeline."
  },
  intimate: {
    budgetWeights: {
      "Venue": 0.3,
      "Catering": 0.4, // Higher focus on high-quality dining
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.1,
      "Wedding Outfits": 0.05,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Write Personalized Notes for All Guests", category: "Guests", offsetWeeks: -4, priority: "MEDIUM" },
      { title: "Select Premium Private Dining Menu", category: "Catering", offsetMonths: -3, priority: "HIGH" },
    ],
    note: "An intimate wedding allows for more personalized touches and higher-quality guest experiences."
  },
  rustic: {
    budgetWeights: {
      "Venue": 0.3,
      "Catering": 0.25,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.2, // Higher for rustic/outdoor decor
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Inspect Outdoor Lighting and Power Supply", category: "Venue", offsetMonths: -4, priority: "MEDIUM" },
      { title: "Arrange Rustic Decor & DIY Items", category: "Decor", offsetMonths: -3, priority: "LOW" },
      { title: "Confirm Rain Plan (Indoor/Tent Backup)", category: "Venue", offsetMonths: -2, priority: "HIGH" },
    ],
    note: "Rustic weddings often rely on the natural beauty of the venue; keep decor organic and simple."
  },
  modern: {
    budgetWeights: {
      "Venue": 0.35,
      "Catering": 0.25,
      "Photography & Video": 0.15, // Focus on high-end visuals
      "Decor & Flowers": 0.1,
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Select Modern Stationery/Digital Invitations", category: "Invitations", offsetMonths: -5, priority: "MEDIUM" },
      { title: "Book Contemporary Entertainment (DJ/Live Band)", category: "Entertainment", offsetMonths: -4, priority: "HIGH" },
      { title: "Finalize Fusion/Modern Menu with Caterer", category: "Catering", offsetMonths: -3, priority: "MEDIUM" },
    ],
    note: "Modern weddings often embrace clean lines and digital-first experiences."
  },
  religious: {
    budgetWeights: {
      "Venue": 0.25, // Often lower for religious venues
      "Catering": 0.3,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.15,
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.1, // Religious fees/donations
    },
    extraTasks: [
      { title: "Confirm Religious Venue and Officiant", category: "Venue", offsetMonths: -10, priority: "HIGH" },
      { title: "Attend Marriage Preparation Courses", category: "Legal", offsetMonths: -6, priority: "MEDIUM" },
      { title: "Order Ceremony Programs/Order of Service", category: "Invitations", offsetMonths: -2, priority: "LOW" },
    ],
    note: "Ensure you check for any specific requirements or restrictions at your place of worship."
  },
  cultural: {
    budgetWeights: {
      "Venue": 0.3,
      "Catering": 0.3,
      "Photography & Video": 0.1,
      "Decor & Flowers": 0.15,
      "Wedding Outfits": 0.1,
      "Miscellaneous": 0.05,
    },
    extraTasks: [
      { title: "Identify Cultural Ritual Requirements", category: "General", offsetMonths: -8, priority: "HIGH" },
      { title: "Source Cultural Decor and Traditional Props", category: "Decor", offsetMonths: -5, priority: "MEDIUM" },
      { title: "Arrange Cultural Music or Dance Performance", category: "Entertainment", offsetMonths: -4, priority: "LOW" },
    ],
    note: "Cultural weddings are rich in heritage; start sourcing specific traditional items early."
  }
};

/**
 * Generate a personalized wedding plan suggestion
 */
export const generateWeddingSuggestion = ({ date, budget, weddingType, guestCount }) => {
  const weddingDate = new Date(date);
  const theme = THEME_CONFIGS[weddingType.toLowerCase()] || {};
  
  // 1. Budget Allocation
  const weights = theme.budgetWeights || {
    "Venue": 0.4,
    "Catering": 0.25,
    "Photography & Video": 0.1,
    "Decor & Flowers": 0.1,
    "Wedding Outfits": 0.1,
    "Miscellaneous": 0.05,
  };

  const budgetAllocation = Object.entries(weights).map(([category, weight]) => ({
    category,
    percentage: Math.round(weight * 100),
    estimated: Math.round(budget * weight)
  }));

  // 2. Checklist & Timeline Rules
  const baseTaskRules = [
    { title: "Finalize Venue", category: "Venue", offsetMonths: -12, priority: "HIGH" },
    { title: "Book Photographer", category: "Photography", offsetMonths: -10, priority: "MEDIUM" },
    { title: "Purchase Wedding Dress/Suit", category: "Outfits", offsetMonths: -8, priority: "HIGH" },
    { title: "Send Save the Dates", category: "Invitations", offsetMonths: -6, priority: "MEDIUM" },
    { title: "Book Caterer", category: "Catering", offsetMonths: -6, priority: "HIGH" },
    { title: "Finalize Guest List", category: "Guests", offsetMonths: -4, priority: "HIGH" },
    { title: "Order Wedding Cake", category: "Catering", offsetMonths: -3, priority: "LOW" },
    { title: "Send Formal Invitations", category: "Invitations", offsetMonths: -2, priority: "HIGH" },
    { title: "Final RSVP Follow-up", category: "Guests", offsetWeeks: -2, priority: "HIGH" },
    { title: "Final Fitting", category: "Outfits", offsetWeeks: -1, priority: "MEDIUM" },
    { title: "Marriage License", category: "Legal", offsetWeeks: -1, priority: "HIGH" },
    { title: "Wedding Day!", category: "General", offsetDays: 0, priority: "HIGH" },
  ];

  const themeTaskRules = theme.extraTasks || [];
  const combinedRules = [...baseTaskRules, ...themeTaskRules];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checklist = combinedRules.map(rule => {
    let dueDate = weddingDate;
    if (rule.offsetMonths) dueDate = subMonths(weddingDate, Math.abs(rule.offsetMonths));
    if (rule.offsetWeeks) dueDate = subWeeks(weddingDate, Math.abs(rule.offsetWeeks));
    if (rule.offsetDays) dueDate = addDays(weddingDate, rule.offsetDays);
    
    const tomorrow = addDays(today, 1);
    
    // If the calculated date is in the past or today, set it to tomorrow
    if (dueDate < tomorrow) {
      dueDate = tomorrow;
    }

    return {
      title: rule.title,
      category: rule.category,
      priority: rule.priority,
      dueDate,
    };
  });

  // Sort checklist by dueDate (earliest first)
  checklist.sort((a, b) => a.dueDate - b.dueDate);

  // 3. Theme-specific Suggestions
  const suggestions = {
    venue: theme.note || "Select a venue that resonates with your personal style and accommodates your guest list.",
    vendorNote: `Based on your ${weddingType} theme, look for vendors experienced in similar events.`
  };

  return {
    budgetAllocation,
    checklist,
    suggestions
  };
};


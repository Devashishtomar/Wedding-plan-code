export type CategoryId = 'venues' | 'photographers' | 'makeup' | 'caterers' | 'decorators' | 'planners' | 'mehndi';

export interface VendorCategory {
  id: CategoryId;
  name: string;
  image: string;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: CategoryId;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  priceRange: string;
  priceValue: number;
  images: string[];
  description: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
    address: string;
  };
  features: {
    label: string;
    value: string | boolean;
  }[];
}

export const CATEGORIES: VendorCategory[] = [
  {
    "id": "venues",
    "name": "Venues",
    "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    "description": "Banquets, Lawns, Resorts, and Hotels"
  },
  {
    "id": "photographers",
    "name": "Photographers",
    "image": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
    "description": "Wedding Photography & Videography"
  },
  {
    "id": "makeup",
    "name": "Makeup Artists",
    "image": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
    "description": "Bridal Makeup & Styling"
  },
  {
    "id": "caterers",
    "name": "Caterers",
    "image": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    "description": "Delicious Food for your Guests"
  },
  {
    "id": "decorators",
    "name": "Decorators",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    "description": "Stunning Decor & Floral Arrangements"
  },
  {
    "id": "planners",
    "name": "Planners",
    "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    "description": "Expert Wedding Planning Services"
  },
  {
    "id": "mehndi",
    "name": "Mehndi Artists",
    "image": "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?q=80&w=800&auto=format&fit=crop",
    "description": "Traditional & Modern Mehndi Designs"
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    "id": "v1",
    "name": "Diamond Gardens",
    "category": "venues",
    "location": "Downtown",
    "city": "New York",
    "rating": 5,
    "reviews": 108,
    "priceRange": "$7,000 - $15,000",
    "priceValue": 7000,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 310 555 3662",
      "email": "contact@diamondgardens.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v2",
    "name": "Glow Collective",
    "category": "photographers",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.9,
    "reviews": 30,
    "priceRange": "$1,900 - $3,400",
    "priceValue": 1900,
    "images": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 869 555 4349",
      "email": "contact@glowcollective.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v3",
    "name": "Flawless by Emma",
    "category": "makeup",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.1,
    "reviews": 26,
    "priceRange": "$430 - $530",
    "priceValue": 430,
    "images": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 544 555 6777",
      "email": "contact@flawlessbyemma.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v4",
    "name": "Flavor Catering Co.",
    "category": "caterers",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.4,
    "reviews": 70,
    "priceRange": "$19 - $41 per plate",
    "priceValue": 19,
    "images": [
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1414235077428-971145534400?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 368 555 8902",
      "email": "contact@flavorcateringco..com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v5",
    "name": "Blossom Decor",
    "category": "decorators",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.5,
    "reviews": 200,
    "priceRange": "$1,300 - $1,800",
    "priceValue": 1300,
    "images": [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 414 555 6506",
      "email": "contact@blossomdecor.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v6",
    "name": "Prestige Group",
    "category": "planners",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.4,
    "reviews": 375,
    "priceRange": "$2,600 - $5,200",
    "priceValue": 2600,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 250 555 1260",
      "email": "contact@prestigegroup.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v7",
    "name": "Intricate by Priya",
    "category": "mehndi",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.3,
    "reviews": 222,
    "priceRange": "$150 - $370",
    "priceValue": 150,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 931 555 8138",
      "email": "contact@intricatebypriya.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v8",
    "name": "Oasis Terrace",
    "category": "venues",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.8,
    "reviews": 323,
    "priceRange": "$15,000 - $17,000",
    "priceValue": 15000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 800 555 1915",
      "email": "contact@oasisterrace.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v9",
    "name": "Eternal Visuals",
    "category": "photographers",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.9,
    "reviews": 102,
    "priceRange": "$500 - $1,400",
    "priceValue": 500,
    "images": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 285 555 2329",
      "email": "contact@eternalvisuals.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v10",
    "name": "Radiant Makeovers",
    "category": "makeup",
    "location": "Downtown",
    "city": "New York",
    "rating": 3,
    "reviews": 188,
    "priceRange": "$440 - $550",
    "priceValue": 440,
    "images": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 309 555 1514",
      "email": "contact@radiantmakeovers.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v11",
    "name": "Cuisine Kitchen",
    "category": "caterers",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.6,
    "reviews": 38,
    "priceRange": "$48 - $66 per plate",
    "priceValue": 48,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 288 555 4147",
      "email": "contact@cuisinekitchen.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v12",
    "name": "Floral Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.5,
    "reviews": 54,
    "priceRange": "$700 - $2,200",
    "priceValue": 700,
    "images": [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 693 555 7108",
      "email": "contact@floralstudios.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v13",
    "name": "Bliss Boutique",
    "category": "planners",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.1,
    "reviews": 150,
    "priceRange": "$1,600 - $3,200",
    "priceValue": 1600,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 777 555 5949",
      "email": "contact@blissboutique.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v14",
    "name": "Traditional Creations",
    "category": "mehndi",
    "location": "Downtown",
    "city": "New York",
    "rating": 4.4,
    "reviews": 488,
    "priceRange": "$70 - $310",
    "priceValue": 70,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 228 555 4422",
      "email": "contact@traditionalcreations.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v15",
    "name": "Silver Palace",
    "category": "venues",
    "location": "Downtown",
    "city": "New York",
    "rating": 3.1,
    "reviews": 193,
    "priceRange": "$15,000 - $23,000",
    "priceValue": 15000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of New York. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 652 555 3221",
      "email": "contact@silverpalace.com",
      "address": "123 Main St, Downtown, New York"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v16",
    "name": "Oasis Gardens",
    "category": "venues",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.5,
    "reviews": 303,
    "priceRange": "$10,000 - $13,000",
    "priceValue": 10000,
    "images": [
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 450 555 4103",
      "email": "contact@oasisgardens.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v17",
    "name": "Lens Media",
    "category": "photographers",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.7,
    "reviews": 86,
    "priceRange": "$2,800 - $4,300",
    "priceValue": 2800,
    "images": [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 719 555 4481",
      "email": "contact@lensmedia.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v18",
    "name": "Glamour Lounge",
    "category": "makeup",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.2,
    "reviews": 401,
    "priceRange": "$210 - $580",
    "priceValue": 210,
    "images": [
      "https://images.unsplash.com/photo-1512496115851-a1ab392cd3aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 435 555 6412",
      "email": "contact@glamourlounge.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v19",
    "name": "Delight Catering Co.",
    "category": "caterers",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.4,
    "reviews": 142,
    "priceRange": "$48 - $67 per plate",
    "priceValue": 48,
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 863 555 8328",
      "email": "contact@delightcateringco..com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v20",
    "name": "Magic Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 5,
    "reviews": 223,
    "priceRange": "$1,900 - $3,900",
    "priceValue": 1900,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 883 555 4731",
      "email": "contact@magicstudios.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v21",
    "name": "Perfect Events",
    "category": "planners",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.2,
    "reviews": 194,
    "priceRange": "$1,300 - $4,100",
    "priceValue": 1300,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 488 555 1477",
      "email": "contact@perfectevents.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "14 years"
      }
    ]
  },
  {
    "id": "v22",
    "name": "Henna Studio",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.1,
    "reviews": 182,
    "priceRange": "$160 - $430",
    "priceValue": 160,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564344074-1290e2270921?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 767 555 9325",
      "email": "contact@hennastudio.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v23",
    "name": "Sapphire Resort",
    "category": "venues",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.8,
    "reviews": 145,
    "priceRange": "$11,000 - $14,000",
    "priceValue": 11000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 994 555 2076",
      "email": "contact@sapphireresort.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v24",
    "name": "Snap Media",
    "category": "photographers",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.5,
    "reviews": 104,
    "priceRange": "$1,900 - $2,900",
    "priceValue": 1900,
    "images": [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 286 555 8252",
      "email": "contact@snapmedia.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v25",
    "name": "Glamour Cosmetics",
    "category": "makeup",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.3,
    "reviews": 276,
    "priceRange": "$350 - $550",
    "priceValue": 350,
    "images": [
      "https://images.unsplash.com/photo-1596704017254-9bd12ceb9e1e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512496115851-a1ab392cd3aa?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 264 555 1591",
      "email": "contact@glamourcosmetics.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v26",
    "name": "Aroma Foods",
    "category": "caterers",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 3.3,
    "reviews": 235,
    "priceRange": "$49 - $70 per plate",
    "priceValue": 49,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 670 555 2854",
      "email": "contact@aromafoods.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "14 years"
      }
    ]
  },
  {
    "id": "v27",
    "name": "Vibrant Interiors",
    "category": "decorators",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.7,
    "reviews": 167,
    "priceRange": "$1,400 - $3,100",
    "priceValue": 1400,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 624 555 6183",
      "email": "contact@vibrantinteriors.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v28",
    "name": "Perfect Agency",
    "category": "planners",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.1,
    "reviews": 16,
    "priceRange": "$1,000 - $2,300",
    "priceValue": 1000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 830 555 5604",
      "email": "contact@perfectagency.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v29",
    "name": "Henna Creations",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.5,
    "reviews": 481,
    "priceRange": "$140 - $290",
    "priceValue": 140,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564344074-1290e2270921?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 690 555 2615",
      "email": "contact@hennacreations.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v30",
    "name": "Emerald Manor",
    "category": "venues",
    "location": "Downtown",
    "city": "Los Angeles",
    "rating": 4.7,
    "reviews": 274,
    "priceRange": "$15,000 - $24,000",
    "priceValue": 15000,
    "images": [
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Los Angeles. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 504 555 1366",
      "email": "contact@emeraldmanor.com",
      "address": "123 Main St, Downtown, Los Angeles"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v31",
    "name": "Sunset Hall",
    "category": "venues",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3.9,
    "reviews": 269,
    "priceRange": "$3,000 - $5,000",
    "priceValue": 3000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 820 555 5861",
      "email": "contact@sunsethall.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v32",
    "name": "Pixel Visuals",
    "category": "photographers",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3.1,
    "reviews": 488,
    "priceRange": "$2,200 - $3,400",
    "priceValue": 2200,
    "images": [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 255 555 8423",
      "email": "contact@pixelvisuals.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v33",
    "name": "Elegant Makeovers",
    "category": "makeup",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.9,
    "reviews": 368,
    "priceRange": "$160 - $410",
    "priceValue": 160,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 739 555 6453",
      "email": "contact@elegantmakeovers.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v34",
    "name": "Saffron Culinary",
    "category": "caterers",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.3,
    "reviews": 222,
    "priceRange": "$49 - $62 per plate",
    "priceValue": 49,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 893 555 3983",
      "email": "contact@saffronculinary.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v35",
    "name": "Vibrant Interiors",
    "category": "decorators",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3,
    "reviews": 68,
    "priceRange": "$2,300 - $3,200",
    "priceValue": 2300,
    "images": [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 875 555 5795",
      "email": "contact@vibrantinteriors.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v36",
    "name": "Prestige Weddings",
    "category": "planners",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.2,
    "reviews": 456,
    "priceRange": "$2,200 - $4,500",
    "priceValue": 2200,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 723 555 6740",
      "email": "contact@prestigeweddings.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v37",
    "name": "Intricate Designs",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.9,
    "reviews": 102,
    "priceRange": "$150 - $330",
    "priceValue": 150,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1585422851410-a292854992dc?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 724 555 8659",
      "email": "contact@intricatedesigns.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v38",
    "name": "Crystal Ballroom",
    "category": "venues",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.4,
    "reviews": 477,
    "priceRange": "$4,000 - $7,000",
    "priceValue": 4000,
    "images": [
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 744 555 9393",
      "email": "contact@crystalballroom.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v39",
    "name": "Snap Media",
    "category": "photographers",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3.3,
    "reviews": 437,
    "priceRange": "$1,500 - $2,200",
    "priceValue": 1500,
    "images": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 528 555 7451",
      "email": "contact@snapmedia.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v40",
    "name": "Pure Studio",
    "category": "makeup",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3.6,
    "reviews": 44,
    "priceRange": "$450 - $660",
    "priceValue": 450,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 507 555 8090",
      "email": "contact@purestudio.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v41",
    "name": "Bite Caterers",
    "category": "caterers",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.1,
    "reviews": 172,
    "priceRange": "$16 - $37 per plate",
    "priceValue": 16,
    "images": [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 629 555 8665",
      "email": "contact@bitecaterers.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v42",
    "name": "Floral Decor",
    "category": "decorators",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 3.5,
    "reviews": 186,
    "priceRange": "$2,900 - $4,900",
    "priceValue": 2900,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 561 555 9547",
      "email": "contact@floraldecor.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v43",
    "name": "Dream Day Co.",
    "category": "planners",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.6,
    "reviews": 228,
    "priceRange": "$2,200 - $4,200",
    "priceValue": 2200,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 648 555 6394",
      "email": "contact@dreamdayco..com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v44",
    "name": "Grace Creations",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.6,
    "reviews": 398,
    "priceRange": "$170 - $320",
    "priceValue": 170,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 898 555 5203",
      "email": "contact@gracecreations.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v45",
    "name": "Diamond Terrace",
    "category": "venues",
    "location": "Downtown",
    "city": "Chicago",
    "rating": 4.3,
    "reviews": 11,
    "priceRange": "$16,000 - $24,000",
    "priceValue": 16000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Chicago. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 970 555 9360",
      "email": "contact@diamondterrace.com",
      "address": "123 Main St, Downtown, Chicago"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v46",
    "name": "Golden Pavilion",
    "category": "venues",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.9,
    "reviews": 62,
    "priceRange": "$13,000 - $22,000",
    "priceValue": 13000,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 715 555 8852",
      "email": "contact@goldenpavilion.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v47",
    "name": "Glow Crew",
    "category": "photographers",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.6,
    "reviews": 118,
    "priceRange": "$2,400 - $3,600",
    "priceValue": 2400,
    "images": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 507 555 9581",
      "email": "contact@glowcrew.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v48",
    "name": "Chic by Jessica",
    "category": "makeup",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.1,
    "reviews": 408,
    "priceRange": "$440 - $660",
    "priceValue": 440,
    "images": [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1596704017254-9bd12ceb9e1e?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 317 555 9974",
      "email": "contact@chicbyjessica.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v49",
    "name": "Taste Culinary",
    "category": "caterers",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.3,
    "reviews": 324,
    "priceRange": "$11 - $23 per plate",
    "priceValue": 11,
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 291 555 6423",
      "email": "contact@tasteculinary.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v50",
    "name": "Aesthetic Art",
    "category": "decorators",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.5,
    "reviews": 410,
    "priceRange": "$500 - $1,300",
    "priceValue": 500,
    "images": [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 567 555 7509",
      "email": "contact@aestheticart.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v51",
    "name": "Grand Boutique",
    "category": "planners",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.6,
    "reviews": 329,
    "priceRange": "$2,800 - $5,200",
    "priceValue": 2800,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 346 555 5972",
      "email": "contact@grandboutique.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v52",
    "name": "Shades Mehendi",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.9,
    "reviews": 382,
    "priceRange": "$50 - $230",
    "priceValue": 50,
    "images": [
      "https://images.unsplash.com/photo-1564344074-1290e2270921?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 992 555 4549",
      "email": "contact@shadesmehendi.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v53",
    "name": "Oasis Pavilion",
    "category": "venues",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.8,
    "reviews": 225,
    "priceRange": "$17,000 - $27,000",
    "priceValue": 17000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 785 555 8632",
      "email": "contact@oasispavilion.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v54",
    "name": "Glow Art",
    "category": "photographers",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.6,
    "reviews": 355,
    "priceRange": "$2,000 - $3,400",
    "priceValue": 2000,
    "images": [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 771 555 9036",
      "email": "contact@glowart.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v55",
    "name": "Flawless by Jessica",
    "category": "makeup",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.7,
    "reviews": 27,
    "priceRange": "$230 - $540",
    "priceValue": 230,
    "images": [
      "https://images.unsplash.com/photo-1512496115851-a1ab392cd3aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 229 555 9368",
      "email": "contact@flawlessbyjessica.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v56",
    "name": "Taste Catering Co.",
    "category": "caterers",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.3,
    "reviews": 455,
    "priceRange": "$29 - $44 per plate",
    "priceValue": 29,
    "images": [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 317 555 6855",
      "email": "contact@tastecateringco..com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v57",
    "name": "Lush Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.9,
    "reviews": 334,
    "priceRange": "$1,600 - $2,200",
    "priceValue": 1600,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 711 555 8997",
      "email": "contact@lushstudios.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v58",
    "name": "Joy Planners",
    "category": "planners",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.4,
    "reviews": 57,
    "priceRange": "$1,000 - $2,200",
    "priceValue": 1000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 269 555 6737",
      "email": "contact@joyplanners.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v59",
    "name": "Henna by Aisha",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Houston",
    "rating": 4.4,
    "reviews": 402,
    "priceRange": "$180 - $420",
    "priceValue": 180,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 342 555 4610",
      "email": "contact@hennabyaisha.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v60",
    "name": "Grand Manor",
    "category": "venues",
    "location": "Downtown",
    "city": "Houston",
    "rating": 3.3,
    "reviews": 495,
    "priceRange": "$4,000 - $9,000",
    "priceValue": 4000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Houston. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 549 555 4643",
      "email": "contact@grandmanor.com",
      "address": "123 Main St, Downtown, Houston"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v61",
    "name": "Oasis Hall",
    "category": "venues",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.5,
    "reviews": 109,
    "priceRange": "$2,000 - $5,000",
    "priceValue": 2000,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 503 555 7091",
      "email": "contact@oasishall.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v62",
    "name": "Dream Art",
    "category": "photographers",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.6,
    "reviews": 348,
    "priceRange": "$1,700 - $2,500",
    "priceValue": 1700,
    "images": [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 866 555 4962",
      "email": "contact@dreamart.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v63",
    "name": "Radiant by Emma",
    "category": "makeup",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.8,
    "reviews": 210,
    "priceRange": "$480 - $680",
    "priceValue": 480,
    "images": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 233 555 3995",
      "email": "contact@radiantbyemma.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v64",
    "name": "Delight Catering Co.",
    "category": "caterers",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.8,
    "reviews": 141,
    "priceRange": "$25 - $36 per plate",
    "priceValue": 25,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 557 555 9179",
      "email": "contact@delightcateringco..com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v65",
    "name": "Petal Interiors",
    "category": "decorators",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.8,
    "reviews": 181,
    "priceRange": "$2,900 - $3,700",
    "priceValue": 2900,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 450 555 6864",
      "email": "contact@petalinteriors.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v66",
    "name": "Perfect Co.",
    "category": "planners",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.4,
    "reviews": 493,
    "priceRange": "$3,400 - $5,500",
    "priceValue": 3400,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 284 555 9409",
      "email": "contact@perfectco..com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v67",
    "name": "Paisley Henna",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.6,
    "reviews": 181,
    "priceRange": "$70 - $220",
    "priceValue": 70,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1585422851410-a292854992dc?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 579 555 6550",
      "email": "contact@paisleyhenna.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v68",
    "name": "Majestic Estate",
    "category": "venues",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.9,
    "reviews": 174,
    "priceRange": "$5,000 - $8,000",
    "priceValue": 5000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 978 555 3592",
      "email": "contact@majesticestate.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v69",
    "name": "Vision Captures",
    "category": "photographers",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.2,
    "reviews": 7,
    "priceRange": "$1,400 - $2,900",
    "priceValue": 1400,
    "images": [
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 978 555 5955",
      "email": "contact@visioncaptures.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v70",
    "name": "Glow Artistry",
    "category": "makeup",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.4,
    "reviews": 83,
    "priceRange": "$460 - $700",
    "priceValue": 460,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1596704017254-9bd12ceb9e1e?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 259 555 1650",
      "email": "contact@glowartistry.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v71",
    "name": "Savor Events",
    "category": "caterers",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.6,
    "reviews": 126,
    "priceRange": "$16 - $32 per plate",
    "priceValue": 16,
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 983 555 4721",
      "email": "contact@savorevents.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v72",
    "name": "Aesthetic Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.7,
    "reviews": 261,
    "priceRange": "$1,500 - $2,100",
    "priceValue": 1500,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 249 555 3805",
      "email": "contact@aestheticstudios.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v73",
    "name": "Seamless Planners",
    "category": "planners",
    "location": "Downtown",
    "city": "Miami",
    "rating": 3.2,
    "reviews": 385,
    "priceRange": "$3,600 - $5,800",
    "priceValue": 3600,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 387 555 2528",
      "email": "contact@seamlessplanners.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v74",
    "name": "Henna Mehendi",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.7,
    "reviews": 291,
    "priceRange": "$140 - $400",
    "priceValue": 140,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564344074-1290e2270921?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 581 555 6402",
      "email": "contact@hennamehendi.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v75",
    "name": "Diamond Resort",
    "category": "venues",
    "location": "Downtown",
    "city": "Miami",
    "rating": 4.8,
    "reviews": 374,
    "priceRange": "$15,000 - $18,000",
    "priceValue": 15000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Miami. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 784 555 7632",
      "email": "contact@diamondresort.com",
      "address": "123 Main St, Downtown, Miami"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v76",
    "name": "Golden Palace",
    "category": "venues",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.3,
    "reviews": 322,
    "priceRange": "$3,000 - $6,000",
    "priceValue": 3000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 567 555 5635",
      "email": "contact@goldenpalace.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "14 years"
      }
    ]
  },
  {
    "id": "v77",
    "name": "Dream Crew",
    "category": "photographers",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.3,
    "reviews": 133,
    "priceRange": "$1,800 - $2,700",
    "priceValue": 1800,
    "images": [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 923 555 5277",
      "email": "contact@dreamcrew.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v78",
    "name": "Glow Studio",
    "category": "makeup",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3,
    "reviews": 18,
    "priceRange": "$480 - $710",
    "priceValue": 480,
    "images": [
      "https://images.unsplash.com/photo-1596704017254-9bd12ceb9e1e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 601 555 8572",
      "email": "contact@glowstudio.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v79",
    "name": "Cuisine Foods",
    "category": "caterers",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.4,
    "reviews": 370,
    "priceRange": "$42 - $55 per plate",
    "priceValue": 42,
    "images": [
      "https://images.unsplash.com/photo-1414235077428-971145534400?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 287 555 5760",
      "email": "contact@cuisinefoods.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v80",
    "name": "Petal Events",
    "category": "decorators",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.3,
    "reviews": 292,
    "priceRange": "$2,000 - $3,300",
    "priceValue": 2000,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 302 555 5496",
      "email": "contact@petalevents.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v81",
    "name": "Joy Boutique",
    "category": "planners",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.6,
    "reviews": 454,
    "priceRange": "$1,000 - $2,300",
    "priceValue": 1000,
    "images": [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 877 555 2735",
      "email": "contact@joyboutique.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v82",
    "name": "Lotus by Aisha",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.5,
    "reviews": 380,
    "priceRange": "$170 - $360",
    "priceValue": 170,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 875 555 1469",
      "email": "contact@lotusbyaisha.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v83",
    "name": "Silver Ballroom",
    "category": "venues",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.8,
    "reviews": 416,
    "priceRange": "$20,000 - $28,000",
    "priceValue": 20000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 999 555 3687",
      "email": "contact@silverballroom.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v84",
    "name": "Snap Visuals",
    "category": "photographers",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.9,
    "reviews": 391,
    "priceRange": "$1,600 - $2,600",
    "priceValue": 1600,
    "images": [
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 624 555 3826",
      "email": "contact@snapvisuals.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "9 years"
      }
    ]
  },
  {
    "id": "v85",
    "name": "Elegant by Jessica",
    "category": "makeup",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.3,
    "reviews": 78,
    "priceRange": "$270 - $560",
    "priceValue": 270,
    "images": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 432 555 5429",
      "email": "contact@elegantbyjessica.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v86",
    "name": "Bite Foods",
    "category": "caterers",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.3,
    "reviews": 347,
    "priceRange": "$50 - $74 per plate",
    "priceValue": 50,
    "images": [
      "https://images.unsplash.com/photo-1414235077428-971145534400?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 702 555 1729",
      "email": "contact@bitefoods.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v87",
    "name": "Elegant Creations",
    "category": "decorators",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.8,
    "reviews": 249,
    "priceRange": "$600 - $1,400",
    "priceValue": 600,
    "images": [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 337 555 4937",
      "email": "contact@elegantcreations.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v88",
    "name": "Joy Co.",
    "category": "planners",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 3.6,
    "reviews": 462,
    "priceRange": "$3,800 - $5,500",
    "priceValue": 3800,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 302 555 7486",
      "email": "contact@joyco..com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v89",
    "name": "Bridal Creations",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.1,
    "reviews": 308,
    "priceRange": "$90 - $370",
    "priceValue": 90,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564344074-1290e2270921?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 259 555 3274",
      "email": "contact@bridalcreations.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v90",
    "name": "Silver Pavilion",
    "category": "venues",
    "location": "Downtown",
    "city": "Las Vegas",
    "rating": 4.4,
    "reviews": 427,
    "priceRange": "$20,000 - $27,000",
    "priceValue": 20000,
    "images": [
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Las Vegas. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 914 555 9033",
      "email": "contact@silverpavilion.com",
      "address": "123 Main St, Downtown, Las Vegas"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v91",
    "name": "Majestic Terrace",
    "category": "venues",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.5,
    "reviews": 477,
    "priceRange": "$20,000 - $27,000",
    "priceValue": 20000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 440 555 3934",
      "email": "contact@majesticterrace.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v92",
    "name": "Lens Visuals",
    "category": "photographers",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.6,
    "reviews": 203,
    "priceRange": "$3,000 - $3,600",
    "priceValue": 3000,
    "images": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 592 555 5771",
      "email": "contact@lensvisuals.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v93",
    "name": "Angel Studio",
    "category": "makeup",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.2,
    "reviews": 186,
    "priceRange": "$230 - $550",
    "priceValue": 230,
    "images": [
      "https://images.unsplash.com/photo-1512496115851-a1ab392cd3aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 582 555 9696",
      "email": "contact@angelstudio.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v94",
    "name": "Delight Banquets",
    "category": "caterers",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4,
    "reviews": 399,
    "priceRange": "$19 - $32 per plate",
    "priceValue": 19,
    "images": [
      "https://images.unsplash.com/photo-1414235077428-971145534400?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 981 555 7853",
      "email": "contact@delightbanquets.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v95",
    "name": "Dream Decor",
    "category": "decorators",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.7,
    "reviews": 320,
    "priceRange": "$800 - $1,800",
    "priceValue": 800,
    "images": [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 353 555 8638",
      "email": "contact@dreamdecor.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v96",
    "name": "Dream Day Agency",
    "category": "planners",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.8,
    "reviews": 61,
    "priceRange": "$3,200 - $5,000",
    "priceValue": 3200,
    "images": [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 672 555 5689",
      "email": "contact@dreamdayagency.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v97",
    "name": "Bridal Art",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.3,
    "reviews": 467,
    "priceRange": "$110 - $230",
    "priceValue": 110,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1585422851410-a292854992dc?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 824 555 5163",
      "email": "contact@bridalart.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v98",
    "name": "Silver Terrace",
    "category": "venues",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.4,
    "reviews": 100,
    "priceRange": "$4,000 - $8,000",
    "priceValue": 4000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 947 555 8003",
      "email": "contact@silverterrace.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v99",
    "name": "Lens Captures",
    "category": "photographers",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.5,
    "reviews": 366,
    "priceRange": "$1,000 - $1,600",
    "priceValue": 1000,
    "images": [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 882 555 1786",
      "email": "contact@lenscaptures.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v100",
    "name": "Angel Cosmetics",
    "category": "makeup",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.5,
    "reviews": 165,
    "priceRange": "$150 - $440",
    "priceValue": 150,
    "images": [
      "https://images.unsplash.com/photo-1596704017254-9bd12ceb9e1e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 412 555 2245",
      "email": "contact@angelcosmetics.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v101",
    "name": "Bite Banquets",
    "category": "caterers",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.7,
    "reviews": 251,
    "priceRange": "$40 - $57 per plate",
    "priceValue": 40,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 916 555 4054",
      "email": "contact@bitebanquets.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "7 years"
      }
    ]
  },
  {
    "id": "v102",
    "name": "Blossom Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.1,
    "reviews": 108,
    "priceRange": "$2,900 - $3,600",
    "priceValue": 2900,
    "images": [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 578 555 5925",
      "email": "contact@blossomstudios.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "15 years"
      }
    ]
  },
  {
    "id": "v103",
    "name": "Bespoke Planners",
    "category": "planners",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4,
    "reviews": 81,
    "priceRange": "$2,200 - $4,700",
    "priceValue": 2200,
    "images": [
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 514 555 9303",
      "email": "contact@bespokeplanners.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v104",
    "name": "Artistic Art",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 3.4,
    "reviews": 194,
    "priceRange": "$140 - $290",
    "priceValue": 140,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 283 555 5077",
      "email": "contact@artisticart.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "4 years"
      }
    ]
  },
  {
    "id": "v105",
    "name": "Silver Gardens",
    "category": "venues",
    "location": "Downtown",
    "city": "Atlanta",
    "rating": 4.6,
    "reviews": 473,
    "priceRange": "$5,000 - $11,000",
    "priceValue": 5000,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Atlanta. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 824 555 6966",
      "email": "contact@silvergardens.com",
      "address": "123 Main St, Downtown, Atlanta"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v106",
    "name": "Sapphire Estate",
    "category": "venues",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.3,
    "reviews": 474,
    "priceRange": "$14,000 - $17,000",
    "priceValue": 14000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c270?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 671 555 1101",
      "email": "contact@sapphireestate.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "5 years"
      }
    ]
  },
  {
    "id": "v107",
    "name": "Eternal Collective",
    "category": "photographers",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.3,
    "reviews": 214,
    "priceRange": "$1,100 - $1,700",
    "priceValue": 1100,
    "images": [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 884 555 9801",
      "email": "contact@eternalcollective.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "12 years"
      }
    ]
  },
  {
    "id": "v108",
    "name": "Glamour Cosmetics",
    "category": "makeup",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.1,
    "reviews": 126,
    "priceRange": "$120 - $310",
    "priceValue": 120,
    "images": [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 457 555 7641",
      "email": "contact@glamourcosmetics.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "14 years"
      }
    ]
  },
  {
    "id": "v109",
    "name": "Taste Banquets",
    "category": "caterers",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.1,
    "reviews": 13,
    "priceRange": "$12 - $31 per plate",
    "priceValue": 12,
    "images": [
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 960 555 8395",
      "email": "contact@tastebanquets.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "11 years"
      }
    ]
  },
  {
    "id": "v110",
    "name": "Vibrant Studios",
    "category": "decorators",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.2,
    "reviews": 39,
    "priceRange": "$1,300 - $1,900",
    "priceValue": 1300,
    "images": [
      "https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 591 555 9863",
      "email": "contact@vibrantstudios.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v111",
    "name": "Bliss Agency",
    "category": "planners",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.1,
    "reviews": 118,
    "priceRange": "$2,900 - $5,500",
    "priceValue": 2900,
    "images": [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 201 555 6138",
      "email": "contact@blissagency.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "14 years"
      }
    ]
  },
  {
    "id": "v112",
    "name": "Henna Henna",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.9,
    "reviews": 258,
    "priceRange": "$160 - $400",
    "priceValue": 160,
    "images": [
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 934 555 2053",
      "email": "contact@hennahenna.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "10 years"
      }
    ]
  },
  {
    "id": "v113",
    "name": "Sapphire Palace",
    "category": "venues",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4,
    "reviews": 413,
    "priceRange": "$17,000 - $21,000",
    "priceValue": 17000,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 407 555 8784",
      "email": "contact@sapphirepalace.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v114",
    "name": "Capture Art",
    "category": "photographers",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.8,
    "reviews": 386,
    "priceRange": "$1,900 - $3,000",
    "priceValue": 1900,
    "images": [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium photographers services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 271 555 9777",
      "email": "contact@captureart.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v115",
    "name": "Chic Artistry",
    "category": "makeup",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.8,
    "reviews": 147,
    "priceRange": "$440 - $550",
    "priceValue": 440,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium makeup services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 511 555 3039",
      "email": "contact@chicartistry.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "3 years"
      }
    ]
  },
  {
    "id": "v116",
    "name": "Gourmet Dining",
    "category": "caterers",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.5,
    "reviews": 22,
    "priceRange": "$23 - $49 per plate",
    "priceValue": 23,
    "images": [
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium caterers services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 228 555 1214",
      "email": "contact@gourmetdining.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v117",
    "name": "Aesthetic Concepts",
    "category": "decorators",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.7,
    "reviews": 15,
    "priceRange": "$700 - $2,200",
    "priceValue": 700,
    "images": [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium decorators services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 555 555 9552",
      "email": "contact@aestheticconcepts.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "8 years"
      }
    ]
  },
  {
    "id": "v118",
    "name": "Prestige Planners",
    "category": "planners",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.9,
    "reviews": 42,
    "priceRange": "$2,900 - $5,100",
    "priceValue": 2900,
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505944270255-07bbf86e1074?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium planners services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 203 555 5986",
      "email": "contact@prestigeplanners.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  },
  {
    "id": "v119",
    "name": "Artistic Henna",
    "category": "mehndi",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 3.2,
    "reviews": 339,
    "priceRange": "$150 - $360",
    "priceValue": 150,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605337227461-8eb1cf56b823?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium mehndi services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 672 555 4221",
      "email": "contact@artistichenna.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "13 years"
      }
    ]
  },
  {
    "id": "v120",
    "name": "Sunset Estate",
    "category": "venues",
    "location": "Downtown",
    "city": "Seattle",
    "rating": 4.2,
    "reviews": 92,
    "priceRange": "$8,000 - $13,000",
    "priceValue": 8000,
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    "description": "Premium venues services located in the heart of Seattle. Delivering exceptional quality for your special day.",
    "services": [
      "Service 1",
      "Service 2",
      "Service 3"
    ],
    "contact": {
      "phone": "+1 771 555 3592",
      "email": "contact@sunsetestate.com",
      "address": "123 Main St, Downtown, Seattle"
    },
    "features": [
      {
        "label": "Premium",
        "value": true
      },
      {
        "label": "Experience",
        "value": "6 years"
      }
    ]
  }
];
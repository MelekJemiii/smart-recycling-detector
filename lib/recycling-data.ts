export type RecyclingCategory =
  | "plastic"
  | "glass"
  | "metal"
  | "paper"
  | "organic"
  | "electronics"
  | "hazardous"
  | "textile"
  | "unknown";

export interface RecyclingInfo {
  category: RecyclingCategory;
  recyclable: boolean;
  bin: string;
  binColor: string;
  instructions: string[];
  tips: string[];
  acceptedMaterials: string[];
  notAccepted: string[];
  environmentalImpact: EnvironmentalImpact;
  icon: string;
}

export interface EnvironmentalImpact {
  co2SavedKg: number;        // kg of CO2 saved per item recycled
  waterSavedLiters: number;  // liters of water saved per item
  energySavedKwh: number;    // kWh of energy saved per item
  decompositionYears: number; // years to decompose if landfilled
  description: string;
}

// Keyword map: Vision API labels → recycling category
const KEYWORD_MAP: Record<string, RecyclingCategory> = {
  // Plastic
  plastic: "plastic",
  bottle: "plastic",
  "plastic bottle": "plastic",
  "water bottle": "plastic",
  "plastic bag": "plastic",
  container: "plastic",
  "plastic container": "plastic",
  cup: "plastic",
  straw: "plastic",
  packaging: "plastic",
  "food packaging": "plastic",
  "polystyrene": "plastic",

  // Glass
  glass: "glass",
  "glass bottle": "glass",
  jar: "glass",
  "wine bottle": "glass",
  "beer bottle": "glass",
  mirror: "glass",
  window: "glass",

  // Metal
  metal: "metal",
  can: "metal",
  aluminum: "metal",
  aluminium: "metal",
  tin: "metal",
  steel: "metal",
  "aluminum can": "metal",
  "soda can": "metal",
  "tin can": "metal",
  foil: "metal",

  // Paper
  paper: "paper",
  cardboard: "paper",
  newspaper: "paper",
  magazine: "paper",
  book: "paper",
  "paper bag": "paper",
  box: "paper",
  "cardboard box": "paper",
  envelope: "paper",
  tissue: "paper",

  // Organic
  food: "organic",
  fruit: "organic",
  vegetable: "organic",
  "food waste": "organic",
  compost: "organic",
  leaf: "organic",
  leaves: "organic",
  plant: "organic",
  wood: "organic",
  "coffee grounds": "organic",
  eggshell: "organic",

  // Electronics
  electronics: "electronics",
  phone: "electronics",
  "mobile phone": "electronics",
  smartphone: "electronics",
  laptop: "electronics",
  computer: "electronics",
  tablet: "electronics",
  battery: "electronics",
  cable: "electronics",
  charger: "electronics",
  keyboard: "electronics",
  "electronic device": "electronics",
  television: "electronics",

  // Hazardous
  paint: "hazardous",
  battery: "hazardous",
  chemical: "hazardous",
  "motor oil": "hazardous",
  pesticide: "hazardous",
  medicine: "hazardous",
  "light bulb": "hazardous",
  "fluorescent lamp": "hazardous",

  // Textile
  clothing: "textile",
  fabric: "textile",
  shirt: "textile",
  jeans: "textile",
  shoe: "textile",
  textile: "textile",
  cloth: "textile",
};

const RECYCLING_INFO: Record<RecyclingCategory, RecyclingInfo> = {
  plastic: {
    category: "plastic",
    recyclable: true,
    bin: "Recycling Bin",
    binColor: "#3b82f6",
    icon: "🔵",
    instructions: [
      "Rinse out any food or liquid residue thoroughly",
      "Remove caps and lids (check if they are recyclable separately)",
      "Flatten bottles to save space in the bin",
      "Check the recycling number (1–7) on the bottom — most areas accept #1 and #2",
      "Do NOT include plastic bags — take them to store drop-off points",
    ],
    tips: [
      "PET (#1) and HDPE (#2) plastics are the most widely accepted",
      "Black plastic is often not recyclable due to sorting difficulties",
      "Avoid wishful recycling — when in doubt, leave it out",
    ],
    acceptedMaterials: [
      "Clear/colored plastic bottles",
      "Milk jugs",
      "Detergent bottles",
      "Yogurt containers (#1, #2)",
    ],
    notAccepted: [
      "Plastic bags and film",
      "Styrofoam",
      "Straws",
      "Plastic utensils",
      "Black plastic trays",
    ],
    environmentalImpact: {
      co2SavedKg: 1.5,
      waterSavedLiters: 3.8,
      energySavedKwh: 5.8,
      decompositionYears: 450,
      description:
        "Recycling one plastic bottle saves enough energy to power a 60W light bulb for 6 hours.",
    },
  },

  glass: {
    category: "glass",
    recyclable: true,
    bin: "Glass Recycling Bin",
    binColor: "#10b981",
    icon: "🟢",
    instructions: [
      "Rinse thoroughly — no need to scrub labels off",
      "Sort by color if your facility requires it (clear, green, brown)",
      "Do NOT include broken glass in curbside bins — wrap and dispose separately",
      "Remove metal lids and recycle them separately",
      "Never mix with Pyrex, ceramics, or window glass",
    ],
    tips: [
      "Glass is 100% recyclable and can be recycled endlessly without quality loss",
      "Ceramics and Pyrex have different melting points and contaminate glass batches",
      "One recycled glass bottle saves enough energy to power a computer for 25 minutes",
    ],
    acceptedMaterials: [
      "Food and drink glass bottles",
      "Glass jars (pasta, jam, etc.)",
      "Wine and beer bottles",
    ],
    notAccepted: [
      "Window glass / plate glass",
      "Mirrors",
      "Pyrex / ovenware",
      "Crystal glassware",
      "Ceramics",
      "Broken glass",
    ],
    environmentalImpact: {
      co2SavedKg: 0.3,
      waterSavedLiters: 7.5,
      energySavedKwh: 2.5,
      decompositionYears: 1000000,
      description:
        "Glass never fully decomposes in landfills. Recycling it reduces mining demand by 50%.",
    },
  },

  metal: {
    category: "metal",
    recyclable: true,
    bin: "Recycling Bin",
    binColor: "#f59e0b",
    icon: "🟡",
    instructions: [
      "Rinse cans to remove food residue",
      "You can crush cans to save space",
      "Aluminum foil is recyclable — scrunch into a ball for sorting",
      "Aerosol cans are recyclable when completely empty",
      "Leave the lid attached or place inside the can",
    ],
    tips: [
      "Aluminum can be recycled infinitely without losing quality",
      "Recycling aluminum uses only 5% of the energy needed to produce new aluminum",
      "Steel cans are magnetic — facilities sort them with magnets",
    ],
    acceptedMaterials: [
      "Aluminum cans",
      "Steel/tin food cans",
      "Aluminum foil (balled up)",
      "Empty aerosol cans",
      "Metal lids and caps",
    ],
    notAccepted: [
      "Paint cans with wet paint",
      "Propane tanks",
      "Scrap metal (take to a scrap dealer)",
      "Needles or sharps",
    ],
    environmentalImpact: {
      co2SavedKg: 9.1,
      waterSavedLiters: 1.0,
      energySavedKwh: 14.0,
      decompositionYears: 80,
      description:
        "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    },
  },

  paper: {
    category: "paper",
    recyclable: true,
    bin: "Paper Recycling Bin",
    binColor: "#8b5cf6",
    icon: "🟣",
    instructions: [
      "Keep paper dry — wet paper is harder to recycle",
      "Flatten cardboard boxes before placing in the bin",
      "Remove plastic windows from envelopes if possible",
      "Shredded paper can be composted or placed in a sealed bag",
      "Avoid recycling paper contaminated with food grease (e.g., pizza boxes)",
    ],
    tips: [
      "One ton of recycled paper saves 17 trees and 7,000 gallons of water",
      "Paper can typically be recycled 5–7 times before fibers become too short",
      "Greasy pizza boxes go in compost, not recycling",
    ],
    acceptedMaterials: [
      "Newspapers and magazines",
      "Office paper",
      "Cardboard and cereal boxes",
      "Paper bags",
      "Envelopes",
      "Egg cartons",
    ],
    notAccepted: [
      "Greasy or food-soiled paper",
      "Waxed paper or cardboard",
      "Thermal/fax paper",
      "Paper cups (plastic-lined)",
      "Tissues and napkins",
    ],
    environmentalImpact: {
      co2SavedKg: 0.9,
      waterSavedLiters: 26.5,
      energySavedKwh: 4.1,
      decompositionYears: 5,
      description:
        "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 3 cubic yards of landfill space.",
    },
  },

  organic: {
    category: "organic",
    recyclable: true,
    bin: "Compost / Green Waste Bin",
    binColor: "#65a30d",
    icon: "🌱",
    instructions: [
      "Place in a compost bin or designated green waste collection",
      "Mix 'greens' (fruit, veg) with 'browns' (leaves, cardboard) for balanced compost",
      "Avoid composting meat, dairy, or oily foods in home compost",
      "Cut large items into smaller pieces to speed decomposition",
      "Keep the compost moist but not waterlogged",
    ],
    tips: [
      "Composting creates rich soil amendment that can replace chemical fertilizers",
      "Food waste in landfills produces methane — a potent greenhouse gas",
      "Coffee grounds and eggshells are great compost additions",
    ],
    acceptedMaterials: [
      "Fruit and vegetable scraps",
      "Coffee grounds and filters",
      "Tea bags (paper only)",
      "Eggshells",
      "Grass clippings",
      "Leaves and plant trimmings",
    ],
    notAccepted: [
      "Meat and fish",
      "Dairy products",
      "Oily / greasy foods",
      "Pet waste",
      "Diseased plants",
    ],
    environmentalImpact: {
      co2SavedKg: 0.7,
      waterSavedLiters: 0.0,
      energySavedKwh: 0.0,
      decompositionYears: 0.2,
      description:
        "Composting food waste diverts methane-producing material from landfills and creates nutrient-rich soil.",
    },
  },

  electronics: {
    category: "electronics",
    recyclable: true,
    bin: "E-Waste Drop-Off Point",
    binColor: "#6366f1",
    icon: "🔌",
    instructions: [
      "Never put electronics in regular recycling or trash",
      "Take to a certified e-waste recycling facility or retailer drop-off",
      "Wipe all personal data before disposing of phones or computers",
      "Remove and separately recycle batteries if possible",
      "Many manufacturers offer take-back programs — check their websites",
    ],
    tips: [
      "Electronics contain valuable metals like gold, silver, and copper",
      "They also contain toxic materials (mercury, lead) that leach into soil and water",
      "Many big-box retailers accept old electronics for free recycling",
    ],
    acceptedMaterials: [
      "Phones and tablets",
      "Computers and laptops",
      "TVs and monitors",
      "Cables and chargers",
      "Keyboards and mice",
      "Printers",
    ],
    notAccepted: [
      "Items with broken screens containing mercury (must be specialty handled)",
      "Large appliances (check local bulky waste programs)",
    ],
    environmentalImpact: {
      co2SavedKg: 20.0,
      waterSavedLiters: 150.0,
      energySavedKwh: 30.0,
      decompositionYears: 1000,
      description:
        "Recycling 1 million laptops saves energy equivalent to electricity used by 3,500 US homes in a year.",
    },
  },

  hazardous: {
    category: "hazardous",
    recyclable: false,
    bin: "Hazardous Waste Facility",
    binColor: "#ef4444",
    icon: "🔴",
    instructions: [
      "NEVER put hazardous materials in regular trash or recycling",
      "Store safely until you can reach a household hazardous waste (HHW) facility",
      "Keep in original containers with labels intact",
      "Do not mix different chemicals together",
      "Check with your local municipality for HHW collection events",
    ],
    tips: [
      "Many areas hold free HHW collection events throughout the year",
      "Some pharmacies accept old medications for safe disposal",
      "Fluorescent bulbs contain mercury — handle with care and recycle at hardware stores",
    ],
    acceptedMaterials: [
      "Paint and solvents",
      "Batteries",
      "Motor oil",
      "Pesticides and herbicides",
      "Fluorescent bulbs",
      "Medications",
    ],
    notAccepted: ["In regular trash or recycling bins"],
    environmentalImpact: {
      co2SavedKg: 0.0,
      waterSavedLiters: 250.0,
      energySavedKwh: 0.0,
      decompositionYears: 500,
      description:
        "Improper disposal of hazardous waste can contaminate groundwater for decades and harm entire ecosystems.",
    },
  },

  textile: {
    category: "textile",
    recyclable: true,
    bin: "Textile Donation / Recycling Point",
    binColor: "#ec4899",
    icon: "🩷",
    instructions: [
      "Donate wearable clothing to charity shops or shelters",
      "Worn-out textiles go to textile recycling banks, not regular recycling",
      "Wash items before donating",
      "Many fashion retailers have in-store take-back programs",
      "Pair worn socks and shoes — recyclers can still process pairs",
    ],
    tips: [
      "Only 15% of clothing is recycled or donated — the rest goes to landfill",
      "Fast fashion items are harder to recycle due to mixed fiber content",
      "Natural fibers (cotton, wool) compost more easily than synthetic",
    ],
    acceptedMaterials: [
      "Clothes in any condition",
      "Shoes (in pairs)",
      "Belts and bags",
      "Bed linen",
      "Curtains",
    ],
    notAccepted: [
      "Wet or mouldy textiles",
      "Duvets and pillows (most places)",
      "Carpets",
    ],
    environmentalImpact: {
      co2SavedKg: 3.6,
      waterSavedLiters: 2700.0,
      energySavedKwh: 4.0,
      decompositionYears: 200,
      description:
        "One cotton T-shirt requires 2,700 liters of water to produce. Donating it gives that resource new life.",
    },
  },

  unknown: {
    category: "unknown",
    recyclable: false,
    bin: "Check Locally",
    binColor: "#9ca3af",
    icon: "❓",
    instructions: [
      "We couldn't identify this item clearly — try a clearer photo",
      "Check your local council's recycling guide for specific items",
      "When in doubt, throw it out — contamination can ruin entire loads",
      "Look for recycling symbols or material codes on the item",
    ],
    tips: [
      "Most recycling facilities have online lookup tools for specific items",
      "Your local authority website is the most accurate recycling guide",
    ],
    acceptedMaterials: [],
    notAccepted: [],
    environmentalImpact: {
      co2SavedKg: 0,
      waterSavedLiters: 0,
      energySavedKwh: 0,
      decompositionYears: 0,
      description: "Correct recycling of just one item can make a meaningful difference.",
    },
  },
};

/**
 * Determines recycling category from Vision API labels.
 * Returns the best matching category based on confidence-weighted labels.
 */
export function detectRecyclingCategory(labels: { description: string; score: number }[]): RecyclingCategory {
  const scores: Record<RecyclingCategory, number> = {
    plastic: 0,
    glass: 0,
    metal: 0,
    paper: 0,
    organic: 0,
    electronics: 0,
    hazardous: 0,
    textile: 0,
    unknown: 0,
  };

  for (const label of labels) {
    const key = label.description.toLowerCase();
    const category = KEYWORD_MAP[key];
    if (category) {
      scores[category] += label.score;
    }
  }

  const best = (Object.entries(scores) as [RecyclingCategory, number][]).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["unknown", 0] as [RecyclingCategory, number]
  );

  return best[1] > 0 ? best[0] : "unknown";
}

export function getRecyclingInfo(category: RecyclingCategory): RecyclingInfo {
  return RECYCLING_INFO[category];
}
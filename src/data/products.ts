export type Category = "atta" | "masala";

export type SpecRowData = { label: string; value: string };

export type Product = {
  slug: string;
  category: Category;
  name: string;
  hp: string;
  model: string;
  tagline: string;
  description: string;
  capacity: string;
  automation: string;
  material: string;
  powerConsumption: string;
  current: string;
  dimension: string;
  mainMotor: string;
  cycloneMotor: string;
  chamber: string;
  voltage: string;
  bigChamberDiameter: string;
  smallChamberDiameter: string;
  machineWeight: string;
  airLockWeight: string;
  beaterRpm?: string;
  price: string;
  features: string[];
  applications: string[];
};

const attaBase = {
  automation: "Automatic",
  material: "SS -MS",
  chamberDefault: "Double Chamber",
};

/** Default price placeholders — edit manually as needed. */
const attaPriceMap: Record<string, string> = {
  "5": "₹2,15,000",
  "7.5": "₹3,35,000",
  "10": "₹4,30,000",
  "15": "₹5,15,000",
  "20": "₹5,65,000",
};

const masalaPriceMap: Record<string, string> = {
  "5": "₹2,10,000",
  "7.5": "₹3,30,000",
  "10": "₹4,25,000",
  "15": "₹5,10,000",
  "20": "₹5,60,000",
};

type Raw = {
  hp: string;
  capacity: string;
  current: string;
  power: string;
  chamber: string;
  dimension: string;
  mainMotor: string;
  cycloneMotor: string;
  voltage?: string;
  bigChamber?: string;
  smallChamber?: string;
  weight?: string;
  airLock?: string;
};

const attaRaw: Raw[] = [
  { hp: "5", capacity: "40-60KG", current: "7.5 A", power: "4KWH", chamber: "Double Chamber", dimension: "H-46\", W-20\", L-56\"", mainMotor: "5 HP", cycloneMotor: "0.5 & 0.5 HP", voltage: "440-V", bigChamber: "10\"x5\"", smallChamber: "8\"x4'", weight: "185 KG APPROX", airLock: "110KG APPROX" },
  { hp: "7.5", capacity: "60 – 80 kg/hr", current: "10 A", power: "5 KWH", chamber: "Double", dimension: "H-47\", W-24\", L-59\"", mainMotor: "7.5 HP", cycloneMotor: "0.5 HP & 1 HP", voltage: "440 V\u00a0", bigChamber: "12\"x6\"", smallChamber: "8\"x4\"", weight: "198 KG APPROX", airLock: "110 KG APPROX" },
  { hp: "10", capacity: "80 – 100 kg/hr", current: "15 A", power: "7.5 KWH", chamber: "Double", dimension: "H-52\", W-28\", L-64\"", mainMotor: "10 HP", cycloneMotor: "0.5 HP & 1 HP", voltage: "440 V\u00a0", bigChamber: "14\"x7\"", smallChamber: "9\"x4\"", weight: "212 KG APPROX", airLock: "110 KG APPROX" },
  { hp: "15", capacity: "100 – 150 kg/hr", current: "22 A", power: "10 KWH", chamber: "Double", dimension: "H-54\", W-31\", L-69\"", mainMotor: "15 HP", cycloneMotor: "0.5 HP & 2 HP", voltage: "440 V\u00a0", bigChamber: "16\"x8\"", smallChamber: "10\"x4\"", weight: "240 KG APPROX", airLock: "110 KG APPROX" },
  { hp: "20", capacity: "150 – 200 kg/hr", current: "28 A", power: "15 KWH", chamber: "Double", dimension: "H-58\", W-34\", L-72\"", mainMotor: "20 HP", cycloneMotor: "0.5 HP & 2 HP", voltage: "440 V · 3 Phase", bigChamber: "18\"x9\"", smallChamber: "11\"x5\"", weight: "270 KG APPROX", airLock: "110 KG APPROX" },
];

const masalaRaw: Raw[] = [
  { hp: "5", capacity: "40 – 60 kg/hr", current: "7.5 A", power: "4 KWH", chamber: "Double Chamber", dimension: "L 1306 × W 600 × H 1170 mm", mainMotor: "5 HP, 1440 RPM", cycloneMotor: "0.5 HP & 0.5 HP", voltage: "440 V · 3 Phase" },
  { hp: "7.5", capacity: "60 – 80 kg/hr", current: "11 A", power: "5 KWH", chamber: "Double Chamber", dimension: "L 1448 × W 700 × H 1290 mm", mainMotor: "7.5 HP, 1440 RPM", cycloneMotor: "0.5 HP & 1 HP", voltage: "440 V · 3 Phase" },
  { hp: "10", capacity: "100 – 150 kg/hr", current: "15 A", power: "10 KWH", chamber: "Double Chamber", dimension: "L 1530 × W 800 × H 1355 mm", mainMotor: "10 HP, 1440 RPM", cycloneMotor: "0.5 HP & 1 HP", voltage: "440 V · 3 Phase" },
  { hp: "15", capacity: "150 – 200 kg/hr", current: "22 A", power: "15 KWH", chamber: "Double Chamber", dimension: "L 1600 × W 860 × H 1430 mm", mainMotor: "15 HP, 1440 RPM", cycloneMotor: "0.5 HP & 2 HP", voltage: "440 V · 3 Phase" },
  { hp: "20", capacity: "150 – 200 kg/hr", current: "28 A", power: "15 KWH", chamber: "Double Chamber", dimension: "L 1670 × W 960 × H 1520 mm", mainMotor: "20 HP, 1440 RPM", cycloneMotor: "0.5 HP & 2 HP", voltage: "440 V · 3 Phase" },
];

const attaFeatures = [
  "Double chamber grinding for finer, uniform flour",
  "Powder coated SS / MS body with corrosion resistance",
  "Three phase 440 V, 50 Hz operation",
  "Twin cyclone assembly for dust-free discharge",
  "Automatic operation with low maintenance",
  "Easy screen change for multiple mesh grades",
];

const masalaFeatures = [
  "Cyclone unit with beater speed of 3840 RPM",
  "Semi-automatic operation with simple controls",
  "Powder coated SS / MS body, corrosion resistant",
  "Cool grinding that protects spice aroma and oils",
  "Three phase 440 V, 50 Hz motor with 1440 RPM",
  "Quick-access chamber for cleaning between batches",
];

const attaApplications = [
  "Commercial flour mills and atta chakki units",
  "Wheat, bajra, jowar, rice and pulses grinding",
  "Besan and dal flour production",
  "Grocery stores, co-operatives and franchise chakkis",
];

const masalaApplications = [
  "Chilli, turmeric, coriander and cumin grinding",
  "Masala blending and packaging units",
  "Dry herb, sugar and salt pulverizing",
  "Spice traders and small-to-mid scale food plants",
];

function build(raw: Raw, category: Category): Product {
  const isAtta = category === "atta";
  let name = "";
  if (isAtta) {
    name = `${raw.hp}HP Double Chamber Atta Chakki Pulverizer Machine`;
  } else {
    // Specific names for Masala products
    if (raw.hp === "5") name = "Masala Grinder machine\u00a0 \u00a0 \u00a0 5 HP\u00a0Haldi Grinder Mirchi Grinder";
    else if (raw.hp === "7.5") name = "Masala Pulverizer Machine 7.5HP Mirchi Grinding Machine";
    else if (raw.hp === "10") name = "10HP Masala Grinder Haldi Grinder Machine with Cyclone\u00a0";
    else if (raw.hp === "15") name = "Masala Grinder Machine 15HP Mirchi Grinding machine Haldi Grinder\u00a0";
    else if (raw.hp === "20") name = "20HP Masala Grinder Machine Haldi Grinder Mirchi Grinder\u00a0\u00a0";
    else name = `Masala Pulverizer with Cyclone ${raw.hp} HP`;
  }
  return {
    slug: `${category}-${raw.hp.replace(".", "-")}-hp`,
    category,
    name,
    hp: raw.hp,
    model: `VM-${isAtta ? "A" : "M"}${raw.hp.replace(".", "")}`,
    tagline: isAtta
      ? "Commercial atta pulverizer built for continuous flour output"
      : "Cyclone masala pulverizer for fine, aromatic spice powder",
    description: isAtta
      ? raw.hp === "5"
        ? "Vimash 5 HP Atta Pulverizer is a commercial atta chakki machine designed for businesses that need reliable flour grinding. This atta chakki machine uses stoneless grinding technology for consistent atta production and is built for regular commercial use. The heavy-duty atta pulverizer is suitable for grinding wheat and other dry grains. If you are looking for a commercial atta chakki or atta chakki machine for your flour grinding business, the Vimash 5 HP model is a reliable choice."
        : raw.hp === "7.5"
          ? "Vimash 7.5 HP Atta Pulverizer is a commercial atta chakki machine made for businesses looking for reliable and consistent flour production. Built with stoneless grinding technology, this atta chakki machine is designed for regular commercial use and easy operation. The Vimash atta pulverizer is suitable for grinding wheat and other dry grains. For customers looking for a commercial atta chakki, flour mill machine, or atta chakki machine for business, the 7.5 HP Vimash model offers a strong and reliable solution."
          : raw.hp === "10"
            ? "Vimash 10 HP Atta Pulverizer is a heavy-duty commercial atta chakki machine designed for regular flour production. Its stoneless grinding system provides consistent grinding while the strong machine body is built for long-term commercial use. This atta chakki machine is suitable for grinding wheat and other dry grains. If you are searching for a commercial atta chakki, atta chakki machine, or flour mill machine for your business, the Vimash 10 HP atta chakki pulverizer is built to deliver reliable performance."
          : raw.hp === "15"
            ? "Vimash 15 HP Atta Pulverizer is a heavy-duty commercial atta chakki machine designed for businesses that need higher production and reliable daily operation. The stoneless grinding technology helps provide consistent flour grinding, while the strong construction is made for long-term commercial use. This atta pulverizer is suitable for grinding wheat and other dry grains. Vimash 15 HP is a suitable choice for businesses looking for a commercial atta chakki, atta chakki machine, or flour mill machine."
          : raw.hp === "20"
            ? "Vimash 20 HP Atta Pulverizer is a heavy-duty commercial atta chakki machine designed for businesses that require high production and reliable daily performance. Built with stoneless grinding technology and a strong construction, this atta chakki machine is made for continuous commercial use. It is suitable for grinding wheat and other dry grains. If you are looking for a commercial atta chakki, atta chakki machine, or flour mill machine for your business, Vimash 20 HP offers a powerful grinding solution."
            : `The ${raw.hp} HP double chamber pulverizer grinds ${raw.capacity} of grain with a fully automatic, dust-controlled cyclone system. The powder coated SS / MS body and partitioned grinding chamber deliver uniform flour with minimum heat build-up, making it ideal for commercial flour mills running long shifts.`
      : `The ${raw.hp} HP masala pulverizer with cyclone handles ${raw.capacity} of spices at a beater speed of 3840 RPM. Its double chamber and stainless contact zones keep volatile oils and aroma intact while the twin cyclone assembly discharges powder without dust in the workspace.`,
    capacity: raw.capacity,
    automation: isAtta ? attaBase.automation : "Semi-automatic",
    material: attaBase.material,
    powerConsumption: raw.power,
    current: raw.current,
    dimension: raw.dimension,
    mainMotor: raw.mainMotor,
    cycloneMotor: raw.cycloneMotor,
    chamber: raw.chamber,
    voltage: raw.voltage ?? "440 V · 3 Phase",
    bigChamberDiameter: raw.bigChamber ?? "—",
    smallChamberDiameter: raw.smallChamber ?? "—",
    machineWeight: raw.weight ?? "—",
    airLockWeight: raw.airLock ?? "—",
    beaterRpm: isAtta ? undefined : "3840 RPM",
    price: priceMap[raw.hp] ?? "On request",
    features: isAtta ? attaFeatures : masalaFeatures,
    applications: isAtta ? attaApplications : masalaApplications,
  };
}

export const products: Product[] = [
  ...attaRaw.map((r) => build(r, "atta")),
  ...masalaRaw.map((r) => build(r, "masala")),
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function specTable(p: Product): SpecRowData[] {
  return [
    { label: "Grinding Capacity Per-Hrs", value: p.capacity },
    { label: "Automation Grade", value: p.automation },
    { label: "Material", value: p.material },
    { label: "Power Source", value: "Electric" },
    { label: "Voltage-V", value: p.voltage },
    { label: "Current A", value: p.current },
    { label: "Corrosion Resistance", value: "Yes" },
    { label: "Power Consumption", value: p.powerConsumption },
    { label: "Motor Speed", value: "1440 RPM" },
    { label: "Frequency Hz", value: "50Hz" },
    { label: "Motor Type", value: "Three Phase" },
    { label: "Coating", value: "Powder Coating" },
    { label: "Big Chamber Diameter", value: p.bigChamberDiameter },
    { label: "Small Chamber Diameter", value: p.smallChamberDiameter },
    { label: "Machine Dimension", value: p.dimension },
    { label: "Main Motor", value: p.mainMotor },
    { label: "Cyclone Motor", value: p.cycloneMotor },
    { label: "Machine Weight", value: p.machineWeight },
    { label: "Air Lock Weight", value: p.airLockWeight },
  ];
}

export type Category = "atta" | "masala";

export type Product = {
  id: string;
  category: Category;
  hp: string;
  model: string;
  output: string;
  rpm: string;
  screen: string;
  features: string[];
};

const attaSpecs = [
  { hp: "5", output: "45 – 60 kg/hr", rpm: "3000", screen: "16\"" },
  { hp: "7.5", output: "70 – 90 kg/hr", rpm: "2800", screen: "20\"" },
  { hp: "10", output: "100 – 130 kg/hr", rpm: "2800", screen: "24\"" },
  { hp: "15", output: "150 – 190 kg/hr", rpm: "2600", screen: "28\"" },
  { hp: "20", output: "210 – 260 kg/hr", rpm: "2400", screen: "30\"" },
  { hp: "30", output: "320 – 400 kg/hr", rpm: "2200", screen: "36\"" },
];

const masalaSpecs = [
  { hp: "5", output: "30 – 45 kg/hr", rpm: "3200", screen: "14\"" },
  { hp: "7.5", output: "50 – 70 kg/hr", rpm: "3000", screen: "18\"" },
  { hp: "10", output: "80 – 105 kg/hr", rpm: "2900", screen: "22\"" },
  { hp: "15", output: "120 – 155 kg/hr", rpm: "2700", screen: "26\"" },
  { hp: "20", output: "170 – 215 kg/hr", rpm: "2500", screen: "30\"" },
  { hp: "30", output: "260 – 330 kg/hr", rpm: "2300", screen: "34\"" },
];

const attaFeatures = [
  ["Cool grinding", "Mild steel body", "Direct drive"],
  ["Cool grinding", "Dust-free hopper", "Direct drive"],
  ["Twin bearing", "Dust-free hopper", "Low maintenance"],
  ["Twin bearing", "Heavy duty rotor", "Low maintenance"],
  ["Heavy duty rotor", "Balanced shaft", "Continuous duty"],
  ["Heavy duty rotor", "Balanced shaft", "Industrial duty"],
];

const masalaFeatures = [
  ["SS 304 contact", "Oil-tight seal", "Fine mesh"],
  ["SS 304 contact", "Oil-tight seal", "Fine mesh"],
  ["SS 304 contact", "Water jacket ready", "Fine mesh"],
  ["Full SS build", "Water jacket ready", "Aroma retention"],
  ["Full SS build", "Cyclone ready", "Aroma retention"],
  ["Full SS build", "Cyclone ready", "Plant integration"],
];

export const products: Product[] = [
  ...attaSpecs.map((s, i) => ({
    id: `atta-${s.hp}`,
    category: "atta" as const,
    hp: s.hp,
    model: `VM-A${s.hp.replace(".", "")}`,
    output: s.output,
    rpm: s.rpm,
    screen: s.screen,
    features: attaFeatures[i],
  })),
  ...masalaSpecs.map((s, i) => ({
    id: `masala-${s.hp}`,
    category: "masala" as const,
    hp: s.hp,
    model: `VM-M${s.hp.replace(".", "")}`,
    output: s.output,
    rpm: s.rpm,
    screen: s.screen,
    features: masalaFeatures[i],
  })),
];

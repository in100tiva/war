// Definicao dos Continentes
export const CONTINENTS: Record<string, {
  name: string;
  bonus: number;
  color: string;
  territories: string[];
}> = {
  northAmerica: {
    name: "America do Norte",
    bonus: 5,
    color: "#228b22",
    territories: [
      "alaska", "alberta", "americaCentral", "estadosUnidos",
      "groelandia", "mexico", "novaYork", "ottawa", "vancouver"
    ],
  },
  southAmerica: {
    name: "America do Sul",
    bonus: 2,
    color: "#ffd700",
    territories: ["argentina", "brasil", "peru", "venezuela"],
  },
  europe: {
    name: "Europa",
    bonus: 5,
    color: "#4169e1",
    territories: [
      "alemanha", "franca", "gra-bretanha", "islandia",
      "italia", "polonia", "russia"
    ],
  },
  africa: {
    name: "Africa",
    bonus: 3,
    color: "#ff8c00",
    territories: [
      "argelia", "egito", "congo", "africaDoSul",
      "madagascar", "nigeria"
    ],
  },
  asia: {
    name: "Asia",
    bonus: 7,
    color: "#8b4513",
    territories: [
      "arabia", "bangladesh", "cazaquistao", "china", "coreia",
      "india", "japao", "mongolia", "oriente-medio", "siberia",
      "tailandia", "turquia"
    ],
  },
  oceania: {
    name: "Oceania",
    bonus: 2,
    color: "#dc143c",
    territories: ["australia", "indonesia", "novaZelandia", "perth"],
  },
};

// Definicao dos Territorios
export const TERRITORIES: Record<string, {
  name: string;
  continent: string;
  neighbors: string[];
  center: { x: number; y: number };
}> = {
  // America do Norte
  alaska: {
    name: "Alaska",
    continent: "northAmerica",
    neighbors: ["vancouver", "alberta", "siberia"],
    center: { x: 70, y: 95 },
  },
  alberta: {
    name: "Alberta",
    continent: "northAmerica",
    neighbors: ["alaska", "vancouver", "ottawa", "estadosUnidos"],
    center: { x: 135, y: 115 },
  },
  americaCentral: {
    name: "America Central",
    continent: "northAmerica",
    neighbors: ["mexico", "venezuela"],
    center: { x: 155, y: 270 },
  },
  estadosUnidos: {
    name: "Estados Unidos",
    continent: "northAmerica",
    neighbors: ["alberta", "ottawa", "novaYork", "mexico"],
    center: { x: 155, y: 185 },
  },
  groelandia: {
    name: "Groelandia",
    continent: "northAmerica",
    neighbors: ["ottawa", "islandia"],
    center: { x: 315, y: 65 },
  },
  mexico: {
    name: "Mexico",
    continent: "northAmerica",
    neighbors: ["estadosUnidos", "americaCentral"],
    center: { x: 115, y: 245 },
  },
  novaYork: {
    name: "Nova York",
    continent: "northAmerica",
    neighbors: ["ottawa", "estadosUnidos"],
    center: { x: 230, y: 165 },
  },
  ottawa: {
    name: "Ottawa",
    continent: "northAmerica",
    neighbors: ["alberta", "estadosUnidos", "novaYork", "groelandia", "vancouver"],
    center: { x: 220, y: 115 },
  },
  vancouver: {
    name: "Vancouver",
    continent: "northAmerica",
    neighbors: ["alaska", "alberta", "ottawa"],
    center: { x: 80, y: 145 },
  },

  // America do Sul
  argentina: {
    name: "Argentina",
    continent: "southAmerica",
    neighbors: ["brasil", "peru"],
    center: { x: 195, y: 455 },
  },
  brasil: {
    name: "Brasil",
    continent: "southAmerica",
    neighbors: ["venezuela", "peru", "argentina", "nigeria"],
    center: { x: 230, y: 370 },
  },
  peru: {
    name: "Peru",
    continent: "southAmerica",
    neighbors: ["venezuela", "brasil", "argentina"],
    center: { x: 155, y: 385 },
  },
  venezuela: {
    name: "Venezuela",
    continent: "southAmerica",
    neighbors: ["americaCentral", "brasil", "peru"],
    center: { x: 170, y: 320 },
  },

  // Europa
  alemanha: {
    name: "Alemanha",
    continent: "europe",
    neighbors: ["franca", "italia", "polonia"],
    center: { x: 490, y: 165 },
  },
  franca: {
    name: "Franca",
    continent: "europe",
    neighbors: ["gra-bretanha", "alemanha", "italia", "argelia"],
    center: { x: 440, y: 190 },
  },
  "gra-bretanha": {
    name: "Gra-Bretanha",
    continent: "europe",
    neighbors: ["islandia", "franca"],
    center: { x: 415, y: 140 },
  },
  islandia: {
    name: "Islandia",
    continent: "europe",
    neighbors: ["groelandia", "gra-bretanha"],
    center: { x: 390, y: 75 },
  },
  italia: {
    name: "Italia",
    continent: "europe",
    neighbors: ["franca", "alemanha", "polonia", "argelia", "egito"],
    center: { x: 490, y: 225 },
  },
  polonia: {
    name: "Polonia",
    continent: "europe",
    neighbors: ["alemanha", "italia", "russia", "turquia"],
    center: { x: 550, y: 155 },
  },
  russia: {
    name: "Russia",
    continent: "europe",
    neighbors: ["polonia", "turquia", "siberia", "cazaquistao"],
    center: { x: 605, y: 105 },
  },

  // Africa
  argelia: {
    name: "Argelia",
    continent: "africa",
    neighbors: ["franca", "italia", "egito", "nigeria", "brasil"],
    center: { x: 435, y: 280 },
  },
  egito: {
    name: "Egito",
    continent: "africa",
    neighbors: ["italia", "argelia", "nigeria", "oriente-medio"],
    center: { x: 515, y: 295 },
  },
  congo: {
    name: "Congo",
    continent: "africa",
    neighbors: ["nigeria", "africaDoSul", "madagascar"],
    center: { x: 495, y: 415 },
  },
  africaDoSul: {
    name: "Africa do Sul",
    continent: "africa",
    neighbors: ["congo", "madagascar"],
    center: { x: 505, y: 495 },
  },
  madagascar: {
    name: "Madagascar",
    continent: "africa",
    neighbors: ["congo", "africaDoSul"],
    center: { x: 575, y: 485 },
  },
  nigeria: {
    name: "Nigeria",
    continent: "africa",
    neighbors: ["argelia", "egito", "congo", "brasil"],
    center: { x: 455, y: 345 },
  },

  // Asia
  arabia: {
    name: "Arabia",
    continent: "asia",
    neighbors: ["egito", "oriente-medio", "india"],
    center: { x: 590, y: 315 },
  },
  bangladesh: {
    name: "Bangladesh",
    continent: "asia",
    neighbors: ["india", "tailandia", "china"],
    center: { x: 745, y: 310 },
  },
  cazaquistao: {
    name: "Cazaquistao",
    continent: "asia",
    neighbors: ["russia", "siberia", "mongolia", "china", "turquia"],
    center: { x: 700, y: 130 },
  },
  china: {
    name: "China",
    continent: "asia",
    neighbors: ["cazaquistao", "mongolia", "coreia", "india", "bangladesh", "tailandia"],
    center: { x: 770, y: 205 },
  },
  coreia: {
    name: "Coreia",
    continent: "asia",
    neighbors: ["china", "japao", "mongolia"],
    center: { x: 865, y: 215 },
  },
  india: {
    name: "India",
    continent: "asia",
    neighbors: ["oriente-medio", "arabia", "bangladesh", "china", "tailandia"],
    center: { x: 670, y: 350 },
  },
  japao: {
    name: "Japao",
    continent: "asia",
    neighbors: ["coreia", "mongolia"],
    center: { x: 930, y: 190 },
  },
  mongolia: {
    name: "Mongolia",
    continent: "asia",
    neighbors: ["cazaquistao", "siberia", "china", "coreia", "japao"],
    center: { x: 805, y: 140 },
  },
  "oriente-medio": {
    name: "Oriente Medio",
    continent: "asia",
    neighbors: ["egito", "turquia", "arabia", "india"],
    center: { x: 600, y: 255 },
  },
  siberia: {
    name: "Siberia",
    continent: "asia",
    neighbors: ["russia", "cazaquistao", "mongolia", "alaska"],
    center: { x: 765, y: 70 },
  },
  tailandia: {
    name: "Tailandia",
    continent: "asia",
    neighbors: ["india", "bangladesh", "china", "indonesia"],
    center: { x: 800, y: 375 },
  },
  turquia: {
    name: "Turquia",
    continent: "asia",
    neighbors: ["polonia", "russia", "cazaquistao", "oriente-medio"],
    center: { x: 625, y: 200 },
  },

  // Oceania
  australia: {
    name: "Australia",
    continent: "oceania",
    neighbors: ["indonesia", "perth", "novaZelandia"],
    center: { x: 870, y: 520 },
  },
  indonesia: {
    name: "Indonesia",
    continent: "oceania",
    neighbors: ["tailandia", "australia", "perth"],
    center: { x: 825, y: 440 },
  },
  novaZelandia: {
    name: "Nova Zelandia",
    continent: "oceania",
    neighbors: ["australia"],
    center: { x: 960, y: 570 },
  },
  perth: {
    name: "Perth",
    continent: "oceania",
    neighbors: ["indonesia", "australia"],
    center: { x: 785, y: 520 },
  },
};

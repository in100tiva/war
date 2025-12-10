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
    color: "#3d7c47",
    territories: [
      "alaska", "territoriosNoroeste", "groelandia", "alberta",
      "ontario", "quebec", "estadosUnidosOeste", "estadosUnidosLeste", "americaCentral"
    ],
  },
  southAmerica: {
    name: "America do Sul",
    bonus: 2,
    color: "#5a9c4a",
    territories: ["venezuela", "peru", "brasil", "argentina"],
  },
  europe: {
    name: "Europa",
    bonus: 5,
    color: "#4a6fa5",
    territories: [
      "islandia", "escandanavia", "graBretenha", "europaOcidental",
      "europaSul", "europaNorte", "russia"
    ],
  },
  africa: {
    name: "Africa",
    bonus: 3,
    color: "#c4883a",
    territories: [
      "africaDoNorte", "egito", "africaOriental", "congo",
      "africaDoSul", "madagascar"
    ],
  },
  asia: {
    name: "Asia",
    bonus: 7,
    color: "#8b6343",
    territories: [
      "orienteMedio", "afeganistao", "ural", "siberia", "yakutia",
      "irkutsk", "mongolia", "china", "india", "sudesteasiatico",
      "japao", "kamchatka"
    ],
  },
  oceania: {
    name: "Oceania",
    bonus: 2,
    color: "#a63d5a",
    territories: ["indonesia", "novaGuine", "australiaOeste", "australiaLeste"],
  },
};

// Definicao dos Territorios
export const TERRITORIES: Record<string, {
  name: string;
  continent: string;
  neighbors: string[];
  center: { x: number; y: number };
}> = {
  // ==================== AMERICA DO NORTE ====================
  alaska: {
    name: "Alaska",
    continent: "northAmerica",
    neighbors: ["territoriosNoroeste", "alberta", "kamchatka"],
    center: { x: 75, y: 115 },
  },
  territoriosNoroeste: {
    name: "Territorios do Noroeste",
    continent: "northAmerica",
    neighbors: ["alaska", "alberta", "ontario", "groelandia"],
    center: { x: 200, y: 120 },
  },
  groelandia: {
    name: "Groelandia",
    continent: "northAmerica",
    neighbors: ["territoriosNoroeste", "ontario", "quebec", "islandia"],
    center: { x: 400, y: 105 },
  },
  alberta: {
    name: "Alberta",
    continent: "northAmerica",
    neighbors: ["alaska", "territoriosNoroeste", "ontario", "estadosUnidosOeste"],
    center: { x: 120, y: 185 },
  },
  ontario: {
    name: "Ontario",
    continent: "northAmerica",
    neighbors: ["territoriosNoroeste", "alberta", "quebec", "estadosUnidosOeste", "estadosUnidosLeste", "groelandia"],
    center: { x: 220, y: 195 },
  },
  quebec: {
    name: "Quebec",
    continent: "northAmerica",
    neighbors: ["ontario", "estadosUnidosLeste", "groelandia"],
    center: { x: 335, y: 200 },
  },
  estadosUnidosOeste: {
    name: "EUA Oeste",
    continent: "northAmerica",
    neighbors: ["alberta", "ontario", "estadosUnidosLeste", "americaCentral"],
    center: { x: 120, y: 285 },
  },
  estadosUnidosLeste: {
    name: "EUA Leste",
    continent: "northAmerica",
    neighbors: ["ontario", "quebec", "estadosUnidosOeste", "americaCentral"],
    center: { x: 240, y: 300 },
  },
  americaCentral: {
    name: "America Central",
    continent: "northAmerica",
    neighbors: ["estadosUnidosOeste", "estadosUnidosLeste", "venezuela"],
    center: { x: 155, y: 395 },
  },

  // ==================== AMERICA DO SUL ====================
  venezuela: {
    name: "Venezuela",
    continent: "southAmerica",
    neighbors: ["americaCentral", "peru", "brasil"],
    center: { x: 240, y: 490 },
  },
  peru: {
    name: "Peru",
    continent: "southAmerica",
    neighbors: ["venezuela", "brasil", "argentina"],
    center: { x: 195, y: 605 },
  },
  brasil: {
    name: "Brasil",
    continent: "southAmerica",
    neighbors: ["venezuela", "peru", "argentina", "africaDoNorte"],
    center: { x: 305, y: 615 },
  },
  argentina: {
    name: "Argentina",
    continent: "southAmerica",
    neighbors: ["peru", "brasil"],
    center: { x: 245, y: 755 },
  },

  // ==================== EUROPA ====================
  islandia: {
    name: "Islandia",
    continent: "europe",
    neighbors: ["groelandia", "escandanavia", "graBretenha"],
    center: { x: 520, y: 120 },
  },
  escandanavia: {
    name: "Escandanavia",
    continent: "europe",
    neighbors: ["islandia", "graBretenha", "europaNorte", "russia"],
    center: { x: 625, y: 125 },
  },
  graBretenha: {
    name: "Gra-Bretanha",
    continent: "europe",
    neighbors: ["islandia", "escandanavia", "europaOcidental", "europaNorte"],
    center: { x: 530, y: 215 },
  },
  europaOcidental: {
    name: "Europa Ocidental",
    continent: "europe",
    neighbors: ["graBretenha", "europaNorte", "europaSul", "africaDoNorte"],
    center: { x: 525, y: 330 },
  },
  europaNorte: {
    name: "Europa do Norte",
    continent: "europe",
    neighbors: ["graBretenha", "escandanavia", "europaOcidental", "europaSul", "russia"],
    center: { x: 640, y: 265 },
  },
  europaSul: {
    name: "Europa do Sul",
    continent: "europe",
    neighbors: ["europaOcidental", "europaNorte", "russia", "africaDoNorte", "egito", "orienteMedio"],
    center: { x: 630, y: 415 },
  },
  russia: {
    name: "Russia",
    continent: "europe",
    neighbors: ["escandanavia", "europaNorte", "europaSul", "ural", "afeganistao", "orienteMedio"],
    center: { x: 790, y: 230 },
  },

  // ==================== AFRICA ====================
  africaDoNorte: {
    name: "Africa do Norte",
    continent: "africa",
    neighbors: ["europaOcidental", "europaSul", "egito", "africaOriental", "congo", "brasil"],
    center: { x: 580, y: 510 },
  },
  egito: {
    name: "Egito",
    continent: "africa",
    neighbors: ["europaSul", "africaDoNorte", "africaOriental", "orienteMedio"],
    center: { x: 700, y: 525 },
  },
  africaOriental: {
    name: "Africa Oriental",
    continent: "africa",
    neighbors: ["egito", "africaDoNorte", "congo", "africaDoSul", "madagascar"],
    center: { x: 690, y: 695 },
  },
  congo: {
    name: "Congo",
    continent: "africa",
    neighbors: ["africaDoNorte", "africaOriental", "africaDoSul"],
    center: { x: 600, y: 690 },
  },
  africaDoSul: {
    name: "Africa do Sul",
    continent: "africa",
    neighbors: ["congo", "africaOriental", "madagascar"],
    center: { x: 645, y: 875 },
  },
  madagascar: {
    name: "Madagascar",
    continent: "africa",
    neighbors: ["africaOriental", "africaDoSul"],
    center: { x: 810, y: 845 },
  },

  // ==================== ASIA ====================
  orienteMedio: {
    name: "Oriente Medio",
    continent: "asia",
    neighbors: ["europaSul", "russia", "egito", "afeganistao", "india"],
    center: { x: 795, y: 480 },
  },
  afeganistao: {
    name: "Afeganistao",
    continent: "asia",
    neighbors: ["russia", "orienteMedio", "india", "china", "ural"],
    center: { x: 905, y: 400 },
  },
  ural: {
    name: "Ural",
    continent: "asia",
    neighbors: ["russia", "afeganistao", "siberia", "china"],
    center: { x: 960, y: 270 },
  },
  siberia: {
    name: "Siberia",
    continent: "asia",
    neighbors: ["ural", "china", "mongolia", "irkutsk", "yakutia"],
    center: { x: 1105, y: 210 },
  },
  yakutia: {
    name: "Yakutia",
    continent: "asia",
    neighbors: ["siberia", "irkutsk", "kamchatka"],
    center: { x: 1245, y: 175 },
  },
  irkutsk: {
    name: "Irkutsk",
    continent: "asia",
    neighbors: ["siberia", "yakutia", "mongolia", "kamchatka"],
    center: { x: 1215, y: 380 },
  },
  mongolia: {
    name: "Mongolia",
    continent: "asia",
    neighbors: ["siberia", "irkutsk", "china", "japao", "kamchatka"],
    center: { x: 1110, y: 430 },
  },
  china: {
    name: "China",
    continent: "asia",
    neighbors: ["afeganistao", "ural", "siberia", "mongolia", "india", "sudesteasiatico"],
    center: { x: 1045, y: 505 },
  },
  india: {
    name: "India",
    continent: "asia",
    neighbors: ["orienteMedio", "afeganistao", "china", "sudesteasiatico"],
    center: { x: 935, y: 615 },
  },
  sudesteasiatico: {
    name: "Sudeste Asiatico",
    continent: "asia",
    neighbors: ["india", "china", "indonesia"],
    center: { x: 1085, y: 725 },
  },
  japao: {
    name: "Japao",
    continent: "asia",
    neighbors: ["mongolia", "kamchatka"],
    center: { x: 1285, y: 520 },
  },
  kamchatka: {
    name: "Kamchatka",
    continent: "asia",
    neighbors: ["yakutia", "irkutsk", "mongolia", "japao", "alaska"],
    center: { x: 1380, y: 260 },
  },

  // ==================== OCEANIA ====================
  indonesia: {
    name: "Indonesia",
    continent: "oceania",
    neighbors: ["sudesteasiatico", "novaGuine", "australiaOeste"],
    center: { x: 1170, y: 915 },
  },
  novaGuine: {
    name: "Nova Guine",
    continent: "oceania",
    neighbors: ["indonesia", "australiaLeste"],
    center: { x: 1320, y: 975 },
  },
  australiaOeste: {
    name: "Australia Ocidental",
    continent: "oceania",
    neighbors: ["indonesia", "australiaLeste"],
    center: { x: 1175, y: 1125 },
  },
  australiaLeste: {
    name: "Australia Oriental",
    continent: "oceania",
    neighbors: ["novaGuine", "australiaOeste"],
    center: { x: 1340, y: 1160 },
  },
};

// Helper para verificar se dois territorios sao vizinhos
export function areNeighbors(territory1: string, territory2: string): boolean {
  const t1 = TERRITORIES[territory1];
  if (!t1) return false;
  return t1.neighbors.includes(territory2);
}

// Helper para pegar vizinhos de um territorio
export function getNeighbors(territoryId: string): string[] {
  return TERRITORIES[territoryId]?.neighbors || [];
}

// Helper para pegar continente de um territorio
export function getContinent(territoryId: string): string | null {
  return TERRITORIES[territoryId]?.continent || null;
}

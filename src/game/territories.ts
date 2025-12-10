// Definicao dos Continentes
export const CONTINENTS: Record<
  string,
  {
    name: string;
    bonus: number;
    color: string;
    territories: string[];
  }
> = {
  northAmerica: {
    name: 'America do Norte',
    bonus: 5,
    color: '#228b22',
    territories: [
      'alaska', 'alberta', 'americaCentral', 'estadosUnidos',
      'groelandia', 'mexico', 'novaYork', 'ottawa', 'vancouver',
    ],
  },
  southAmerica: {
    name: 'America do Sul',
    bonus: 2,
    color: '#ffd700',
    territories: ['argentina', 'brasil', 'peru', 'venezuela'],
  },
  europe: {
    name: 'Europa',
    bonus: 5,
    color: '#4169e1',
    territories: [
      'alemanha', 'franca', 'gra-bretanha', 'islandia',
      'italia', 'polonia', 'russia',
    ],
  },
  africa: {
    name: 'Africa',
    bonus: 3,
    color: '#ff8c00',
    territories: [
      'argelia', 'egito', 'congo', 'africaDoSul',
      'madagascar', 'nigeria',
    ],
  },
  asia: {
    name: 'Asia',
    bonus: 7,
    color: '#8b4513',
    territories: [
      'arabia', 'bangladesh', 'cazaquistao', 'china', 'coreia',
      'india', 'japao', 'mongolia', 'oriente-medio', 'siberia',
      'tailandia', 'turquia',
    ],
  },
  oceania: {
    name: 'Oceania',
    bonus: 2,
    color: '#dc143c',
    territories: ['australia', 'indonesia', 'novaZelandia', 'perth'],
  },
};

// Definicao dos Territorios com coordenadas SVG
export const TERRITORIES: Record<
  string,
  {
    name: string;
    continent: string;
    neighbors: string[];
    path: string;
    center: { x: number; y: number };
  }
> = {
  // America do Norte
  alaska: {
    name: 'Alaska',
    continent: 'northAmerica',
    neighbors: ['vancouver', 'alberta', 'siberia'],
    path: 'M 45 80 L 95 60 L 110 85 L 100 120 L 60 130 L 35 110 Z',
    center: { x: 70, y: 95 },
  },
  alberta: {
    name: 'Alberta',
    continent: 'northAmerica',
    neighbors: ['alaska', 'vancouver', 'ottawa', 'estadosUnidos'],
    path: 'M 100 120 L 110 85 L 150 80 L 165 120 L 150 150 L 110 150 Z',
    center: { x: 135, y: 115 },
  },
  americaCentral: {
    name: 'America Central',
    continent: 'northAmerica',
    neighbors: ['mexico', 'venezuela'],
    path: 'M 130 250 L 170 230 L 190 260 L 175 300 L 140 310 L 120 280 Z',
    center: { x: 155, y: 270 },
  },
  estadosUnidos: {
    name: 'Estados Unidos',
    continent: 'northAmerica',
    neighbors: ['alberta', 'ottawa', 'novaYork', 'mexico'],
    path: 'M 110 150 L 150 150 L 200 145 L 220 180 L 200 220 L 150 230 L 110 210 L 100 170 Z',
    center: { x: 155, y: 185 },
  },
  groelandia: {
    name: 'Groelandia',
    continent: 'northAmerica',
    neighbors: ['ottawa', 'islandia'],
    path: 'M 280 30 L 340 25 L 370 55 L 360 100 L 310 110 L 270 85 L 265 50 Z',
    center: { x: 315, y: 65 },
  },
  mexico: {
    name: 'Mexico',
    continent: 'northAmerica',
    neighbors: ['estadosUnidos', 'americaCentral'],
    path: 'M 100 210 L 150 230 L 170 230 L 130 250 L 120 280 L 90 270 L 80 230 Z',
    center: { x: 115, y: 245 },
  },
  novaYork: {
    name: 'Nova York',
    continent: 'northAmerica',
    neighbors: ['ottawa', 'estadosUnidos'],
    path: 'M 200 145 L 250 130 L 275 155 L 260 190 L 220 195 L 200 170 Z',
    center: { x: 230, y: 165 },
  },
  ottawa: {
    name: 'Ottawa',
    continent: 'northAmerica',
    neighbors: ['alberta', 'estadosUnidos', 'novaYork', 'groelandia', 'vancouver'],
    path: 'M 165 120 L 200 100 L 260 95 L 280 120 L 250 130 L 200 145 L 165 120 Z',
    center: { x: 220, y: 115 },
  },
  vancouver: {
    name: 'Vancouver',
    continent: 'northAmerica',
    neighbors: ['alaska', 'alberta', 'ottawa'],
    path: 'M 60 130 L 100 120 L 110 150 L 100 170 L 70 170 L 50 150 Z',
    center: { x: 80, y: 145 },
  },

  // America do Sul
  argentina: {
    name: 'Argentina',
    continent: 'southAmerica',
    neighbors: ['brasil', 'peru'],
    path: 'M 180 420 L 210 400 L 230 430 L 220 490 L 195 520 L 170 490 L 165 440 Z',
    center: { x: 195, y: 455 },
  },
  brasil: {
    name: 'Brasil',
    continent: 'southAmerica',
    neighbors: ['venezuela', 'peru', 'argentina', 'nigeria'],
    path: 'M 200 330 L 260 320 L 290 360 L 270 420 L 230 430 L 210 400 L 180 420 L 175 370 Z',
    center: { x: 230, y: 370 },
  },
  peru: {
    name: 'Peru',
    continent: 'southAmerica',
    neighbors: ['venezuela', 'brasil', 'argentina'],
    path: 'M 140 350 L 175 330 L 200 330 L 175 370 L 180 420 L 165 440 L 130 410 L 125 370 Z',
    center: { x: 155, y: 385 },
  },
  venezuela: {
    name: 'Venezuela',
    continent: 'southAmerica',
    neighbors: ['americaCentral', 'brasil', 'peru'],
    path: 'M 140 310 L 175 300 L 210 310 L 200 330 L 175 330 L 140 350 L 125 330 Z',
    center: { x: 170, y: 320 },
  },

  // Europa
  alemanha: {
    name: 'Alemanha',
    continent: 'europe',
    neighbors: ['franca', 'italia', 'polonia'],
    path: 'M 470 145 L 510 135 L 530 155 L 520 185 L 485 195 L 460 175 Z',
    center: { x: 490, y: 165 },
  },
  franca: {
    name: 'Franca',
    continent: 'europe',
    neighbors: ['gra-bretanha', 'alemanha', 'italia', 'argelia'],
    path: 'M 410 170 L 460 160 L 470 145 L 460 175 L 485 195 L 470 220 L 420 215 L 400 190 Z',
    center: { x: 440, y: 190 },
  },
  'gra-bretanha': {
    name: 'Gra-Bretanha',
    continent: 'europe',
    neighbors: ['islandia', 'franca'],
    path: 'M 395 115 L 425 105 L 445 130 L 435 160 L 410 170 L 385 150 Z',
    center: { x: 415, y: 140 },
  },
  islandia: {
    name: 'Islandia',
    continent: 'europe',
    neighbors: ['groelandia', 'gra-bretanha'],
    path: 'M 370 55 L 410 50 L 430 75 L 415 100 L 375 100 L 355 75 Z',
    center: { x: 390, y: 75 },
  },
  italia: {
    name: 'Italia',
    continent: 'europe',
    neighbors: ['franca', 'alemanha', 'polonia', 'argelia', 'egito'],
    path: 'M 470 220 L 485 195 L 520 185 L 530 210 L 515 250 L 480 260 L 455 240 Z',
    center: { x: 490, y: 225 },
  },
  polonia: {
    name: 'Polonia',
    continent: 'europe',
    neighbors: ['alemanha', 'italia', 'russia', 'turquia'],
    path: 'M 510 135 L 560 120 L 590 140 L 580 180 L 530 190 L 520 185 L 530 155 Z',
    center: { x: 550, y: 155 },
  },
  russia: {
    name: 'Russia',
    continent: 'europe',
    neighbors: ['polonia', 'turquia', 'siberia', 'cazaquistao'],
    path: 'M 560 80 L 620 65 L 660 90 L 650 140 L 590 140 L 560 120 Z',
    center: { x: 605, y: 105 },
  },

  // Africa
  argelia: {
    name: 'Argelia',
    continent: 'africa',
    neighbors: ['franca', 'italia', 'egito', 'nigeria', 'brasil'],
    path: 'M 400 250 L 460 240 L 480 260 L 470 310 L 420 320 L 390 290 Z',
    center: { x: 435, y: 280 },
  },
  egito: {
    name: 'Egito',
    continent: 'africa',
    neighbors: ['italia', 'argelia', 'nigeria', 'oriente-medio'],
    path: 'M 480 260 L 530 250 L 560 280 L 545 330 L 500 340 L 470 310 Z',
    center: { x: 515, y: 295 },
  },
  congo: {
    name: 'Congo',
    continent: 'africa',
    neighbors: ['nigeria', 'africaDoSul', 'madagascar'],
    path: 'M 470 380 L 520 370 L 545 400 L 530 450 L 485 460 L 455 425 Z',
    center: { x: 495, y: 415 },
  },
  africaDoSul: {
    name: 'Africa do Sul',
    continent: 'africa',
    neighbors: ['congo', 'madagascar'],
    path: 'M 485 460 L 530 450 L 550 485 L 530 530 L 480 535 L 460 495 Z',
    center: { x: 505, y: 495 },
  },
  madagascar: {
    name: 'Madagascar',
    continent: 'africa',
    neighbors: ['congo', 'africaDoSul'],
    path: 'M 560 450 L 590 445 L 605 480 L 595 520 L 565 525 L 550 485 Z',
    center: { x: 575, y: 485 },
  },
  nigeria: {
    name: 'Nigeria',
    continent: 'africa',
    neighbors: ['argelia', 'egito', 'congo', 'brasil'],
    path: 'M 420 320 L 470 310 L 500 340 L 520 370 L 470 380 L 425 370 L 400 340 Z',
    center: { x: 455, y: 345 },
  },

  // Asia
  arabia: {
    name: 'Arabia',
    continent: 'asia',
    neighbors: ['egito', 'oriente-medio', 'india'],
    path: 'M 560 280 L 610 270 L 640 300 L 620 350 L 570 355 L 545 330 Z',
    center: { x: 590, y: 315 },
  },
  bangladesh: {
    name: 'Bangladesh',
    continent: 'asia',
    neighbors: ['india', 'tailandia', 'china'],
    path: 'M 720 280 L 760 270 L 785 295 L 775 340 L 735 350 L 705 320 Z',
    center: { x: 745, y: 310 },
  },
  cazaquistao: {
    name: 'Cazaquistao',
    continent: 'asia',
    neighbors: ['russia', 'siberia', 'mongolia', 'china', 'turquia'],
    path: 'M 650 100 L 720 85 L 760 115 L 745 165 L 685 175 L 650 140 Z',
    center: { x: 700, y: 130 },
  },
  china: {
    name: 'China',
    continent: 'asia',
    neighbors: ['cazaquistao', 'mongolia', 'coreia', 'india', 'bangladesh', 'tailandia'],
    path: 'M 745 165 L 800 155 L 840 185 L 830 235 L 785 250 L 735 245 L 700 210 Z',
    center: { x: 770, y: 205 },
  },
  coreia: {
    name: 'Coreia',
    continent: 'asia',
    neighbors: ['china', 'japao', 'mongolia'],
    path: 'M 840 185 L 880 175 L 905 200 L 895 240 L 855 250 L 830 220 Z',
    center: { x: 865, y: 215 },
  },
  india: {
    name: 'India',
    continent: 'asia',
    neighbors: ['oriente-medio', 'arabia', 'bangladesh', 'china', 'tailandia'],
    path: 'M 640 300 L 705 285 L 720 280 L 705 320 L 735 350 L 710 400 L 660 410 L 630 370 L 620 350 Z',
    center: { x: 670, y: 350 },
  },
  japao: {
    name: 'Japao',
    continent: 'asia',
    neighbors: ['coreia', 'mongolia'],
    path: 'M 905 160 L 940 150 L 965 180 L 955 225 L 920 235 L 895 200 Z',
    center: { x: 930, y: 190 },
  },
  mongolia: {
    name: 'Mongolia',
    continent: 'asia',
    neighbors: ['cazaquistao', 'siberia', 'china', 'coreia', 'japao'],
    path: 'M 760 115 L 830 100 L 870 130 L 860 175 L 800 155 L 745 165 Z',
    center: { x: 805, y: 140 },
  },
  'oriente-medio': {
    name: 'Oriente Medio',
    continent: 'asia',
    neighbors: ['egito', 'turquia', 'arabia', 'india'],
    path: 'M 570 220 L 620 210 L 650 235 L 640 300 L 610 270 L 560 280 L 545 250 Z',
    center: { x: 600, y: 255 },
  },
  siberia: {
    name: 'Siberia',
    continent: 'asia',
    neighbors: ['russia', 'cazaquistao', 'mongolia', 'alaska'],
    path: 'M 720 40 L 800 30 L 860 60 L 850 100 L 830 100 L 760 115 L 720 85 L 660 90 L 650 60 Z',
    center: { x: 765, y: 70 },
  },
  tailandia: {
    name: 'Tailandia',
    continent: 'asia',
    neighbors: ['india', 'bangladesh', 'china', 'indonesia'],
    path: 'M 775 340 L 820 330 L 845 360 L 830 410 L 785 420 L 755 385 Z',
    center: { x: 800, y: 375 },
  },
  turquia: {
    name: 'Turquia',
    continent: 'asia',
    neighbors: ['polonia', 'russia', 'cazaquistao', 'oriente-medio'],
    path: 'M 580 180 L 650 170 L 685 175 L 700 210 L 650 235 L 620 210 L 570 220 L 545 195 Z',
    center: { x: 625, y: 200 },
  },

  // Oceania
  australia: {
    name: 'Australia',
    continent: 'oceania',
    neighbors: ['indonesia', 'perth', 'novaZelandia'],
    path: 'M 830 480 L 890 470 L 930 505 L 920 560 L 865 575 L 815 545 Z',
    center: { x: 870, y: 520 },
  },
  indonesia: {
    name: 'Indonesia',
    continent: 'oceania',
    neighbors: ['tailandia', 'australia', 'perth'],
    path: 'M 790 410 L 850 400 L 880 430 L 865 475 L 810 485 L 775 450 Z',
    center: { x: 825, y: 440 },
  },
  novaZelandia: {
    name: 'Nova Zelandia',
    continent: 'oceania',
    neighbors: ['australia'],
    path: 'M 940 540 L 975 535 L 990 565 L 980 600 L 945 605 L 930 575 Z',
    center: { x: 960, y: 570 },
  },
  perth: {
    name: 'Perth',
    continent: 'oceania',
    neighbors: ['indonesia', 'australia'],
    path: 'M 770 485 L 810 480 L 830 510 L 815 555 L 770 560 L 750 525 Z',
    center: { x: 785, y: 520 },
  },
};

// Conexoes especiais (atraves de oceanos)
export const OCEAN_CONNECTIONS = [
  ['alaska', 'siberia'],
  ['groelandia', 'islandia'],
  ['brasil', 'nigeria'],
  ['argelia', 'brasil'],
];

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

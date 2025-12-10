// Mapa com geometria realista baseada no mapa mundi
// 42 territorios classicos do War/Risk
// ViewBox: 0 0 1200 700

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
    color: '#3d7c47',
    territories: [
      'alaska', 'territoriosNoroeste', 'groelandia', 'alberta',
      'ontario', 'quebec', 'estadosUnidosOeste', 'estadosUnidosLeste', 'americaCentral'
    ],
  },
  southAmerica: {
    name: 'America do Sul',
    bonus: 2,
    color: '#5a9c4a',
    territories: ['venezuela', 'peru', 'brasil', 'argentina'],
  },
  europe: {
    name: 'Europa',
    bonus: 5,
    color: '#4a6fa5',
    territories: [
      'islandia', 'escandanavia', 'graBretenha', 'europaOcidental',
      'europaSul', 'europaNorte', 'russia'
    ],
  },
  africa: {
    name: 'Africa',
    bonus: 3,
    color: '#c4883a',
    territories: [
      'africaDoNorte', 'egito', 'africaOriental', 'congo',
      'africaDoSul', 'madagascar'
    ],
  },
  asia: {
    name: 'Asia',
    bonus: 7,
    color: '#8b6343',
    territories: [
      'orienteMedio', 'afeganistao', 'ural', 'siberia', 'yakutia',
      'irkutsk', 'mongolia', 'china', 'india', 'sudesteasiatico',
      'japao', 'kamchatka'
    ],
  },
  oceania: {
    name: 'Oceania',
    bonus: 2,
    color: '#a63d5a',
    territories: ['indonesia', 'novaGuine', 'australiaOeste', 'australiaLeste'],
  },
};

// Definicao dos Territorios com paths SVG realistas
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
  // ==================== AMERICA DO NORTE ====================
  alaska: {
    name: 'Alaska',
    continent: 'northAmerica',
    neighbors: ['territoriosNoroeste', 'alberta', 'kamchatka'],
    path: `M 28 95
           C 35 75, 55 65, 80 70
           C 100 72, 115 80, 125 95
           L 130 115
           C 125 130, 115 145, 95 150
           C 75 155, 55 150, 40 140
           C 30 130, 25 115, 28 95
           Z
           M 45 155 L 55 165 L 45 175 L 35 165 Z`,
    center: { x: 75, y: 115 },
  },
  territoriosNoroeste: {
    name: 'Territorios do Noroeste',
    continent: 'northAmerica',
    neighbors: ['alaska', 'alberta', 'ontario', 'groelandia'],
    path: `M 130 85
           C 145 75, 175 70, 210 75
           C 245 80, 270 90, 280 105
           L 275 130
           C 265 145, 240 155, 210 160
           C 180 165, 155 160, 140 150
           L 130 130
           C 128 115, 128 100, 130 85
           Z`,
    center: { x: 200, y: 120 },
  },
  groelandia: {
    name: 'Groelandia',
    continent: 'northAmerica',
    neighbors: ['territoriosNoroeste', 'ontario', 'quebec', 'islandia'],
    path: `M 340 35
           C 365 25, 400 25, 430 35
           C 460 45, 480 65, 485 95
           C 488 125, 480 150, 460 165
           C 440 180, 410 185, 380 180
           C 350 175, 325 160, 315 140
           C 305 120, 310 95, 320 70
           C 330 50, 340 40, 340 35
           Z`,
    center: { x: 400, y: 105 },
  },
  alberta: {
    name: 'Alberta',
    continent: 'northAmerica',
    neighbors: ['alaska', 'territoriosNoroeste', 'ontario', 'estadosUnidosOeste'],
    path: `M 95 150
           C 110 145, 130 140, 150 145
           L 160 165
           C 165 185, 165 200, 155 215
           C 145 225, 125 230, 105 225
           C 90 220, 80 210, 80 195
           C 80 175, 85 160, 95 150
           Z`,
    center: { x: 120, y: 185 },
  },
  ontario: {
    name: 'Ontario',
    continent: 'northAmerica',
    neighbors: ['territoriosNoroeste', 'alberta', 'quebec', 'estadosUnidosOeste', 'estadosUnidosLeste', 'groelandia'],
    path: `M 160 145
           C 180 140, 210 140, 240 150
           C 270 160, 285 175, 285 195
           C 285 215, 270 235, 245 245
           C 220 255, 190 255, 170 245
           C 155 238, 155 225, 155 215
           C 155 195, 155 175, 160 155
           Z`,
    center: { x: 220, y: 195 },
  },
  quebec: {
    name: 'Quebec',
    continent: 'northAmerica',
    neighbors: ['ontario', 'estadosUnidosLeste', 'groelandia'],
    path: `M 285 155
           C 305 145, 335 140, 360 150
           C 385 160, 400 180, 395 205
           C 390 230, 370 250, 340 255
           C 310 260, 285 250, 275 235
           C 268 222, 275 200, 280 180
           C 282 168, 285 160, 285 155
           Z`,
    center: { x: 335, y: 200 },
  },
  estadosUnidosOeste: {
    name: 'EUA Oeste',
    continent: 'northAmerica',
    neighbors: ['alberta', 'ontario', 'estadosUnidosLeste', 'americaCentral'],
    path: `M 80 225
           C 95 220, 120 220, 150 230
           L 175 245
           L 185 285
           C 180 310, 165 330, 140 340
           C 115 350, 90 345, 75 330
           C 60 315, 55 290, 60 265
           C 65 245, 70 230, 80 225
           Z`,
    center: { x: 120, y: 285 },
  },
  estadosUnidosLeste: {
    name: 'EUA Leste',
    continent: 'northAmerica',
    neighbors: ['ontario', 'quebec', 'estadosUnidosOeste', 'americaCentral'],
    path: `M 175 245
           C 200 240, 235 240, 265 250
           C 295 260, 315 280, 315 305
           C 315 330, 295 350, 265 360
           C 235 370, 200 365, 180 350
           C 165 338, 165 320, 170 300
           C 175 280, 175 260, 175 245
           Z`,
    center: { x: 240, y: 300 },
  },
  americaCentral: {
    name: 'America Central',
    continent: 'northAmerica',
    neighbors: ['estadosUnidosOeste', 'estadosUnidosLeste', 'venezuela'],
    path: `M 140 340
           C 160 335, 180 340, 195 355
           C 210 370, 215 390, 205 410
           C 195 430, 175 445, 155 450
           C 135 455, 115 450, 105 435
           C 95 420, 95 400, 105 380
           C 115 360, 125 345, 140 340
           Z`,
    center: { x: 155, y: 395 },
  },

  // ==================== AMERICA DO SUL ====================
  venezuela: {
    name: 'Venezuela',
    continent: 'southAmerica',
    neighbors: ['americaCentral', 'peru', 'brasil'],
    path: `M 195 445
           C 215 440, 245 445, 270 460
           C 295 475, 305 495, 295 515
           C 285 535, 260 545, 235 545
           C 210 545, 190 535, 185 515
           C 180 495, 185 475, 195 455
           Z`,
    center: { x: 240, y: 490 },
  },
  peru: {
    name: 'Peru',
    continent: 'southAmerica',
    neighbors: ['venezuela', 'brasil', 'argentina'],
    path: `M 175 530
           C 195 520, 225 525, 240 545
           L 245 580
           C 245 610, 235 640, 215 660
           C 195 680, 170 685, 155 670
           C 140 655, 140 630, 145 600
           C 150 570, 160 545, 175 530
           Z`,
    center: { x: 195, y: 605 },
  },
  brasil: {
    name: 'Brasil',
    continent: 'southAmerica',
    neighbors: ['venezuela', 'peru', 'argentina', 'africaDoNorte'],
    path: `M 245 520
           C 275 510, 315 520, 345 545
           C 375 570, 390 605, 380 640
           C 370 675, 340 700, 305 710
           C 270 720, 240 710, 225 690
           C 210 670, 215 640, 225 610
           C 235 580, 240 550, 245 520
           Z`,
    center: { x: 305, y: 615 },
  },
  argentina: {
    name: 'Argentina',
    continent: 'southAmerica',
    neighbors: ['peru', 'brasil'],
    path: `M 215 660
           C 235 650, 265 660, 285 685
           C 305 710, 310 745, 295 780
           C 280 815, 250 840, 225 850
           C 200 860, 180 850, 175 825
           C 170 800, 180 770, 190 740
           C 200 710, 205 680, 215 660
           Z`,
    center: { x: 245, y: 755 },
  },

  // ==================== EUROPA ====================
  islandia: {
    name: 'Islandia',
    continent: 'europe',
    neighbors: ['groelandia', 'escandanavia', 'graBretenha'],
    path: `M 490 85
           C 510 75, 540 80, 555 95
           C 570 110, 570 130, 555 145
           C 540 160, 515 165, 495 155
           C 475 145, 470 125, 475 105
           C 480 90, 490 85, 490 85
           Z`,
    center: { x: 520, y: 120 },
  },
  escandanavia: {
    name: 'Escandanavia',
    continent: 'europe',
    neighbors: ['islandia', 'graBretenha', 'europaNorte', 'russia'],
    path: `M 570 55
           C 590 45, 620 50, 650 65
           C 680 80, 700 105, 695 135
           C 690 165, 670 185, 640 195
           C 610 205, 580 200, 565 180
           C 550 160, 555 135, 560 110
           C 565 85, 570 65, 570 55
           Z`,
    center: { x: 625, y: 125 },
  },
  graBretenha: {
    name: 'Gra-Bretanha',
    continent: 'europe',
    neighbors: ['islandia', 'escandanavia', 'europaOcidental', 'europaNorte'],
    path: `M 510 165
           C 525 155, 550 160, 565 175
           C 580 190, 585 215, 575 235
           C 565 255, 545 265, 520 265
           C 495 265, 480 250, 480 230
           C 480 210, 490 185, 510 170
           Z`,
    center: { x: 530, y: 215 },
  },
  europaOcidental: {
    name: 'Europa Ocidental',
    continent: 'europe',
    neighbors: ['graBretenha', 'europaNorte', 'europaSul', 'africaDoNorte'],
    path: `M 500 270
           C 520 260, 550 265, 570 280
           L 580 310
           C 580 340, 570 365, 545 380
           C 520 395, 490 395, 475 375
           C 460 355, 465 325, 475 300
           C 485 280, 500 270, 500 270
           Z`,
    center: { x: 525, y: 330 },
  },
  europaNorte: {
    name: 'Europa do Norte',
    continent: 'europe',
    neighbors: ['graBretenha', 'escandanavia', 'europaOcidental', 'europaSul', 'russia'],
    path: `M 580 185
           C 610 175, 650 185, 680 205
           C 710 225, 725 255, 715 285
           C 705 315, 680 335, 645 340
           C 610 345, 580 335, 570 310
           C 560 285, 565 255, 575 225
           C 580 205, 580 190, 580 185
           Z`,
    center: { x: 640, y: 265 },
  },
  europaSul: {
    name: 'Europa do Sul',
    continent: 'europe',
    neighbors: ['europaOcidental', 'europaNorte', 'russia', 'africaDoNorte', 'egito', 'orienteMedio'],
    path: `M 570 345
           C 600 335, 640 340, 670 360
           C 700 380, 715 410, 705 440
           C 695 470, 665 490, 630 490
           C 595 490, 565 475, 555 450
           C 545 425, 550 395, 560 370
           C 565 355, 570 345, 570 345
           Z`,
    center: { x: 630, y: 415 },
  },
  russia: {
    name: 'Russia',
    continent: 'europe',
    neighbors: ['escandanavia', 'europaNorte', 'europaSul', 'ural', 'afeganistao', 'orienteMedio'],
    path: `M 700 120
           C 740 105, 790 115, 830 140
           C 870 165, 895 200, 890 240
           C 885 280, 860 315, 825 335
           C 790 355, 750 350, 725 330
           C 705 312, 700 290, 710 265
           C 720 240, 730 215, 720 185
           C 710 155, 700 135, 700 120
           Z`,
    center: { x: 790, y: 230 },
  },

  // ==================== AFRICA ====================
  africaDoNorte: {
    name: 'Africa do Norte',
    continent: 'africa',
    neighbors: ['europaOcidental', 'europaSul', 'egito', 'africaOriental', 'congo', 'brasil'],
    path: `M 480 420
           C 520 400, 580 405, 630 425
           C 680 445, 710 480, 705 520
           C 700 560, 670 590, 625 605
           C 580 620, 530 615, 500 590
           C 470 565, 460 530, 465 495
           C 470 460, 475 435, 480 420
           Z`,
    center: { x: 580, y: 510 },
  },
  egito: {
    name: 'Egito',
    continent: 'africa',
    neighbors: ['europaSul', 'africaDoNorte', 'africaOriental', 'orienteMedio'],
    path: `M 640 430
           C 670 420, 710 430, 740 455
           C 770 480, 785 515, 775 550
           C 765 585, 740 610, 705 615
           C 670 620, 640 605, 625 580
           C 615 560, 620 530, 630 500
           C 635 470, 640 445, 640 430
           Z`,
    center: { x: 700, y: 525 },
  },
  africaOriental: {
    name: 'Africa Oriental',
    continent: 'africa',
    neighbors: ['egito', 'africaDoNorte', 'congo', 'africaDoSul', 'madagascar'],
    path: `M 640 600
           C 670 585, 710 595, 740 620
           C 770 645, 785 680, 775 715
           C 765 750, 740 780, 700 790
           C 660 800, 625 790, 610 765
           C 595 740, 600 710, 615 680
           C 625 650, 635 620, 640 600
           Z`,
    center: { x: 690, y: 695 },
  },
  congo: {
    name: 'Congo',
    continent: 'africa',
    neighbors: ['africaDoNorte', 'africaOriental', 'africaDoSul'],
    path: `M 565 595
           C 595 580, 640 590, 665 620
           C 690 650, 700 690, 685 725
           C 670 760, 640 785, 600 790
           C 560 795, 530 780, 520 750
           C 510 720, 520 685, 535 655
           C 550 625, 560 605, 565 595
           Z`,
    center: { x: 600, y: 690 },
  },
  africaDoSul: {
    name: 'Africa do Sul',
    continent: 'africa',
    neighbors: ['congo', 'africaOriental', 'madagascar'],
    path: `M 580 780
           C 620 765, 670 775, 705 805
           C 740 835, 755 875, 740 910
           C 725 945, 690 970, 645 975
           C 600 980, 560 965, 545 935
           C 530 905, 535 870, 555 840
           C 565 815, 575 795, 580 780
           Z`,
    center: { x: 645, y: 875 },
  },
  madagascar: {
    name: 'Madagascar',
    continent: 'africa',
    neighbors: ['africaOriental', 'africaDoSul'],
    path: `M 780 750
           C 800 740, 830 750, 850 775
           C 870 800, 880 835, 870 870
           C 860 905, 835 930, 805 935
           C 775 940, 750 925, 745 895
           C 740 865, 750 830, 760 800
           C 768 775, 778 755, 780 750
           Z`,
    center: { x: 810, y: 845 },
  },

  // ==================== ASIA ====================
  orienteMedio: {
    name: 'Oriente Medio',
    continent: 'asia',
    neighbors: ['europaSul', 'russia', 'egito', 'afeganistao', 'india'],
    path: `M 720 380
           C 755 365, 800 375, 835 400
           C 870 425, 890 460, 880 500
           C 870 540, 840 570, 800 580
           C 760 590, 725 575, 710 545
           C 695 515, 700 480, 710 445
           C 715 420, 720 395, 720 380
           Z`,
    center: { x: 795, y: 480 },
  },
  afeganistao: {
    name: 'Afeganistao',
    continent: 'asia',
    neighbors: ['russia', 'orienteMedio', 'india', 'china', 'ural'],
    path: `M 850 310
           C 885 295, 930 305, 960 335
           C 990 365, 1000 405, 985 440
           C 970 475, 940 495, 900 495
           C 860 495, 830 475, 820 445
           C 810 415, 820 380, 835 350
           C 845 330, 850 315, 850 310
           Z`,
    center: { x: 905, y: 400 },
  },
  ural: {
    name: 'Ural',
    continent: 'asia',
    neighbors: ['russia', 'afeganistao', 'siberia', 'china'],
    path: `M 870 160
           C 910 145, 960 155, 1000 180
           C 1040 205, 1060 245, 1050 290
           C 1040 335, 1010 370, 970 380
           C 930 390, 895 375, 880 345
           C 865 315, 865 280, 870 245
           C 875 210, 870 180, 870 160
           Z`,
    center: { x: 960, y: 270 },
  },
  siberia: {
    name: 'Siberia',
    continent: 'asia',
    neighbors: ['ural', 'china', 'mongolia', 'irkutsk', 'yakutia'],
    path: `M 1000 80
           C 1050 65, 1115 75, 1160 105
           C 1205 135, 1230 180, 1220 230
           C 1210 280, 1175 320, 1130 340
           C 1085 360, 1040 355, 1010 325
           C 980 295, 975 255, 985 215
           C 990 175, 995 130, 1000 80
           Z`,
    center: { x: 1105, y: 210 },
  },
  yakutia: {
    name: 'Yakutia',
    continent: 'asia',
    neighbors: ['siberia', 'irkutsk', 'kamchatka'],
    path: `M 1150 45
           C 1195 30, 1250 40, 1290 70
           C 1330 100, 1350 145, 1340 195
           C 1330 245, 1300 285, 1255 300
           C 1210 315, 1165 305, 1145 275
           C 1125 245, 1130 210, 1140 170
           C 1145 130, 1145 85, 1150 45
           Z`,
    center: { x: 1245, y: 175 },
  },
  irkutsk: {
    name: 'Irkutsk',
    continent: 'asia',
    neighbors: ['siberia', 'yakutia', 'mongolia', 'kamchatka'],
    path: `M 1140 280
           C 1175 265, 1220 275, 1255 300
           C 1290 325, 1310 365, 1300 405
           C 1290 445, 1260 475, 1220 485
           C 1180 495, 1145 480, 1130 450
           C 1115 420, 1120 385, 1130 350
           C 1135 320, 1140 295, 1140 280
           Z`,
    center: { x: 1215, y: 380 },
  },
  mongolia: {
    name: 'Mongolia',
    continent: 'asia',
    neighbors: ['siberia', 'irkutsk', 'china', 'japao', 'kamchatka'],
    path: `M 1050 325
           C 1090 310, 1140 320, 1175 350
           C 1210 380, 1225 420, 1210 460
           C 1195 500, 1160 530, 1115 535
           C 1070 540, 1030 520, 1015 490
           C 1000 460, 1010 420, 1025 385
           C 1035 355, 1045 335, 1050 325
           Z`,
    center: { x: 1110, y: 430 },
  },
  china: {
    name: 'China',
    continent: 'asia',
    neighbors: ['afeganistao', 'ural', 'siberia', 'mongolia', 'india', 'sudesteasiatico'],
    path: `M 970 385
           C 1010 370, 1060 380, 1100 410
           C 1140 440, 1160 485, 1150 530
           C 1140 575, 1105 610, 1060 625
           C 1015 640, 970 630, 945 600
           C 920 570, 920 530, 930 490
           C 940 450, 955 410, 970 385
           Z`,
    center: { x: 1045, y: 505 },
  },
  india: {
    name: 'India',
    continent: 'asia',
    neighbors: ['orienteMedio', 'afeganistao', 'china', 'sudesteasiatico'],
    path: `M 890 500
           C 925 485, 970 495, 1000 525
           C 1030 555, 1045 600, 1030 645
           C 1015 690, 980 725, 935 735
           C 890 745, 850 730, 835 695
           C 820 660, 830 620, 850 580
           C 865 545, 880 515, 890 500
           Z`,
    center: { x: 935, y: 615 },
  },
  sudesteasiatico: {
    name: 'Sudeste Asiatico',
    continent: 'asia',
    neighbors: ['india', 'china', 'indonesia'],
    path: `M 1040 620
           C 1075 605, 1120 615, 1150 645
           C 1180 675, 1195 720, 1180 760
           C 1165 800, 1130 830, 1085 835
           C 1040 840, 1000 820, 985 785
           C 970 750, 980 710, 1000 670
           C 1015 640, 1035 625, 1040 620
           Z`,
    center: { x: 1085, y: 725 },
  },
  japao: {
    name: 'Japao',
    continent: 'asia',
    neighbors: ['mongolia', 'kamchatka'],
    path: `M 1250 420
           C 1280 405, 1320 415, 1345 445
           C 1370 475, 1380 515, 1365 555
           C 1350 595, 1320 625, 1280 630
           C 1240 635, 1210 615, 1200 580
           C 1190 545, 1200 505, 1220 470
           C 1235 445, 1250 425, 1250 420
           Z`,
    center: { x: 1285, y: 520 },
  },
  kamchatka: {
    name: 'Kamchatka',
    continent: 'asia',
    neighbors: ['yakutia', 'irkutsk', 'mongolia', 'japao', 'alaska'],
    path: `M 1320 140
           C 1360 125, 1405 135, 1435 165
           C 1465 195, 1480 240, 1470 285
           C 1460 330, 1430 365, 1390 380
           C 1350 395, 1310 385, 1290 355
           C 1270 325, 1275 290, 1285 250
           C 1295 210, 1310 170, 1320 140
           Z`,
    center: { x: 1380, y: 260 },
  },

  // ==================== OCEANIA ====================
  indonesia: {
    name: 'Indonesia',
    continent: 'oceania',
    neighbors: ['sudesteasiatico', 'novaGuine', 'australiaOeste'],
    path: `M 1090 810
           C 1130 795, 1185 805, 1225 835
           C 1265 865, 1285 910, 1270 950
           C 1255 990, 1220 1020, 1175 1025
           C 1130 1030, 1090 1015, 1070 985
           C 1050 955, 1055 915, 1070 875
           C 1080 845, 1085 820, 1090 810
           Z`,
    center: { x: 1170, y: 915 },
  },
  novaGuine: {
    name: 'Nova Guine',
    continent: 'oceania',
    neighbors: ['indonesia', 'australiaLeste'],
    path: `M 1260 870
           C 1295 855, 1340 865, 1375 895
           C 1410 925, 1430 970, 1415 1010
           C 1400 1050, 1365 1080, 1320 1085
           C 1275 1090, 1240 1075, 1225 1045
           C 1210 1015, 1220 980, 1235 945
           C 1250 915, 1260 885, 1260 870
           Z`,
    center: { x: 1320, y: 975 },
  },
  australiaOeste: {
    name: 'Australia Ocidental',
    continent: 'oceania',
    neighbors: ['indonesia', 'australiaLeste'],
    path: `M 1120 1000
           C 1160 985, 1210 995, 1245 1030
           C 1280 1065, 1295 1115, 1280 1160
           C 1265 1205, 1230 1240, 1180 1250
           C 1130 1260, 1085 1245, 1065 1210
           C 1045 1175, 1055 1135, 1075 1095
           C 1090 1060, 1110 1025, 1120 1000
           Z`,
    center: { x: 1175, y: 1125 },
  },
  australiaLeste: {
    name: 'Australia Oriental',
    continent: 'oceania',
    neighbors: ['novaGuine', 'australiaOeste'],
    path: `M 1260 1030
           C 1300 1015, 1350 1025, 1390 1060
           C 1430 1095, 1455 1145, 1440 1195
           C 1425 1245, 1390 1285, 1340 1295
           C 1290 1305, 1245 1290, 1225 1255
           C 1205 1220, 1215 1180, 1230 1140
           C 1245 1100, 1255 1060, 1260 1030
           Z`,
    center: { x: 1340, y: 1160 },
  },
};

// Conexoes especiais (atraves de oceanos) - para desenhar linhas tracejadas
export const OCEAN_CONNECTIONS: [string, string][] = [
  ['alaska', 'kamchatka'],
  ['groelandia', 'islandia'],
  ['brasil', 'africaDoNorte'],
  ['africaOriental', 'orienteMedio'],
  ['sudesteasiatico', 'indonesia'],
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

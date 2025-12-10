// Definicao dos Continentes e Territorios do War
const CONTINENTS = {
    northAmerica: {
        name: 'America do Norte',
        bonus: 5,
        color: '#228b22',
        territories: ['alaska', 'alberta', 'americaCentral', 'estadosUnidos', 'groelandia', 'mexico', 'novaYork', 'ottawa', 'vancouver']
    },
    southAmerica: {
        name: 'America do Sul',
        bonus: 2,
        color: '#ffd700',
        territories: ['argentina', 'brasil', 'peru', 'venezuela']
    },
    europe: {
        name: 'Europa',
        bonus: 5,
        color: '#4169e1',
        territories: ['alemanha', 'franca', 'gra-bretanha', 'islandia', 'italia', 'polonia', 'russia']
    },
    africa: {
        name: 'Africa',
        bonus: 3,
        color: '#ff8c00',
        territories: ['argelia', 'egito', 'congo', 'africaDoSul', 'madagascar', 'nigeria']
    },
    asia: {
        name: 'Asia',
        bonus: 7,
        color: '#8b4513',
        territories: ['arabia', 'bangladesh', 'cazaquistao', 'china', 'coreia', 'india', 'japao', 'mongolia', 'oriente-medio', 'siberia', 'tailandia', 'turquia']
    },
    oceania: {
        name: 'Oceania',
        bonus: 2,
        color: '#dc143c',
        territories: ['australia', 'indonesia', 'novaZelandia', 'perth']
    }
};

// Definicao dos Territorios com coordenadas para o mapa SVG
const TERRITORIES = {
    // America do Norte
    alaska: {
        name: 'Alaska',
        continent: 'northAmerica',
        path: 'M 45 80 L 95 60 L 110 85 L 100 120 L 60 130 L 35 110 Z',
        center: { x: 70, y: 95 },
        neighbors: ['vancouver', 'alberta', 'siberia']
    },
    alberta: {
        name: 'Alberta',
        continent: 'northAmerica',
        path: 'M 100 120 L 110 85 L 150 80 L 165 120 L 150 150 L 110 150 Z',
        center: { x: 135, y: 115 },
        neighbors: ['alaska', 'vancouver', 'ottawa', 'estadosUnidos']
    },
    americaCentral: {
        name: 'America Central',
        continent: 'northAmerica',
        path: 'M 130 250 L 170 230 L 190 260 L 175 300 L 140 310 L 120 280 Z',
        center: { x: 155, y: 270 },
        neighbors: ['mexico', 'venezuela']
    },
    estadosUnidos: {
        name: 'Estados Unidos',
        continent: 'northAmerica',
        path: 'M 110 150 L 150 150 L 200 145 L 220 180 L 200 220 L 150 230 L 110 210 L 100 170 Z',
        center: { x: 155, y: 185 },
        neighbors: ['alberta', 'ottawa', 'novaYork', 'mexico']
    },
    groelandia: {
        name: 'Groelandia',
        continent: 'northAmerica',
        path: 'M 280 30 L 340 25 L 370 55 L 360 100 L 310 110 L 270 85 L 265 50 Z',
        center: { x: 315, y: 65 },
        neighbors: ['ottawa', 'islandia']
    },
    mexico: {
        name: 'Mexico',
        continent: 'northAmerica',
        path: 'M 100 210 L 150 230 L 170 230 L 130 250 L 120 280 L 90 270 L 80 230 Z',
        center: { x: 115, y: 245 },
        neighbors: ['estadosUnidos', 'americaCentral']
    },
    novaYork: {
        name: 'Nova York',
        continent: 'northAmerica',
        path: 'M 200 145 L 250 130 L 275 155 L 260 190 L 220 195 L 200 170 Z',
        center: { x: 230, y: 165 },
        neighbors: ['ottawa', 'estadosUnidos']
    },
    ottawa: {
        name: 'Ottawa',
        continent: 'northAmerica',
        path: 'M 165 120 L 200 100 L 260 95 L 280 120 L 250 130 L 200 145 L 165 120 Z',
        center: { x: 220, y: 115 },
        neighbors: ['alberta', 'estadosUnidos', 'novaYork', 'groelandia', 'vancouver']
    },
    vancouver: {
        name: 'Vancouver',
        continent: 'northAmerica',
        path: 'M 60 130 L 100 120 L 110 150 L 100 170 L 70 170 L 50 150 Z',
        center: { x: 80, y: 145 },
        neighbors: ['alaska', 'alberta', 'ottawa']
    },

    // America do Sul
    argentina: {
        name: 'Argentina',
        continent: 'southAmerica',
        path: 'M 180 420 L 210 400 L 230 430 L 220 490 L 195 520 L 170 490 L 165 440 Z',
        center: { x: 195, y: 455 },
        neighbors: ['brasil', 'peru']
    },
    brasil: {
        name: 'Brasil',
        continent: 'southAmerica',
        path: 'M 200 330 L 260 320 L 290 360 L 270 420 L 230 430 L 210 400 L 180 420 L 175 370 Z',
        center: { x: 230, y: 370 },
        neighbors: ['venezuela', 'peru', 'argentina', 'nigeria']
    },
    peru: {
        name: 'Peru',
        continent: 'southAmerica',
        path: 'M 140 350 L 175 330 L 200 330 L 175 370 L 180 420 L 165 440 L 130 410 L 125 370 Z',
        center: { x: 155, y: 385 },
        neighbors: ['venezuela', 'brasil', 'argentina']
    },
    venezuela: {
        name: 'Venezuela',
        continent: 'southAmerica',
        path: 'M 140 310 L 175 300 L 210 310 L 200 330 L 175 330 L 140 350 L 125 330 Z',
        center: { x: 170, y: 320 },
        neighbors: ['americaCentral', 'brasil', 'peru']
    },

    // Europa
    alemanha: {
        name: 'Alemanha',
        continent: 'europe',
        path: 'M 470 145 L 510 135 L 530 155 L 520 185 L 485 195 L 460 175 Z',
        center: { x: 490, y: 165 },
        neighbors: ['franca', 'italia', 'polonia']
    },
    franca: {
        name: 'Franca',
        continent: 'europe',
        path: 'M 410 170 L 460 160 L 470 145 L 460 175 L 485 195 L 470 220 L 420 215 L 400 190 Z',
        center: { x: 440, y: 190 },
        neighbors: ['gra-bretanha', 'alemanha', 'italia', 'argelia']
    },
    'gra-bretanha': {
        name: 'Gra-Bretanha',
        continent: 'europe',
        path: 'M 395 115 L 425 105 L 445 130 L 435 160 L 410 170 L 385 150 Z',
        center: { x: 415, y: 140 },
        neighbors: ['islandia', 'franca']
    },
    islandia: {
        name: 'Islandia',
        continent: 'europe',
        path: 'M 370 55 L 410 50 L 430 75 L 415 100 L 375 100 L 355 75 Z',
        center: { x: 390, y: 75 },
        neighbors: ['groelandia', 'gra-bretanha']
    },
    italia: {
        name: 'Italia',
        continent: 'europe',
        path: 'M 470 220 L 485 195 L 520 185 L 530 210 L 515 250 L 480 260 L 455 240 Z',
        center: { x: 490, y: 225 },
        neighbors: ['franca', 'alemanha', 'polonia', 'argelia', 'egito']
    },
    polonia: {
        name: 'Polonia',
        continent: 'europe',
        path: 'M 510 135 L 560 120 L 590 140 L 580 180 L 530 190 L 520 185 L 530 155 Z',
        center: { x: 550, y: 155 },
        neighbors: ['alemanha', 'italia', 'russia', 'turquia']
    },
    russia: {
        name: 'Russia',
        continent: 'europe',
        path: 'M 560 80 L 620 65 L 660 90 L 650 140 L 590 140 L 560 120 Z',
        center: { x: 605, y: 105 },
        neighbors: ['polonia', 'turquia', 'siberia', 'cazaquistao']
    },

    // Africa
    argelia: {
        name: 'Argelia',
        continent: 'africa',
        path: 'M 400 250 L 460 240 L 480 260 L 470 310 L 420 320 L 390 290 Z',
        center: { x: 435, y: 280 },
        neighbors: ['franca', 'italia', 'egito', 'nigeria', 'brasil']
    },
    egito: {
        name: 'Egito',
        continent: 'africa',
        path: 'M 480 260 L 530 250 L 560 280 L 545 330 L 500 340 L 470 310 Z',
        center: { x: 515, y: 295 },
        neighbors: ['italia', 'argelia', 'nigeria', 'oriente-medio']
    },
    congo: {
        name: 'Congo',
        continent: 'africa',
        path: 'M 470 380 L 520 370 L 545 400 L 530 450 L 485 460 L 455 425 Z',
        center: { x: 495, y: 415 },
        neighbors: ['nigeria', 'africaDoSul', 'madagascar']
    },
    africaDoSul: {
        name: 'Africa do Sul',
        continent: 'africa',
        path: 'M 485 460 L 530 450 L 550 485 L 530 530 L 480 535 L 460 495 Z',
        center: { x: 505, y: 495 },
        neighbors: ['congo', 'madagascar']
    },
    madagascar: {
        name: 'Madagascar',
        continent: 'africa',
        path: 'M 560 450 L 590 445 L 605 480 L 595 520 L 565 525 L 550 485 Z',
        center: { x: 575, y: 485 },
        neighbors: ['congo', 'africaDoSul']
    },
    nigeria: {
        name: 'Nigeria',
        continent: 'africa',
        path: 'M 420 320 L 470 310 L 500 340 L 520 370 L 470 380 L 425 370 L 400 340 Z',
        center: { x: 455, y: 345 },
        neighbors: ['argelia', 'egito', 'congo', 'brasil']
    },

    // Asia
    arabia: {
        name: 'Arabia',
        continent: 'asia',
        path: 'M 560 280 L 610 270 L 640 300 L 620 350 L 570 355 L 545 330 Z',
        center: { x: 590, y: 315 },
        neighbors: ['egito', 'oriente-medio', 'india']
    },
    bangladesh: {
        name: 'Bangladesh',
        continent: 'asia',
        path: 'M 720 280 L 760 270 L 785 295 L 775 340 L 735 350 L 705 320 Z',
        center: { x: 745, y: 310 },
        neighbors: ['india', 'tailandia', 'china']
    },
    cazaquistao: {
        name: 'Cazaquistao',
        continent: 'asia',
        path: 'M 650 100 L 720 85 L 760 115 L 745 165 L 685 175 L 650 140 Z',
        center: { x: 700, y: 130 },
        neighbors: ['russia', 'siberia', 'mongolia', 'china', 'turquia']
    },
    china: {
        name: 'China',
        continent: 'asia',
        path: 'M 745 165 L 800 155 L 840 185 L 830 235 L 785 250 L 735 245 L 700 210 Z',
        center: { x: 770, y: 205 },
        neighbors: ['cazaquistao', 'mongolia', 'coreia', 'india', 'bangladesh', 'tailandia']
    },
    coreia: {
        name: 'Coreia',
        continent: 'asia',
        path: 'M 840 185 L 880 175 L 905 200 L 895 240 L 855 250 L 830 220 Z',
        center: { x: 865, y: 215 },
        neighbors: ['china', 'japao', 'mongolia']
    },
    india: {
        name: 'India',
        continent: 'asia',
        path: 'M 640 300 L 705 285 L 720 280 L 705 320 L 735 350 L 710 400 L 660 410 L 630 370 L 620 350 Z',
        center: { x: 670, y: 350 },
        neighbors: ['oriente-medio', 'arabia', 'bangladesh', 'china', 'tailandia']
    },
    japao: {
        name: 'Japao',
        continent: 'asia',
        path: 'M 905 160 L 940 150 L 965 180 L 955 225 L 920 235 L 895 200 Z',
        center: { x: 930, y: 190 },
        neighbors: ['coreia', 'mongolia']
    },
    mongolia: {
        name: 'Mongolia',
        continent: 'asia',
        path: 'M 760 115 L 830 100 L 870 130 L 860 175 L 800 155 L 745 165 Z',
        center: { x: 805, y: 140 },
        neighbors: ['cazaquistao', 'siberia', 'china', 'coreia', 'japao']
    },
    'oriente-medio': {
        name: 'Oriente Medio',
        continent: 'asia',
        path: 'M 570 220 L 620 210 L 650 235 L 640 300 L 610 270 L 560 280 L 545 250 Z',
        center: { x: 600, y: 255 },
        neighbors: ['egito', 'turquia', 'arabia', 'india']
    },
    siberia: {
        name: 'Siberia',
        continent: 'asia',
        path: 'M 720 40 L 800 30 L 860 60 L 850 100 L 830 100 L 760 115 L 720 85 L 660 90 L 650 60 Z',
        center: { x: 765, y: 70 },
        neighbors: ['russia', 'cazaquistao', 'mongolia', 'alaska']
    },
    tailandia: {
        name: 'Tailandia',
        continent: 'asia',
        path: 'M 775 340 L 820 330 L 845 360 L 830 410 L 785 420 L 755 385 Z',
        center: { x: 800, y: 375 },
        neighbors: ['india', 'bangladesh', 'china', 'indonesia']
    },
    turquia: {
        name: 'Turquia',
        continent: 'asia',
        path: 'M 580 180 L 650 170 L 685 175 L 700 210 L 650 235 L 620 210 L 570 220 L 545 195 Z',
        center: { x: 625, y: 200 },
        neighbors: ['polonia', 'russia', 'cazaquistao', 'oriente-medio']
    },

    // Oceania
    australia: {
        name: 'Australia',
        continent: 'oceania',
        path: 'M 830 480 L 890 470 L 930 505 L 920 560 L 865 575 L 815 545 Z',
        center: { x: 870, y: 520 },
        neighbors: ['indonesia', 'perth', 'novaZelandia']
    },
    indonesia: {
        name: 'Indonesia',
        continent: 'oceania',
        path: 'M 790 410 L 850 400 L 880 430 L 865 475 L 810 485 L 775 450 Z',
        center: { x: 825, y: 440 },
        neighbors: ['tailandia', 'australia', 'perth']
    },
    novaZelandia: {
        name: 'Nova Zelandia',
        continent: 'oceania',
        path: 'M 940 540 L 975 535 L 990 565 L 980 600 L 945 605 L 930 575 Z',
        center: { x: 960, y: 570 },
        neighbors: ['australia']
    },
    perth: {
        name: 'Perth',
        continent: 'oceania',
        path: 'M 770 485 L 810 480 L 830 510 L 815 555 L 770 560 L 750 525 Z',
        center: { x: 785, y: 520 },
        neighbors: ['indonesia', 'australia']
    }
};

// Funcao para gerar o SVG do mapa
function generateMapSVG() {
    const svg = document.getElementById('world-map');
    if (!svg) return;

    // Limpa o SVG
    svg.innerHTML = '';

    // Adiciona definicoes (gradientes, etc)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Cria gradientes para cada continente
    for (const [continentId, continent] of Object.entries(CONTINENTS)) {
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `gradient-${continentId}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', `stop-color:${continent.color};stop-opacity:1`);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', `stop-color:${adjustColor(continent.color, -30)};stop-opacity:1`);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
    }

    svg.appendChild(defs);

    // Adiciona linhas de conexao entre territorios nao adjacentes
    const connections = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    connections.setAttribute('class', 'connections');

    // Conexoes especiais (atraves de oceanos)
    const specialConnections = [
        ['alaska', 'siberia'],
        ['groelandia', 'islandia'],
        ['brasil', 'nigeria'],
        ['argelia', 'brasil']
    ];

    specialConnections.forEach(([from, to]) => {
        const t1 = TERRITORIES[from];
        const t2 = TERRITORIES[to];
        if (t1 && t2) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', t1.center.x);
            line.setAttribute('y1', t1.center.y);
            line.setAttribute('x2', t2.center.x);
            line.setAttribute('y2', t2.center.y);
            line.setAttribute('stroke', 'rgba(255,255,255,0.2)');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
            connections.appendChild(line);
        }
    });

    svg.appendChild(connections);

    // Grupo para os territorios
    const territoriesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    territoriesGroup.setAttribute('id', 'territories-group');

    // Adiciona cada territorio
    for (const [territoryId, territory] of Object.entries(TERRITORIES)) {
        const continent = CONTINENTS[territory.continent];

        // Cria o path do territorio
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `territory-${territoryId}`);
        path.setAttribute('d', territory.path);
        path.setAttribute('class', 'territory');
        path.setAttribute('fill', `url(#gradient-${territory.continent})`);
        path.setAttribute('data-territory', territoryId);
        path.setAttribute('data-continent', territory.continent);

        territoriesGroup.appendChild(path);
    }

    svg.appendChild(territoriesGroup);

    // Grupo para os labels e exercitos
    const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelsGroup.setAttribute('id', 'labels-group');

    for (const [territoryId, territory] of Object.entries(TERRITORIES)) {
        // Circulo para mostrar exercitos
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('id', `army-circle-${territoryId}`);
        circle.setAttribute('cx', territory.center.x);
        circle.setAttribute('cy', territory.center.y);
        circle.setAttribute('r', '15');
        circle.setAttribute('class', 'army-circle');
        circle.setAttribute('fill', 'rgba(0,0,0,0.7)');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');

        labelsGroup.appendChild(circle);

        // Texto do numero de exercitos
        const armyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        armyText.setAttribute('id', `army-text-${territoryId}`);
        armyText.setAttribute('x', territory.center.x);
        armyText.setAttribute('y', territory.center.y + 5);
        armyText.setAttribute('class', 'territory-armies');
        armyText.textContent = '0';

        labelsGroup.appendChild(armyText);

        // Nome do territorio (tooltip)
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = territory.name;

        const pathElement = document.getElementById(`territory-${territoryId}`);
        if (pathElement) {
            pathElement.appendChild(title);
        }
    }

    svg.appendChild(labelsGroup);
}

// Funcao auxiliar para ajustar cor (escurecer/clarear)
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Exporta para uso em game.js
window.CONTINENTS = CONTINENTS;
window.TERRITORIES = TERRITORIES;
window.generateMapSVG = generateMapSVG;

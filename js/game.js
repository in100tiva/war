// ===== GAME STATE =====
const GameState = {
    players: [],
    currentPlayerIndex: 0,
    phase: 'reinforce', // reinforce, attack, fortify
    territories: {},
    selectedTerritory: null,
    targetTerritory: null,
    reinforcementsLeft: 0,
    hasConqueredThisTurn: false,
    gameStarted: false,
    fortifyUsed: false
};

// Cores dos jogadores
const PLAYER_COLORS = [
    { name: 'Vermelho', color: '#e74c3c', class: 'player-1' },
    { name: 'Azul', color: '#3498db', class: 'player-2' },
    { name: 'Verde', color: '#2ecc71', class: 'player-3' },
    { name: 'Laranja', color: '#f39c12', class: 'player-4' },
    { name: 'Roxo', color: '#9b59b6', class: 'player-5' },
    { name: 'Turquesa', color: '#1abc9c', class: 'player-6' }
];

// ===== INICIALIZACAO =====
document.addEventListener('DOMContentLoaded', () => {
    initializeStartScreen();
    generateMapSVG();
});

function initializeStartScreen() {
    const numPlayersSelect = document.getElementById('num-players');
    const startBtn = document.getElementById('start-game-btn');
    const playerNamesContainer = document.getElementById('player-names-container');

    // Atualiza campos de nome quando muda numero de jogadores
    numPlayersSelect.addEventListener('change', () => {
        updatePlayerNameFields(parseInt(numPlayersSelect.value));
    });

    // Inicializa com 3 jogadores
    updatePlayerNameFields(3);

    // Inicia o jogo
    startBtn.addEventListener('click', startGame);
}

function updatePlayerNameFields(numPlayers) {
    const container = document.getElementById('player-names-container');
    container.innerHTML = '';

    for (let i = 0; i < numPlayers; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        div.innerHTML = `
            <label style="color: ${PLAYER_COLORS[i].color}">Jogador ${i + 1} (${PLAYER_COLORS[i].name}):</label>
            <input type="text" id="player-name-${i}" placeholder="Nome do Jogador ${i + 1}" value="Jogador ${i + 1}">
        `;
        container.appendChild(div);
    }
}

function startGame() {
    const numPlayers = parseInt(document.getElementById('num-players').value);

    // Cria os jogadores
    GameState.players = [];
    for (let i = 0; i < numPlayers; i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        GameState.players.push({
            id: i,
            name: nameInput.value || `Jogador ${i + 1}`,
            color: PLAYER_COLORS[i].color,
            colorClass: PLAYER_COLORS[i].class,
            territories: [],
            armies: 0
        });
    }

    // Inicializa territorios
    initializeTerritories();

    // Distribui territorios
    distributeTerritories();

    // Distribui exercitos iniciais
    distributeInitialArmies();

    // Mostra tela do jogo
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    // Configura eventos
    setupGameEvents();

    // Atualiza UI
    GameState.gameStarted = true;
    GameState.currentPlayerIndex = 0;
    startTurn();
}

function initializeTerritories() {
    GameState.territories = {};
    for (const territoryId of Object.keys(TERRITORIES)) {
        GameState.territories[territoryId] = {
            owner: null,
            armies: 0
        };
    }
}

function distributeTerritories() {
    // Embaralha territorios
    const territoryIds = Object.keys(TERRITORIES);
    shuffleArray(territoryIds);

    // Distribui igualmente entre jogadores
    let playerIndex = 0;
    for (const territoryId of territoryIds) {
        const player = GameState.players[playerIndex];
        GameState.territories[territoryId].owner = player.id;
        GameState.territories[territoryId].armies = 1;
        player.territories.push(territoryId);

        playerIndex = (playerIndex + 1) % GameState.players.length;
    }

    updateMapDisplay();
}

function distributeInitialArmies() {
    // Exercitos iniciais baseado no numero de jogadores
    const initialArmies = {
        2: 40,
        3: 35,
        4: 30,
        5: 25,
        6: 20
    };

    const armiesPerPlayer = initialArmies[GameState.players.length] || 30;

    // Cada jogador ja tem 1 exercito em cada territorio
    // Distribui o restante aleatoriamente
    for (const player of GameState.players) {
        const extraArmies = armiesPerPlayer - player.territories.length;

        for (let i = 0; i < extraArmies; i++) {
            const randomTerritory = player.territories[Math.floor(Math.random() * player.territories.length)];
            GameState.territories[randomTerritory].armies++;
        }
    }

    updateMapDisplay();
}

// ===== EVENTOS DO JOGO =====
function setupGameEvents() {
    // Clique nos territorios
    document.querySelectorAll('.territory').forEach(territory => {
        territory.addEventListener('click', handleTerritoryClick);
    });

    // Botoes de controle
    document.getElementById('next-phase-btn').addEventListener('click', nextPhase);
    document.getElementById('end-turn-btn').addEventListener('click', endTurn);

    // Botoes de combate
    document.getElementById('roll-dice-btn').addEventListener('click', rollDice);
    document.getElementById('continue-attack-btn').addEventListener('click', continueAttack);
    document.getElementById('close-combat-btn').addEventListener('click', closeCombatModal);
    document.getElementById('confirm-conquest-btn').addEventListener('click', confirmConquest);

    // Botoes de fortificacao
    document.getElementById('fortify-btn').addEventListener('click', executeFortify);

    // Botao de novo jogo
    document.getElementById('new-game-btn').addEventListener('click', () => {
        location.reload();
    });
}

function handleTerritoryClick(event) {
    const territoryId = event.target.getAttribute('data-territory');
    if (!territoryId) return;

    const territory = GameState.territories[territoryId];
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    switch (GameState.phase) {
        case 'reinforce':
            handleReinforceClick(territoryId, territory, currentPlayer);
            break;
        case 'attack':
            handleAttackClick(territoryId, territory, currentPlayer);
            break;
        case 'fortify':
            handleFortifyClick(territoryId, territory, currentPlayer);
            break;
    }
}

// ===== FASE DE REFORCOS =====
function handleReinforceClick(territoryId, territory, currentPlayer) {
    if (territory.owner !== currentPlayer.id) {
        showMessage('Selecione um territorio seu!');
        return;
    }

    if (GameState.reinforcementsLeft <= 0) {
        showMessage('Voce nao tem mais reforcos!');
        return;
    }

    // Adiciona 1 exercito
    territory.armies++;
    GameState.reinforcementsLeft--;

    updateMapDisplay();
    updateUI();
    updateTerritoryInfo(territoryId);

    if (GameState.reinforcementsLeft <= 0) {
        showMessage('Reforcos distribuidos! Clique em "Proxima Fase" para atacar.');
    }
}

// ===== FASE DE ATAQUE =====
function handleAttackClick(territoryId, territory, currentPlayer) {
    // Se nao tem territorio selecionado, seleciona um proprio
    if (!GameState.selectedTerritory) {
        if (territory.owner !== currentPlayer.id) {
            showMessage('Selecione um territorio seu para atacar!');
            return;
        }

        if (territory.armies <= 1) {
            showMessage('Este territorio precisa de pelo menos 2 exercitos para atacar!');
            return;
        }

        // Verifica se tem vizinhos inimigos
        const enemyNeighbors = getEnemyNeighbors(territoryId, currentPlayer.id);
        if (enemyNeighbors.length === 0) {
            showMessage('Este territorio nao tem vizinhos inimigos!');
            return;
        }

        selectTerritory(territoryId);
        highlightAttackTargets(territoryId, currentPlayer.id);
        showAttackOptions(territory.armies);
    }
    // Se ja tem territorio selecionado
    else {
        // Clicou no mesmo territorio - deseleciona
        if (territoryId === GameState.selectedTerritory) {
            clearSelection();
            return;
        }

        // Clicou em outro territorio proprio - muda selecao
        if (territory.owner === currentPlayer.id) {
            clearSelection();
            handleAttackClick(territoryId, territory, currentPlayer);
            return;
        }

        // Clicou em territorio inimigo - verifica se e vizinho
        const neighbors = TERRITORIES[GameState.selectedTerritory].neighbors;
        if (!neighbors.includes(territoryId)) {
            showMessage('Voce so pode atacar territorios vizinhos!');
            return;
        }

        // Inicia ataque
        GameState.targetTerritory = territoryId;
        openCombatModal();
    }
}

function getEnemyNeighbors(territoryId, playerId) {
    const neighbors = TERRITORIES[territoryId].neighbors;
    return neighbors.filter(n => GameState.territories[n].owner !== playerId);
}

function highlightAttackTargets(territoryId, playerId) {
    const enemyNeighbors = getEnemyNeighbors(territoryId, playerId);

    enemyNeighbors.forEach(neighborId => {
        const element = document.getElementById(`territory-${neighborId}`);
        if (element) {
            element.classList.add('attack-target');
        }
    });
}

function showAttackOptions(armies) {
    const attackOptions = document.getElementById('attack-options');
    const attackDice = document.getElementById('attack-dice');

    // Maximo de dados = min(3, exercitos - 1)
    const maxDice = Math.min(3, armies - 1);

    attackDice.innerHTML = '';
    for (let i = 1; i <= maxDice; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Dado${i > 1 ? 's' : ''}`;
        if (i === maxDice) option.selected = true;
        attackDice.appendChild(option);
    }

    attackOptions.classList.remove('hidden');
}

// ===== FASE DE FORTIFICACAO =====
function handleFortifyClick(territoryId, territory, currentPlayer) {
    if (GameState.fortifyUsed) {
        showMessage('Voce ja fortificou neste turno!');
        return;
    }

    if (territory.owner !== currentPlayer.id) {
        showMessage('Selecione um territorio seu!');
        return;
    }

    if (!GameState.selectedTerritory) {
        // Seleciona territorio de origem
        if (territory.armies <= 1) {
            showMessage('Este territorio precisa de mais de 1 exercito para transferir!');
            return;
        }

        selectTerritory(territoryId);
        highlightFortifyTargets(territoryId, currentPlayer.id);
        showFortifyOptions(territory.armies);
    } else {
        // Clicou no mesmo - deseleciona
        if (territoryId === GameState.selectedTerritory) {
            clearSelection();
            return;
        }

        // Verifica se e vizinho proprio
        const neighbors = TERRITORIES[GameState.selectedTerritory].neighbors;
        if (!neighbors.includes(territoryId)) {
            showMessage('Voce so pode fortificar territorios vizinhos!');
            return;
        }

        if (territory.owner !== currentPlayer.id) {
            showMessage('Voce so pode fortificar seus proprios territorios!');
            return;
        }

        GameState.targetTerritory = territoryId;
        updateTerritoryInfo(territoryId);
    }
}

function highlightFortifyTargets(territoryId, playerId) {
    const neighbors = TERRITORIES[territoryId].neighbors;
    const friendlyNeighbors = neighbors.filter(n => GameState.territories[n].owner === playerId);

    friendlyNeighbors.forEach(neighborId => {
        const element = document.getElementById(`territory-${neighborId}`);
        if (element) {
            element.classList.add('fortify-target');
        }
    });
}

function showFortifyOptions(armies) {
    const fortifyOptions = document.getElementById('fortify-options');
    const fortifyAmount = document.getElementById('fortify-amount');

    fortifyAmount.max = armies - 1;
    fortifyAmount.value = 1;

    fortifyOptions.classList.remove('hidden');
}

function executeFortify() {
    if (!GameState.selectedTerritory || !GameState.targetTerritory) {
        showMessage('Selecione o territorio de origem e destino!');
        return;
    }

    const amount = parseInt(document.getElementById('fortify-amount').value);
    const sourceTerritory = GameState.territories[GameState.selectedTerritory];

    if (amount >= sourceTerritory.armies) {
        showMessage('Voce deve deixar pelo menos 1 exercito no territorio!');
        return;
    }

    // Transfere exercitos
    sourceTerritory.armies -= amount;
    GameState.territories[GameState.targetTerritory].armies += amount;

    GameState.fortifyUsed = true;
    clearSelection();
    updateMapDisplay();

    showMessage('Fortificacao realizada! Clique em "Finalizar Turno".');
}

// ===== COMBATE =====
function openCombatModal() {
    const modal = document.getElementById('combat-modal');
    const attacker = GameState.players[GameState.currentPlayerIndex];
    const attackerTerritory = GameState.territories[GameState.selectedTerritory];
    const defenderTerritory = GameState.territories[GameState.targetTerritory];
    const defender = GameState.players[defenderTerritory.owner];

    // Atualiza informacoes
    document.getElementById('attacker-name').textContent = attacker.name;
    document.getElementById('attacker-name').style.color = attacker.color;
    document.getElementById('attacker-territory').textContent = TERRITORIES[GameState.selectedTerritory].name;
    document.getElementById('attacker-armies').textContent = `Exercitos: ${attackerTerritory.armies}`;

    document.getElementById('defender-name').textContent = defender.name;
    document.getElementById('defender-name').style.color = defender.color;
    document.getElementById('defender-territory').textContent = TERRITORIES[GameState.targetTerritory].name;
    document.getElementById('defender-armies').textContent = `Exercitos: ${defenderTerritory.armies}`;

    // Limpa dados anteriores
    document.getElementById('attacker-dice').innerHTML = '';
    document.getElementById('defender-dice').innerHTML = '';
    document.getElementById('combat-result').textContent = '';
    document.getElementById('combat-result').className = '';

    // Mostra botoes corretos
    document.getElementById('roll-dice-btn').classList.remove('hidden');
    document.getElementById('continue-attack-btn').classList.add('hidden');
    document.getElementById('conquest-panel').classList.add('hidden');

    modal.classList.remove('hidden');
}

function rollDice() {
    const attackerTerritory = GameState.territories[GameState.selectedTerritory];
    const defenderTerritory = GameState.territories[GameState.targetTerritory];

    // Numero de dados
    const attackDiceCount = Math.min(
        parseInt(document.getElementById('attack-dice').value),
        attackerTerritory.armies - 1
    );
    const defendDiceCount = Math.min(2, defenderTerritory.armies);

    // Rola os dados
    const attackRolls = rollMultipleDice(attackDiceCount);
    const defendRolls = rollMultipleDice(defendDiceCount);

    // Ordena do maior para menor
    attackRolls.sort((a, b) => b - a);
    defendRolls.sort((a, b) => b - a);

    // Mostra os dados
    displayDice('attacker-dice', attackRolls, 'attacker');
    displayDice('defender-dice', defendRolls, 'defender');

    // Compara os dados
    const result = compareDice(attackRolls, defendRolls);

    // Aplica resultado
    attackerTerritory.armies -= result.attackerLosses;
    defenderTerritory.armies -= result.defenderLosses;

    // Atualiza display
    setTimeout(() => {
        document.getElementById('attacker-armies').textContent = `Exercitos: ${attackerTerritory.armies}`;
        document.getElementById('defender-armies').textContent = `Exercitos: ${defenderTerritory.armies}`;

        // Mostra resultado
        const resultText = `Atacante perdeu ${result.attackerLosses}, Defensor perdeu ${result.defenderLosses}`;
        document.getElementById('combat-result').textContent = resultText;
        document.getElementById('combat-result').className = result.defenderLosses > result.attackerLosses ? 'attacker-wins' : 'defender-wins';

        updateMapDisplay();

        // Verifica se territorio foi conquistado
        if (defenderTerritory.armies <= 0) {
            handleTerritoryConquest();
        }
        // Verifica se pode continuar atacando
        else if (attackerTerritory.armies > 1) {
            document.getElementById('continue-attack-btn').classList.remove('hidden');
        } else {
            showMessage('Voce nao tem exercitos suficientes para continuar o ataque.');
        }
    }, 600);
}

function rollMultipleDice(count) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    return rolls;
}

function displayDice(containerId, rolls, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    rolls.forEach((value, index) => {
        const dice = document.createElement('div');
        dice.className = `dice ${type}`;
        dice.textContent = value;
        dice.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(dice);
    });
}

function compareDice(attackRolls, defendRolls) {
    let attackerLosses = 0;
    let defenderLosses = 0;

    const comparisons = Math.min(attackRolls.length, defendRolls.length);

    for (let i = 0; i < comparisons; i++) {
        if (attackRolls[i] > defendRolls[i]) {
            defenderLosses++;
        } else {
            attackerLosses++; // Empate favorece o defensor
        }
    }

    return { attackerLosses, defenderLosses };
}

function handleTerritoryConquest() {
    const attackerTerritory = GameState.territories[GameState.selectedTerritory];
    const defenderTerritory = GameState.territories[GameState.targetTerritory];
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const previousOwner = GameState.players[defenderTerritory.owner];

    // Remove territorio do dono anterior
    const ownerIndex = previousOwner.territories.indexOf(GameState.targetTerritory);
    if (ownerIndex > -1) {
        previousOwner.territories.splice(ownerIndex, 1);
    }

    // Adiciona ao conquistador
    defenderTerritory.owner = currentPlayer.id;
    currentPlayer.territories.push(GameState.targetTerritory);

    GameState.hasConqueredThisTurn = true;

    // Mostra painel de conquista
    const conquestPanel = document.getElementById('conquest-panel');
    const conquestArmies = document.getElementById('conquest-armies');

    const attackDiceUsed = parseInt(document.getElementById('attack-dice').value);
    const maxMove = attackerTerritory.armies - 1;

    conquestArmies.min = attackDiceUsed;
    conquestArmies.max = maxMove;
    conquestArmies.value = attackDiceUsed;

    document.getElementById('roll-dice-btn').classList.add('hidden');
    document.getElementById('continue-attack-btn').classList.add('hidden');
    conquestPanel.classList.remove('hidden');

    // Verifica se jogador foi eliminado
    if (previousOwner.territories.length === 0) {
        showMessage(`${previousOwner.name} foi eliminado!`);
    }

    // Verifica vitoria
    if (currentPlayer.territories.length === Object.keys(TERRITORIES).length) {
        handleGameOver(currentPlayer);
    }

    updateMapDisplay();
    updatePlayersOverview();
}

function confirmConquest() {
    const amount = parseInt(document.getElementById('conquest-armies').value);
    const attackerTerritory = GameState.territories[GameState.selectedTerritory];
    const defenderTerritory = GameState.territories[GameState.targetTerritory];

    const attackDiceUsed = parseInt(document.getElementById('attack-dice').value);

    if (amount < attackDiceUsed) {
        showMessage(`Voce deve mover pelo menos ${attackDiceUsed} exercitos!`);
        return;
    }

    if (amount >= attackerTerritory.armies) {
        showMessage('Voce deve deixar pelo menos 1 exercito no territorio de origem!');
        return;
    }

    // Move exercitos
    attackerTerritory.armies -= amount;
    defenderTerritory.armies = amount;

    closeCombatModal();
    clearSelection();
    updateMapDisplay();

    showMessage('Territorio conquistado!');
}

function continueAttack() {
    // Reseta para novo ataque
    document.getElementById('roll-dice-btn').classList.remove('hidden');
    document.getElementById('continue-attack-btn').classList.add('hidden');
    document.getElementById('combat-result').textContent = '';
    document.getElementById('combat-result').className = '';
    document.getElementById('attacker-dice').innerHTML = '';
    document.getElementById('defender-dice').innerHTML = '';

    // Atualiza opcoes de dados
    const attackerTerritory = GameState.territories[GameState.selectedTerritory];
    showAttackOptions(attackerTerritory.armies);
}

function closeCombatModal() {
    document.getElementById('combat-modal').classList.add('hidden');
    clearSelection();
}

// ===== CONTROLE DE TURNO =====
function startTurn() {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    // Calcula reforcos
    GameState.reinforcementsLeft = calculateReinforcements(currentPlayer);
    GameState.phase = 'reinforce';
    GameState.hasConqueredThisTurn = false;
    GameState.fortifyUsed = false;

    clearSelection();
    updateUI();
    updatePlayersOverview();

    showMessage(`Turno de ${currentPlayer.name}. Distribua seus ${GameState.reinforcementsLeft} reforcos.`);
}

function calculateReinforcements(player) {
    // Base: territorios / 3 (minimo 3)
    let reinforcements = Math.max(3, Math.floor(player.territories.length / 3));

    // Bonus por continentes
    for (const [continentId, continent] of Object.entries(CONTINENTS)) {
        const ownsAll = continent.territories.every(t =>
            GameState.territories[t].owner === player.id
        );
        if (ownsAll) {
            reinforcements += continent.bonus;
        }
    }

    return reinforcements;
}

function nextPhase() {
    if (GameState.phase === 'reinforce') {
        if (GameState.reinforcementsLeft > 0) {
            if (!confirm(`Voce ainda tem ${GameState.reinforcementsLeft} reforcos. Deseja pular para a fase de ataque?`)) {
                return;
            }
        }
        GameState.phase = 'attack';
        showMessage('Fase de Ataque! Selecione um territorio seu para atacar.');
    } else if (GameState.phase === 'attack') {
        GameState.phase = 'fortify';
        showMessage('Fase de Fortificacao! Mova exercitos entre territorios adjacentes.');
    }

    clearSelection();
    updateUI();
}

function endTurn() {
    if (GameState.phase === 'reinforce' && GameState.reinforcementsLeft > 0) {
        showMessage('Distribua todos os reforcos antes de finalizar o turno!');
        return;
    }

    // Proximo jogador (pula eliminados)
    do {
        GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
    } while (GameState.players[GameState.currentPlayerIndex].territories.length === 0);

    startTurn();
}

// ===== UI =====
function selectTerritory(territoryId) {
    clearSelection();

    GameState.selectedTerritory = territoryId;

    const element = document.getElementById(`territory-${territoryId}`);
    if (element) {
        element.classList.add('selected');
    }

    updateTerritoryInfo(territoryId);
}

function clearSelection() {
    GameState.selectedTerritory = null;
    GameState.targetTerritory = null;

    // Remove classes de selecao
    document.querySelectorAll('.territory').forEach(t => {
        t.classList.remove('selected', 'attack-target', 'fortify-target');
    });

    // Esconde opcoes
    document.getElementById('attack-options').classList.add('hidden');
    document.getElementById('fortify-options').classList.add('hidden');

    updateTerritoryInfo(null);
}

function updateMapDisplay() {
    for (const [territoryId, territory] of Object.entries(GameState.territories)) {
        const path = document.getElementById(`territory-${territoryId}`);
        const circle = document.getElementById(`army-circle-${territoryId}`);
        const text = document.getElementById(`army-text-${territoryId}`);

        if (territory.owner !== null) {
            const player = GameState.players[territory.owner];

            // Atualiza cor do territorio
            if (path) {
                path.style.fill = player.color;
            }

            // Atualiza circulo e texto
            if (circle) {
                circle.setAttribute('fill', 'rgba(0,0,0,0.7)');
                circle.setAttribute('stroke', player.color);
            }

            if (text) {
                text.textContent = territory.armies;
            }
        }
    }
}

function updateUI() {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    // Header
    document.getElementById('current-player-name').textContent = currentPlayer.name;
    document.getElementById('current-player-name').style.backgroundColor = currentPlayer.color;

    const phaseNames = {
        reinforce: 'Reforcos',
        attack: 'Ataque',
        fortify: 'Fortificacao'
    };
    document.getElementById('current-phase').textContent = `Fase: ${phaseNames[GameState.phase]}`;
    document.getElementById('reinforcements-left').textContent = `Reforcos: ${GameState.reinforcementsLeft}`;

    // Controles de acao
    document.getElementById('reinforce-controls').classList.toggle('hidden', GameState.phase !== 'reinforce');
    document.getElementById('attack-controls').classList.toggle('hidden', GameState.phase !== 'attack');
    document.getElementById('fortify-controls').classList.toggle('hidden', GameState.phase !== 'fortify');
}

function updateTerritoryInfo(territoryId) {
    const nameEl = document.getElementById('selected-territory-name');
    const armiesEl = document.getElementById('selected-territory-armies');
    const ownerEl = document.getElementById('selected-territory-owner');

    if (!territoryId) {
        nameEl.textContent = 'Nenhum';
        armiesEl.textContent = 'Exercitos: -';
        ownerEl.textContent = 'Dono: -';
        return;
    }

    const territory = GameState.territories[territoryId];
    const territoryData = TERRITORIES[territoryId];
    const owner = GameState.players[territory.owner];

    nameEl.textContent = territoryData.name;
    armiesEl.textContent = `Exercitos: ${territory.armies}`;
    ownerEl.textContent = `Dono: ${owner.name}`;
    ownerEl.style.color = owner.color;
}

function updatePlayersOverview() {
    const list = document.getElementById('players-list');
    list.innerHTML = '';

    GameState.players.forEach((player, index) => {
        if (player.territories.length === 0) return; // Pula eliminados

        const li = document.createElement('li');
        li.className = index === GameState.currentPlayerIndex ? 'current-turn' : '';

        li.innerHTML = `
            <span>
                <span class="player-color-dot" style="background: ${player.color}"></span>
                ${player.name}
            </span>
            <span>${player.territories.length} terr.</span>
        `;

        list.appendChild(li);
    });
}

function showMessage(message) {
    // Por enquanto, usa alert simples. Pode ser melhorado com toast/notification
    console.log(message);

    // Cria uma notificacao temporaria
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(233, 69, 96, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 1rem;
            z-index: 2000;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

function handleGameOver(winner) {
    const modal = document.getElementById('game-over-modal');
    document.getElementById('winner-announcement').textContent =
        `${winner.name} conquistou o mundo e venceu o jogo!`;
    modal.classList.remove('hidden');
}

// ===== UTILIDADES =====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

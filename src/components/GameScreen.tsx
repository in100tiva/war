import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/audio';
import { GameMap } from './GameMap';
import { GameSidebar } from './GameSidebar';
import { CombatModal } from './CombatModal';
import { TERRITORIES } from '../game/territories';

export function GameScreen() {
  const { roomId, userId, selectedTerritory, setSelectedTerritory, clearSelection } = useGameStore();
  const [targetTerritory, setTargetTerritory] = useState<string | null>(null);
  const [showCombatModal, setShowCombatModal] = useState(false);

  // Queries
  const gameState = useQuery(api.game.getState, roomId ? { roomId } : 'skip');

  // Mutations
  const reinforce = useMutation(api.game.reinforce);
  const nextPhase = useMutation(api.game.nextPhase);
  const endTurn = useMutation(api.game.endTurn);
  const attack = useMutation(api.game.attack);
  const fortify = useMutation(api.game.fortify);

  const game = gameState?.game;
  const territories = gameState?.territories || [];
  const players = gameState?.players || [];
  const currentPlayer = gameState?.currentPlayer;

  const isMyTurn = currentPlayer?.userId === userId;

  // Converte territorios para formato de mapa
  const territoriesMap: Record<string, { ownerId: string | null; armies: number }> = {};
  territories.forEach((t) => {
    territoriesMap[t.territoryId] = {
      ownerId: t.ownerId || null,
      armies: t.armies,
    };
  });

  const handleTerritoryClick = useCallback(
    async (territoryId: string) => {
      if (!game || !isMyTurn) return;

      const territory = territoriesMap[territoryId];
      if (!territory) return;

      const phase = game.phase;

      // Fase de reforcos
      if (phase === 'reinforce') {
        if (territory.ownerId !== userId) {
          playSound.notification();
          return;
        }

        if (game.reinforcementsLeft <= 0) return;

        try {
          await reinforce({
            gameId: game._id,
            userId: userId!,
            territoryId,
            amount: 1,
          });
          playSound.reinforce();
        } catch (error) {
          console.error('Erro ao reforcar:', error);
        }
        return;
      }

      // Fase de ataque
      if (phase === 'attack') {
        // Se nenhum territorio selecionado, seleciona um proprio
        if (!selectedTerritory) {
          if (territory.ownerId !== userId) {
            playSound.notification();
            return;
          }

          if (territory.armies <= 1) {
            playSound.notification();
            return;
          }

          // Verifica se tem vizinhos inimigos
          const neighbors = TERRITORIES[territoryId]?.neighbors || [];
          const hasEnemyNeighbor = neighbors.some(
            (n) => territoriesMap[n]?.ownerId !== userId
          );

          if (!hasEnemyNeighbor) {
            playSound.notification();
            return;
          }

          setSelectedTerritory(territoryId);
          playSound.click();
          return;
        }

        // Se clicou no mesmo territorio, deseleciona
        if (territoryId === selectedTerritory) {
          clearSelection();
          setTargetTerritory(null);
          return;
        }

        // Se clicou em outro territorio proprio, muda selecao
        if (territory.ownerId === userId) {
          setSelectedTerritory(territoryId);
          setTargetTerritory(null);
          return;
        }

        // Verifica se e vizinho
        const neighbors = TERRITORIES[selectedTerritory]?.neighbors || [];
        if (!neighbors.includes(territoryId)) {
          playSound.notification();
          return;
        }

        // Abre modal de combate
        setTargetTerritory(territoryId);
        setShowCombatModal(true);
        return;
      }

      // Fase de fortificacao
      if (phase === 'fortify') {
        if (territory.ownerId !== userId) {
          playSound.notification();
          return;
        }

        if (!selectedTerritory) {
          if (territory.armies <= 1) {
            playSound.notification();
            return;
          }
          setSelectedTerritory(territoryId);
          playSound.click();
          return;
        }

        if (territoryId === selectedTerritory) {
          clearSelection();
          return;
        }

        // Verifica se e vizinho
        const neighbors = TERRITORIES[selectedTerritory]?.neighbors || [];
        if (!neighbors.includes(territoryId)) {
          playSound.notification();
          return;
        }

        // Executa fortificacao
        try {
          await fortify({
            gameId: game._id,
            userId: userId!,
            fromTerritoryId: selectedTerritory,
            toTerritoryId: territoryId,
            amount: 1,
          });
          playSound.click();
          clearSelection();
        } catch (error) {
          console.error('Erro ao fortificar:', error);
        }
      }
    },
    [game, isMyTurn, userId, selectedTerritory, territoriesMap, reinforce, fortify, clearSelection, setSelectedTerritory]
  );

  const handleRollDice = async (attackDice: number) => {
    if (!game || !selectedTerritory || !targetTerritory || !userId) {
      throw new Error('Estado invalido');
    }

    const result = await attack({
      gameId: game._id,
      userId: userId,
      fromTerritoryId: selectedTerritory,
      toTerritoryId: targetTerritory,
      attackDice,
    });

    playSound.attack();
    return result;
  };

  const handleCombatClose = () => {
    setShowCombatModal(false);
    clearSelection();
    setTargetTerritory(null);
  };

  const handleConquest = () => {
    setShowCombatModal(false);
    clearSelection();
    setTargetTerritory(null);
  };

  const handleNextPhase = async () => {
    if (!game || !userId) return;
    try {
      await nextPhase({ gameId: game._id, userId: userId });
      clearSelection();
      playSound.click();
    } catch (error) {
      console.error('Erro ao avancar fase:', error);
    }
  };

  const handleEndTurn = async () => {
    if (!game || !userId) return;
    try {
      await endTurn({ gameId: game._id, userId: userId });
      clearSelection();
      playSound.turnStart();
    } catch (error) {
      console.error('Erro ao finalizar turno:', error);
    }
  };

  if (!game || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Carregando jogo...</div>
      </div>
    );
  }

  const phaseNames = {
    reinforce: 'Reforcos',
    attack: 'Ataque',
    fortify: 'Fortificacao',
  };

  // Dados para o modal de combate
  const attackerTerritory = selectedTerritory ? territoriesMap[selectedTerritory] : null;
  const defenderTerritory = targetTerritory ? territoriesMap[targetTerritory] : null;
  const attackerPlayer = players.find((p) => p.userId === attackerTerritory?.ownerId);
  const defenderPlayer = players.find((p) => p.userId === defenderTerritory?.ownerId);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black/40 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="px-4 py-1 rounded-lg font-semibold"
            style={{ backgroundColor: currentPlayer.color }}
          >
            {currentPlayer.user?.name || 'Jogador'}
          </div>
          <div className="text-yellow-400 font-medium">
            Fase: {phaseNames[game.phase]}
          </div>
          {game.phase === 'reinforce' && (
            <div className="text-white/70">
              Reforcos: {game.reinforcementsLeft}
            </div>
          )}
        </div>

        {isMyTurn && (
          <div className="flex items-center gap-2">
            {game.phase !== 'fortify' && (
              <button onClick={handleNextPhase} className="btn btn-secondary">
                Proxima Fase
              </button>
            )}
            <button onClick={handleEndTurn} className="btn btn-primary">
              Finalizar Turno
            </button>
          </div>
        )}

        {!isMyTurn && (
          <div className="text-white/50">
            Aguardando {currentPlayer.user?.name}...
          </div>
        )}
      </header>

      {/* Conteudo principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mapa */}
        <main className="flex-1 bg-gradient-to-b from-blue-900/50 to-blue-950/50">
          <GameMap
            territories={territoriesMap}
            players={players.map((p) => ({
              userId: p.userId,
              color: p.color,
              colorName: p.colorName,
            }))}
            currentPlayerId={userId}
            phase={game.phase}
            onTerritoryClick={handleTerritoryClick}
          />
        </main>

        {/* Sidebar */}
        <GameSidebar
          players={players}
          currentPlayerId={currentPlayer.userId}
          selectedTerritory={selectedTerritory}
          territories={territoriesMap}
          phase={game.phase}
          reinforcementsLeft={game.reinforcementsLeft}
        />
      </div>

      {/* Modal de combate */}
      {showCombatModal && attackerPlayer && defenderPlayer && selectedTerritory && targetTerritory && (
        <CombatModal
          isOpen={showCombatModal}
          attacker={{
            name: attackerPlayer.user?.name || 'Atacante',
            color: attackerPlayer.color,
            territory: TERRITORIES[selectedTerritory]?.name || selectedTerritory,
            armies: attackerTerritory?.armies || 0,
          }}
          defender={{
            name: defenderPlayer.user?.name || 'Defensor',
            color: defenderPlayer.color,
            territory: TERRITORIES[targetTerritory]?.name || targetTerritory,
            armies: defenderTerritory?.armies || 0,
          }}
          onRollDice={handleRollDice}
          onClose={handleCombatClose}
          onConquest={handleConquest}
        />
      )}

      {/* Notificacao de vitoria */}
      {game.winnerId && (
        <div className="modal-overlay">
          <div className="modal-content text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Fim de Jogo!</h2>
            <p className="text-xl mb-6">
              {players.find((p) => p.userId === game.winnerId)?.user?.name} conquistou o mundo!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Novo Jogo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

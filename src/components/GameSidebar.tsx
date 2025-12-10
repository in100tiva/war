import { TERRITORIES, CONTINENTS } from '../game/territories';

interface Player {
  userId: string;
  color: string;
  colorName: string;
  user?: { name: string } | null;
  territoryCount: number;
  armyCount: number;
}

interface GameSidebarProps {
  players: Player[];
  currentPlayerId: string | null;
  selectedTerritory: string | null;
  territories: Record<string, { ownerId: string | null; armies: number }>;
  phase: 'reinforce' | 'attack' | 'fortify';
  reinforcementsLeft: number;
  cardCount: number;
  onOpenCards: () => void;
}

export function GameSidebar({
  players,
  currentPlayerId,
  selectedTerritory,
  territories,
  phase,
  reinforcementsLeft,
  cardCount,
  onOpenCards,
}: GameSidebarProps) {
  const selectedTerritoryData = selectedTerritory ? TERRITORIES[selectedTerritory] : null;
  const selectedTerritoryState = selectedTerritory ? territories[selectedTerritory] : null;

  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return 'Ninguem';
    const player = players.find((p) => p.userId === ownerId);
    return player?.user?.name || 'Desconhecido';
  };

  const getOwnerColor = (ownerId: string | null) => {
    if (!ownerId) return '#666';
    const player = players.find((p) => p.userId === ownerId);
    return player?.color || '#666';
  };

  return (
    <aside className="w-80 bg-black/40 border-l border-white/10 p-4 overflow-y-auto">
      {/* Territorio selecionado */}
      <div className="panel mb-4">
        <h3 className="text-rose-500 font-semibold mb-3 text-sm border-b border-rose-500/30 pb-2">
          Territorio Selecionado
        </h3>
        {selectedTerritoryData ? (
          <div className="space-y-2 text-sm">
            <p className="font-medium text-lg">{selectedTerritoryData.name}</p>
            <p className="text-white/70">
              Continente: {CONTINENTS[selectedTerritoryData.continent]?.name}
            </p>
            <p>Exercitos: <span className="font-bold">{selectedTerritoryState?.armies || 0}</span></p>
            <p>
              Dono:{' '}
              <span style={{ color: getOwnerColor(selectedTerritoryState?.ownerId || null) }}>
                {getOwnerName(selectedTerritoryState?.ownerId || null)}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-white/50 text-sm">Nenhum territorio selecionado</p>
        )}
      </div>

      {/* Instrucoes da fase */}
      <div className="panel mb-4">
        <h3 className="text-rose-500 font-semibold mb-3 text-sm border-b border-rose-500/30 pb-2">
          Acoes
        </h3>
        {phase === 'reinforce' && (
          <div className="text-sm space-y-2">
            <p className="text-white/70">
              Clique em seus territorios para adicionar reforcos.
            </p>
            <p className="text-yellow-400 font-medium">
              Reforcos disponiveis: {reinforcementsLeft}
            </p>
            <button
              onClick={onOpenCards}
              className={`
                w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all
                flex items-center justify-center gap-2
                ${cardCount >= 5
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'}
              `}
            >
              <span>🃏</span>
              <span>Cartas ({cardCount})</span>
              {cardCount >= 5 && <span className="text-xs">⚠️</span>}
            </button>
          </div>
        )}
        {phase === 'attack' && (
          <div className="text-sm space-y-2">
            <p className="text-white/70">
              1. Selecione um territorio seu (com 2+ exercitos)
            </p>
            <p className="text-white/70">
              2. Clique em um territorio inimigo vizinho para atacar
            </p>
          </div>
        )}
        {phase === 'fortify' && (
          <div className="text-sm space-y-2">
            <p className="text-white/70">
              Mova exercitos entre territorios vizinhos.
            </p>
            <p className="text-white/50 text-xs">
              (Uma vez por turno)
            </p>
          </div>
        )}
      </div>

      {/* Lista de jogadores */}
      <div className="panel mb-4">
        <h3 className="text-rose-500 font-semibold mb-3 text-sm border-b border-rose-500/30 pb-2">
          Jogadores
        </h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.userId}
              className={`flex items-center justify-between p-2 rounded ${
                player.userId === currentPlayerId ? 'bg-white/10 border-l-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-sm font-medium">
                  {player.user?.name || 'Jogador'}
                </span>
              </div>
              <div className="text-xs text-white/50">
                {player.territoryCount} terr.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus por continente */}
      <div className="panel">
        <h3 className="text-rose-500 font-semibold mb-3 text-sm border-b border-rose-500/30 pb-2">
          Bonus por Continente
        </h3>
        <div className="space-y-1 text-xs">
          {Object.entries(CONTINENTS).map(([id, continent]) => (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: continent.color }}
                />
                <span className="text-white/70">{continent.name}</span>
              </div>
              <span className="text-yellow-400">+{continent.bonus}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

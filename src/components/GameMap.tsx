import { useMemo } from 'react';
import { TERRITORIES, CONTINENTS, OCEAN_CONNECTIONS } from '../game/territories';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/audio';

interface Territory {
  ownerId: string | null;
  armies: number;
}

interface Player {
  userId: string;
  color: string;
  colorName: string;
}

interface GameMapProps {
  territories: Record<string, Territory>;
  players: Player[];
  currentPlayerId: string | null;
  phase: 'reinforce' | 'attack' | 'fortify';
  onTerritoryClick: (territoryId: string) => void;
}

export function GameMap({
  territories,
  players,
  currentPlayerId,
  phase,
  onTerritoryClick,
}: GameMapProps) {
  const {
    selectedTerritory,
    targetTerritory,
  } = useGameStore();

  // Mapa de cores por jogador
  const playerColors = useMemo(() => {
    const map: Record<string, string> = {};
    players.forEach((p) => {
      map[p.userId] = p.color;
    });
    return map;
  }, [players]);

  // Determina quais territorios podem ser alvos
  const validTargets = useMemo(() => {
    if (!selectedTerritory) return new Set<string>();

    const selectedData = TERRITORIES[selectedTerritory];
    if (!selectedData) return new Set<string>();

    const neighbors = selectedData.neighbors;

    if (phase === 'attack') {
      // Alvos de ataque: vizinhos que nao sao do jogador atual
      return new Set(
        neighbors.filter((n) => {
          const territory = territories[n];
          return territory && territory.ownerId !== currentPlayerId;
        })
      );
    } else if (phase === 'fortify') {
      // Alvos de fortificacao: vizinhos que sao do jogador atual
      return new Set(
        neighbors.filter((n) => {
          const territory = territories[n];
          return territory && territory.ownerId === currentPlayerId;
        })
      );
    }

    return new Set<string>();
  }, [selectedTerritory, phase, territories, currentPlayerId]);

  const handleClick = (territoryId: string) => {
    playSound.click();
    onTerritoryClick(territoryId);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 1000 620"
        className="w-full h-full max-h-[calc(100vh-120px)]"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Fundo do oceano */}
        <defs>
          <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1a3a5c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0d2137', stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradientes para continentes */}
          {Object.entries(CONTINENTS).map(([id, continent]) => (
            <linearGradient key={id} id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: continent.color, stopOpacity: 1 }} />
              <stop
                offset="100%"
                style={{
                  stopColor: adjustColor(continent.color, -30),
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          ))}

          {/* Filtro de brilho para selecao */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fundo */}
        <rect width="1000" height="620" fill="url(#ocean-gradient)" />

        {/* Linhas de conexao oceânicas */}
        <g className="connections" opacity={0.3}>
          {OCEAN_CONNECTIONS.map(([from, to]) => {
            const t1 = TERRITORIES[from];
            const t2 = TERRITORIES[to];
            if (!t1 || !t2) return null;

            return (
              <line
                key={`${from}-${to}`}
                x1={t1.center.x}
                y1={t1.center.y}
                x2={t2.center.x}
                y2={t2.center.y}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
            );
          })}
        </g>

        {/* Territorios */}
        <g id="territories">
          {Object.entries(TERRITORIES).map(([id, territory]) => {
            const state = territories[id];
            const ownerColor = state?.ownerId ? playerColors[state.ownerId] : '#666';
            const isSelected = selectedTerritory === id;
            const isTarget = targetTerritory === id;
            const isValidTarget = validTargets.has(id);

            let strokeColor = '#1a1a2e';
            let strokeWidth = 2;
            let filter = '';

            if (isSelected) {
              strokeColor = '#ffd700';
              strokeWidth = 4;
              filter = 'url(#glow)';
            } else if (isTarget) {
              strokeColor = phase === 'attack' ? '#e74c3c' : '#2ecc71';
              strokeWidth = 4;
            } else if (isValidTarget) {
              strokeColor = phase === 'attack' ? '#e74c3c' : '#2ecc71';
              strokeWidth = 3;
            }

            return (
              <g key={id}>
                <path
                  d={territory.path}
                  fill={ownerColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={filter}
                  className={`
                    cursor-pointer transition-all duration-200
                    hover:brightness-125 hover:stroke-white hover:stroke-[3]
                    ${isValidTarget ? 'animate-pulse' : ''}
                  `}
                  onClick={() => handleClick(id)}
                >
                  <title>{territory.name}</title>
                </path>
              </g>
            );
          })}
        </g>

        {/* Exercitos */}
        <g id="armies">
          {Object.entries(TERRITORIES).map(([id, territory]) => {
            const state = territories[id];
            if (!state) return null;

            return (
              <g key={`army-${id}`}>
                {/* Circulo de fundo */}
                <circle
                  cx={territory.center.x}
                  cy={territory.center.y}
                  r={16}
                  fill="rgba(0,0,0,0.8)"
                  stroke={state.ownerId ? playerColors[state.ownerId] : '#666'}
                  strokeWidth={2}
                  className="pointer-events-none"
                />

                {/* Numero de exercitos */}
                <text
                  x={territory.center.x}
                  y={territory.center.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {state.armies}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// Funcao auxiliar para ajustar cor
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

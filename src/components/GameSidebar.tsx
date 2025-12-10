import { TERRITORIES, CONTINENTS } from '../game/territories';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  MapPin,
  Users,
  Globe,
  Layers,
  Crown,
  Target,
  Shield as ShieldIcon,
  Swords
} from 'lucide-react';

interface Player {
  userId: string;
  color: string;
  colorName: string;
  user?: { name: string; isAI?: boolean } | null;
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
    if (!ownerId) return 'Sem dono';
    const player = players.find((p) => p.userId === ownerId);
    return player?.user?.name || 'Desconhecido';
  };

  const getOwnerColor = (ownerId: string | null) => {
    if (!ownerId) return '#666';
    const player = players.find((p) => p.userId === ownerId);
    return player?.color || '#666';
  };

  const totalTerritories = Object.keys(TERRITORIES).length;
  const sortedPlayers = [...players].sort((a, b) => b.territoryCount - a.territoryCount);

  return (
    <aside className="w-80 bg-black/40 backdrop-blur-sm border-l border-white/10 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Territory Info */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                Territorio Selecionado
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              {selectedTerritoryData ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg text-white">{selectedTerritoryData.name}</p>
                    <p className="text-white/50 text-xs flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {CONTINENTS[selectedTerritoryData.continent]?.name}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-white">{selectedTerritoryState?.armies || 0}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide">Exercitos</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div
                        className="w-4 h-4 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: getOwnerColor(selectedTerritoryState?.ownerId || null) }}
                      />
                      <p className="text-xs text-white/70 truncate">
                        {getOwnerName(selectedTerritoryState?.ownerId || null)}
                      </p>
                    </div>
                  </div>

                  {/* Neighbors */}
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wide mb-2">Vizinhos</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTerritoryData.neighbors.slice(0, 6).map((neighborId) => {
                        const neighbor = territories[neighborId];
                        const isEnemy = neighbor?.ownerId !== selectedTerritoryState?.ownerId;
                        return (
                          <Badge
                            key={neighborId}
                            variant={isEnemy ? "destructive" : "secondary"}
                            className="text-[10px]"
                          >
                            {TERRITORIES[neighborId]?.name.substring(0, 10) || neighborId}
                          </Badge>
                        );
                      })}
                      {selectedTerritoryData.neighbors.length > 6 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{selectedTerritoryData.neighbors.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Target className="h-8 w-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">Nenhum territorio selecionado</p>
                  <p className="text-white/30 text-xs mt-1">Clique em um territorio no mapa</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phase Instructions */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {phase === 'reinforce' && <ShieldIcon className="h-4 w-4 text-green-400" />}
                {phase === 'attack' && <Swords className="h-4 w-4 text-red-400" />}
                {phase === 'fortify' && <Layers className="h-4 w-4 text-blue-400" />}
                Acoes Disponiveis
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              {phase === 'reinforce' && (
                <div className="space-y-3">
                  <p className="text-white/70 text-sm">
                    Clique em seus territorios para adicionar reforcos.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 text-sm font-medium">Reforcos Disponiveis</span>
                      <Badge variant="warning" className="text-lg px-3">{reinforcementsLeft}</Badge>
                    </div>
                    <Progress
                      value={reinforcementsLeft > 0 ? 100 : 0}
                      className="h-1"
                      indicatorClassName="bg-yellow-500"
                    />
                  </div>
                  <Button
                    onClick={onOpenCards}
                    variant={cardCount >= 5 ? "default" : "outline"}
                    className={cn(
                      "w-full justify-between",
                      cardCount >= 5 && "animate-pulse"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Ver Cartas
                    </span>
                    <Badge variant={cardCount >= 5 ? "warning" : "secondary"}>
                      {cardCount}
                    </Badge>
                  </Button>
                  {cardCount >= 5 && (
                    <p className="text-yellow-400 text-xs text-center">
                      Voce deve trocar cartas antes de continuar!
                    </p>
                  )}
                </div>
              )}
              {phase === 'attack' && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0">1</Badge>
                    <p className="text-white/70">Selecione um territorio seu (2+ exercitos)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0">2</Badge>
                    <p className="text-white/70">Clique em um territorio inimigo vizinho</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0">3</Badge>
                    <p className="text-white/70">Role os dados para atacar!</p>
                  </div>
                </div>
              )}
              {phase === 'fortify' && (
                <div className="space-y-2 text-sm">
                  <p className="text-white/70">
                    Mova exercitos entre territorios vizinhos que voce controla.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                    <p className="text-blue-400 text-xs">Uma movimentacao por turno</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Players */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-400" />
                Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-2">
              <TooltipProvider>
                {sortedPlayers.map((player, index) => {
                  const isCurrentTurn = player.userId === currentPlayerId;
                  const territoryPercent = (player.territoryCount / totalTerritories) * 100;

                  return (
                    <Tooltip key={player.userId}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-all cursor-default",
                            isCurrentTurn && "bg-white/10 ring-1 ring-yellow-400/50"
                          )}
                        >
                          <div className="relative">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                              style={{ backgroundColor: player.color }}
                            >
                              {player.user?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            {index === 0 && (
                              <Crown className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400" />
                            )}
                            {isCurrentTurn && (
                              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-white truncate">
                                {player.user?.name || 'Jogador'}
                              </span>
                              {player.user?.isAI && (
                                <Badge variant="secondary" className="text-[8px] py-0">IA</Badge>
                              )}
                            </div>
                            <Progress
                              value={territoryPercent}
                              className="h-1 mt-1"
                            />
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{player.territoryCount}</p>
                            <p className="text-[10px] text-white/40">terr.</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="space-y-1">
                          <p className="font-medium">{player.user?.name || 'Jogador'}</p>
                          <p className="text-white/70 text-xs">{player.territoryCount} territorios</p>
                          <p className="text-white/70 text-xs">{player.armyCount} exercitos total</p>
                          <p className="text-white/70 text-xs">{territoryPercent.toFixed(1)}% do mapa</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </CardContent>
          </Card>

          {/* Continent Bonuses */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-rose-400" />
                Bonus por Continente
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-2">
                {Object.entries(CONTINENTS).map(([id, continent]) => {
                  // Check if any player owns all territories
                  const continentTerritories = Object.entries(TERRITORIES)
                    .filter(([, t]) => t.continent === id)
                    .map(([tid]) => tid);

                  const ownerCounts: Record<string, number> = {};
                  continentTerritories.forEach((tid) => {
                    const owner = territories[tid]?.ownerId;
                    if (owner) {
                      ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
                    }
                  });

                  const dominantOwner = Object.entries(ownerCounts).find(
                    ([, count]) => count === continentTerritories.length
                  )?.[0];

                  const dominantPlayer = dominantOwner
                    ? players.find((p) => p.userId === dominantOwner)
                    : null;

                  return (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg transition-all",
                        dominantPlayer && "bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: continent.color }}
                        />
                        <span className="text-white/70 text-sm">{continent.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dominantPlayer && (
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: dominantPlayer.color }}
                            title={`Controlado por ${dominantPlayer.user?.name}`}
                          />
                        )}
                        <Badge variant="warning" className="text-xs">+{continent.bonus}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}

import { Shield, Swords, ArrowRightLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface TurnIndicatorProps {
  currentPlayer: {
    name: string;
    color: string;
    isAI?: boolean;
  };
  phase: 'reinforce' | 'attack' | 'fortify';
  isMyTurn: boolean;
  reinforcementsLeft: number;
  aiThinking?: boolean;
  onNextPhase: () => void;
  onEndTurn: () => void;
}

const phases = [
  { id: 'reinforce', name: 'Reforcos', icon: Shield, description: 'Adicione exercitos aos seus territorios' },
  { id: 'attack', name: 'Ataque', icon: Swords, description: 'Ataque territorios inimigos' },
  { id: 'fortify', name: 'Fortificar', icon: ArrowRightLeft, description: 'Mova exercitos entre territorios' },
] as const;

export function TurnIndicator({
  currentPlayer,
  phase,
  isMyTurn,
  reinforcementsLeft,
  aiThinking,
  onNextPhase,
  onEndTurn,
}: TurnIndicatorProps) {
  const currentPhaseIndex = phases.findIndex((p) => p.id === phase);

  return (
    <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Current Player Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all",
              isMyTurn ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900" : ""
            )}
            style={{ backgroundColor: currentPlayer.color }}
          >
            {isMyTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
              </span>
            )}
            <span className="text-white drop-shadow-md">{currentPlayer.name}</span>
            {currentPlayer.isAI && (
              <Badge variant="secondary" className="text-[10px] py-0">IA</Badge>
            )}
          </div>

          {isMyTurn ? (
            <Badge variant="warning" className="animate-pulse">
              Sua vez!
            </Badge>
          ) : aiThinking ? (
            <Badge variant="secondary" className="gap-1">
              <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></div>
              Pensando...
            </Badge>
          ) : (
            <Badge variant="outline">Aguardando...</Badge>
          )}
        </div>

        {/* Phase Indicator */}
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {phases.map((p, index) => {
              const Icon = p.icon;
              const isActive = p.id === phase;
              const isCompleted = index < currentPhaseIndex;
              const isAvailable = isMyTurn && index >= currentPhaseIndex;

              return (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                        isActive && "bg-rose-500/20 border border-rose-500 text-rose-400",
                        isCompleted && "bg-green-500/20 border border-green-500/50 text-green-400",
                        !isActive && !isCompleted && "bg-white/5 border border-white/10 text-white/40",
                        isAvailable && !isActive && "hover:bg-white/10 hover:text-white/70 cursor-pointer",
                        !isAvailable && "cursor-default"
                      )}
                      onClick={() => {
                        if (isAvailable && !isActive && index > currentPhaseIndex) {
                          onNextPhase();
                        }
                      }}
                      disabled={!isAvailable || isActive}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium hidden sm:inline">{p.name}</span>
                      {isActive && p.id === 'reinforce' && reinforcementsLeft > 0 && (
                        <Badge variant="warning" className="ml-1 text-[10px] py-0">
                          {reinforcementsLeft}
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-white/70 text-xs">{p.description}</p>
                    {isCompleted && <p className="text-green-400 text-xs mt-1">Concluida</p>}
                    {isActive && <p className="text-rose-400 text-xs mt-1">Fase atual</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Action Buttons */}
        {isMyTurn && (
          <div className="flex items-center gap-2">
            {phase !== 'fortify' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPhase}
                className="gap-1"
              >
                Proxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={onEndTurn}
            >
              Finalizar Turno
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

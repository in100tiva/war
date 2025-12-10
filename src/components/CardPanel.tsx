import { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { playSound } from '../lib/audio';

interface CardPanelProps {
  gameId: Id<'games'>;
  userId: Id<'users'>;
  isMyTurn: boolean;
  phase: 'reinforce' | 'attack' | 'fortify';
  onClose: () => void;
}

interface Card {
  _id: Id<'cards'>;
  territoryId: string;
  symbol: string;
  territoryName: string;
}

const SYMBOL_ICONS: Record<string, string> = {
  soldier: '🪖',
  cavalry: '🐴',
  cannon: '💣',
  joker: '🃏',
};

const SYMBOL_NAMES: Record<string, string> = {
  soldier: 'Soldado',
  cavalry: 'Cavalaria',
  cannon: 'Canhão',
  joker: 'Coringa',
};

export function CardPanel({ gameId, userId, isMyTurn, phase, onClose }: CardPanelProps) {
  const cards = useQuery(api.game.getPlayerCards, { gameId, userId }) || [];
  const tradeCards = useMutation(api.game.tradeCards);
  const [selectedCards, setSelectedCards] = useState<Set<Id<'cards'>>>(new Set());
  const [isTrading, setIsTrading] = useState(false);
  const [tradeResult, setTradeResult] = useState<{ bonus: number; territorryBonus: number; totalBonus: number } | null>(null);

  const canTrade = isMyTurn && phase === 'reinforce' && selectedCards.size === 3;
  const mustTrade = cards.length >= 5;

  // Verifica se a combinação selecionada é válida
  const isValidCombination = useMemo(() => {
    if (selectedCards.size !== 3) return false;

    const selectedSymbols = cards
      .filter((c) => selectedCards.has(c._id))
      .map((c) => c.symbol);

    const counts: Record<string, number> = {};
    let jokers = 0;

    for (const symbol of selectedSymbols) {
      if (symbol === 'joker') {
        jokers++;
      } else {
        counts[symbol] = (counts[symbol] || 0) + 1;
      }
    }

    // 3 iguais
    if (Object.values(counts).some((c) => c + jokers >= 3)) return true;

    // 3 diferentes
    const uniqueSymbols = Object.keys(counts);
    if (uniqueSymbols.length === 3) return true;

    // 2 diferentes + 1 coringa
    if (uniqueSymbols.length === 2 && jokers >= 1) return true;

    // 1 + 2 coringas
    if (uniqueSymbols.length === 1 && jokers >= 2) return true;

    return false;
  }, [selectedCards, cards]);

  const toggleCard = (cardId: Id<'cards'>) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else if (newSelected.size < 3) {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
    playSound.click();
  };

  const handleTrade = async () => {
    if (!canTrade || !isValidCombination) return;

    setIsTrading(true);
    try {
      const result = await tradeCards({
        gameId,
        userId,
        cardIds: Array.from(selectedCards),
      });
      setTradeResult(result);
      setSelectedCards(new Set());
      playSound.reinforce();
    } catch (error) {
      console.error('Erro ao trocar cartas:', error);
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Suas Cartas</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {mustTrade && (
          <div className="bg-yellow-600/30 border border-yellow-500 rounded p-3 mb-4">
            <p className="text-yellow-200 font-semibold">
              Você tem 5 ou mais cartas! Deve trocar antes de continuar.
            </p>
          </div>
        )}

        {tradeResult && (
          <div className="bg-green-600/30 border border-green-500 rounded p-3 mb-4">
            <p className="text-green-200 font-semibold">
              Troca realizada! +{tradeResult.totalBonus} reforços
              {tradeResult.territorryBonus > 0 && (
                <span className="text-green-300 text-sm ml-2">
                  (incluindo +{tradeResult.territorryBonus} por territórios)
                </span>
              )}
            </p>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">Você não tem cartas.</p>
            <p className="text-gray-500 text-sm mt-2">
              Conquiste territórios para ganhar cartas!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {cards.map((card: Card) => (
                <button
                  key={card._id}
                  onClick={() => toggleCard(card._id)}
                  disabled={!isMyTurn || phase !== 'reinforce'}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selectedCards.has(card._id)
                      ? 'border-yellow-400 bg-yellow-900/40 scale-105'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }
                    ${(!isMyTurn || phase !== 'reinforce') ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-4xl mb-2">{SYMBOL_ICONS[card.symbol]}</div>
                  <div className="text-white font-semibold text-sm">
                    {SYMBOL_NAMES[card.symbol]}
                  </div>
                  <div className="text-gray-400 text-xs mt-1 truncate">
                    {card.territoryName}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">
                    Selecionadas: {selectedCards.size}/3
                  </p>
                  {selectedCards.size === 3 && (
                    <p className={`text-sm ${isValidCombination ? 'text-green-400' : 'text-red-400'}`}>
                      {isValidCombination ? '✓ Combinação válida' : '✗ Combinação inválida'}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleTrade}
                  disabled={!canTrade || !isValidCombination || isTrading}
                  className={`
                    px-6 py-2 rounded-lg font-semibold transition-all
                    ${canTrade && isValidCombination
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isTrading ? 'Trocando...' : 'Trocar Cartas'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-gray-400 text-sm">
              <p className="font-semibold mb-1">Combinações válidas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>3 cartas iguais (🪖🪖🪖 ou 🐴🐴🐴 ou 💣💣💣)</li>
                <li>3 cartas diferentes (🪖🐴💣)</li>
                <li>2 cartas + 1 coringa (🪖🐴🃏)</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

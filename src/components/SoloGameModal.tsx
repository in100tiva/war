import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/audio';

interface SoloGameModalProps {
  isOpen: boolean;
  playerName: string;
  onClose: () => void;
}

export function SoloGameModal({ isOpen, playerName, onClose }: SoloGameModalProps) {
  const [aiCount, setAiCount] = useState(2);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const { setScreen, setRoom, setUser, visitorId, setAIConfig } = useGameStore();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const createSoloGame = useMutation(api.rooms.createSoloGame);

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setError('Digite seu nome primeiro');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Cria/busca usuario
      const userId = await getOrCreateUser({ name: playerName.trim(), visitorId });
      setUser(userId, playerName.trim());

      // Cria sala solo com IA
      const { roomId, code, aiPlayerIds, difficulty: aiDifficulty } = await createSoloGame({
        userId,
        aiCount,
        difficulty,
      });

      setRoom(roomId, code);
      setAIConfig(aiPlayerIds, aiDifficulty);

      playSound.click();
      setScreen('lobby');
    } catch (err) {
      setError('Erro ao criar jogo. Tente novamente.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  const difficultyInfo = {
    easy: {
      name: 'Facil',
      description: 'IA cautelosa, ataca apenas com vantagem clara',
      color: 'text-green-400',
    },
    medium: {
      name: 'Medio',
      description: 'IA equilibrada, ataca e defende estrategicamente',
      color: 'text-yellow-400',
    },
    hard: {
      name: 'Dificil',
      description: 'IA agressiva, maximiza territorios e bonus',
      color: 'text-red-400',
    },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Jogo Solo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Numero de IAs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Numero de Oponentes
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setAiCount(num)}
                className={`
                  flex-1 py-3 rounded-lg font-bold transition-all
                  ${aiCount === num
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Total de jogadores: {aiCount + 1} (voce + {aiCount} IA{aiCount > 1 ? 's' : ''})
          </p>
        </div>

        {/* Dificuldade */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Dificuldade
          </label>
          <div className="space-y-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`
                  w-full p-3 rounded-lg text-left transition-all
                  ${difficulty === diff
                    ? 'bg-rose-600/30 border-2 border-rose-500'
                    : 'bg-gray-700 border-2 border-transparent hover:border-gray-500'
                  }
                `}
              >
                <div className={`font-bold ${difficultyInfo[diff].color}`}>
                  {difficultyInfo[diff].name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {difficultyInfo[diff].description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Botoes */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 btn btn-primary"
          >
            {isCreating ? 'Criando...' : 'Iniciar Jogo'}
          </button>
        </div>
      </div>
    </div>
  );
}

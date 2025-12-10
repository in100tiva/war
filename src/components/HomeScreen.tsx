import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/audio';
import { SoloGameModal } from './SoloGameModal';

export function HomeScreen() {
  const [name, setName] = useState(useGameStore.getState().userName || '');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [showSoloModal, setShowSoloModal] = useState(false);

  const { setScreen, setRoom, setUser, visitorId } = useGameStore();

  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const createRoom = useMutation(api.rooms.create);
  const joinRoom = useMutation(api.rooms.join);

  const handleCreateGame = async () => {
    if (!name.trim()) {
      setError('Digite seu nome');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Cria/busca usuario
      const userId = await getOrCreateUser({ name: name.trim(), visitorId });
      setUser(userId, name.trim());

      // Cria sala
      const { roomId, code } = await createRoom({ hostId: userId });
      setRoom(roomId, code);

      playSound.click();
      setScreen('lobby');
    } catch (err) {
      setError('Erro ao criar sala. Tente novamente.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = async () => {
    if (!name.trim()) {
      setError('Digite seu nome');
      return;
    }

    if (!roomCode.trim()) {
      setError('Digite o codigo da sala');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Cria/busca usuario
      const userId = await getOrCreateUser({ name: name.trim(), visitorId });
      setUser(userId, name.trim());

      // Entra na sala
      const { roomId } = await joinRoom({
        code: roomCode.trim().toUpperCase(),
        userId: userId,
      });

      setRoom(roomId, roomCode.trim().toUpperCase());

      playSound.click();
      setScreen('lobby');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao entrar na sala';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  // Modo solo contra IA
  const handleSoloGame = () => {
    if (!name.trim()) {
      setError('Digite seu nome primeiro');
      return;
    }
    playSound.click();
    setShowSoloModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold text-rose-500 tracking-wider mb-2"
          style={{ textShadow: '0 0 30px rgba(233, 69, 96, 0.5)' }}>
          WAR
        </h1>
        <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
          Jogo de Estrategia
        </p>
      </div>

      {/* Card principal */}
      <div className="glass rounded-2xl p-6 md:p-8 w-full max-w-md animate-fade-in">
        {/* Nome do jogador */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white/80">
            Seu Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="input"
            maxLength={20}
          />
        </div>

        {/* Botoes de acao */}
        <div className="space-y-4">
          <button
            onClick={handleCreateGame}
            disabled={isCreating}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {isCreating ? 'Criando...' : 'Criar Nova Sala'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/50">ou</span>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Codigo da sala"
              className="input flex-1"
              maxLength={6}
            />
            <button
              onClick={handleJoinGame}
              disabled={isJoining}
              className="btn btn-secondary whitespace-nowrap"
            >
              {isJoining ? '...' : 'Entrar'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/50">ou</span>
            </div>
          </div>

          <button
            onClick={handleSoloGame}
            className="btn btn-secondary w-full"
          >
            Jogar contra IA
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm animate-shake">
            {error}
          </div>
        )}
      </div>

      {/* Rodape */}
      <div className="mt-8 text-center text-white/40 text-sm">
        <p>Conquiste territorios. Domine o mundo.</p>
      </div>

      {/* Modal de jogo solo */}
      <SoloGameModal
        isOpen={showSoloModal}
        playerName={name}
        onClose={() => setShowSoloModal(false)}
      />
    </div>
  );
}

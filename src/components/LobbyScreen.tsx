import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/audio';

export function LobbyScreen() {
  const { roomId, roomCode, userId, setScreen, setRoom } = useGameStore();

  const room = useQuery(api.rooms.get, roomId ? { roomId } : 'skip');
  const players = useQuery(api.rooms.getPlayers, roomId ? { roomId } : 'skip');

  const setReady = useMutation(api.rooms.setReady);
  const leaveRoom = useMutation(api.rooms.leave);
  const startGame = useMutation(api.game.start);

  const currentPlayer = players?.find((p) => p.userId === userId);
  const isHost = room?.hostId === userId;
  const allReady = players?.every((p) => p.isReady || p.userId === room?.hostId);
  const canStart = isHost && (players?.length ?? 0) >= 2 && allReady;

  const handleToggleReady = async () => {
    if (!currentPlayer) return;
    playSound.click();
    await setReady({ playerId: currentPlayer._id, isReady: !currentPlayer.isReady });
  };

  const handleLeave = async () => {
    if (!roomId || !userId) return;
    playSound.click();
    await leaveRoom({ roomId, userId: userId });
    setRoom(null, null);
    setScreen('home');
  };

  const handleStartGame = async () => {
    if (!roomId || !userId) return;
    playSound.click();
    await startGame({ roomId, hostId: userId });
    setScreen('game');
  };

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      playSound.click();
    }
  };

  if (!room || !players) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-2xl p-6 md:p-8 w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Sala de Espera</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-mono font-bold text-rose-400 tracking-widest">
              {roomCode}
            </span>
            <button
              onClick={copyRoomCode}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Copiar codigo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Compartilhe este codigo para convidar jogadores
          </p>
        </div>

        {/* Lista de jogadores */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/70 mb-3">
            Jogadores ({players.length}/6)
          </h3>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player._id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-medium">
                    {player.user?.name || 'Jogador'}
                  </span>
                  {player.userId === room.hostId && (
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                      Host
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {player.userId === room.hostId ? (
                    <span className="text-xs text-white/50">-</span>
                  ) : player.isReady ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      Pronto
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50">
                      Aguardando
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Slots vazios */}
            {Array.from({ length: 6 - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center p-3 rounded-lg bg-black/20 border border-dashed border-white/10"
              >
                <span className="text-white/30 text-sm">Vago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acoes */}
        <div className="space-y-3">
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              className="btn btn-primary w-full py-3"
            >
              {players.length < 2
                ? 'Aguardando jogadores...'
                : !allReady
                  ? 'Aguardando jogadores prontos...'
                  : 'Iniciar Jogo'}
            </button>
          ) : (
            <button
              onClick={handleToggleReady}
              className={`btn w-full py-3 ${
                currentPlayer?.isReady ? 'btn-secondary' : 'btn-primary'
              }`}
            >
              {currentPlayer?.isReady ? 'Cancelar' : 'Estou Pronto!'}
            </button>
          )}

          <button onClick={handleLeave} className="btn btn-secondary w-full">
            Sair da Sala
          </button>
        </div>

        {/* Configuracoes (apenas host) */}
        {isHost && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/70 mb-3">Configuracoes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Modo de Jogo</span>
                <select className="input w-auto py-1 px-3">
                  <option value="domination">Dominacao</option>
                  <option value="objectives">Objetivos</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

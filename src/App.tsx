import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useGameStore } from './stores/gameStore';
import { audio } from './lib/audio';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';

function App() {
  const { screen, roomId, setScreen } = useGameStore();

  // Verifica status da sala para redirecionar automaticamente
  const room = useQuery(api.rooms.get, roomId ? { roomId } : 'skip');

  // Inicializa audio apos primeira interacao
  useEffect(() => {
    const handleFirstInteraction = () => {
      audio.init();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Redireciona baseado no status da sala
  useEffect(() => {
    if (room) {
      if (room.status === 'playing' && screen === 'lobby') {
        setScreen('game');
      } else if (room.status === 'finished') {
        // Pode mostrar tela de resultados ou voltar ao home
      }
    }
  }, [room, screen, setScreen]);

  // Notificacao global
  const notification = useGameStore((s) => s.notification);

  return (
    <>
      {screen === 'home' && <HomeScreen />}
      {screen === 'lobby' && <LobbyScreen />}
      {screen === 'game' && <GameScreen />}

      {/* Notificacao */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </>
  );
}

export default App;

import { create } from 'zustand';
import type { Id } from '../../convex/_generated/dataModel';

export type GameScreen = 'home' | 'lobby' | 'game';
export type GamePhase = 'reinforce' | 'attack' | 'fortify';

interface GameStore {
  // Usuario
  userId: Id<'users'> | null;
  userName: string;
  visitorId: string;

  // Navegacao
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // Sala
  roomId: Id<'gameRooms'> | null;
  roomCode: string | null;
  setRoom: (roomId: Id<'gameRooms'> | null, code: string | null) => void;

  // IA
  aiPlayerIds: string[];
  aiDifficulty: 'easy' | 'medium' | 'hard' | null;
  isSoloGame: boolean;
  setAIConfig: (aiPlayerIds: string[], difficulty: 'easy' | 'medium' | 'hard') => void;
  clearAIConfig: () => void;

  // Jogo
  selectedTerritory: string | null;
  targetTerritory: string | null;
  setSelectedTerritory: (id: string | null) => void;
  setTargetTerritory: (id: string | null) => void;
  clearSelection: () => void;

  // UI
  showCombatModal: boolean;
  setShowCombatModal: (show: boolean) => void;
  notification: string | null;
  showNotification: (message: string) => void;

  // Audio
  soundEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;

  // Inicializacao
  setUser: (userId: Id<'users'>, name: string) => void;
  initVisitorId: () => void;
}

// Gera um ID unico para visitante
function generateVisitorId(): string {
  const stored = localStorage.getItem('war_visitor_id');
  if (stored) return stored;

  const newId = 'visitor_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('war_visitor_id', newId);
  return newId;
}

export const useGameStore = create<GameStore>((set) => ({
  // Usuario
  userId: null,
  userName: localStorage.getItem('war_user_name') || '',
  visitorId: generateVisitorId(),

  // Navegacao
  screen: 'home',
  setScreen: (screen) => set({ screen }),

  // Sala
  roomId: null,
  roomCode: null,
  setRoom: (roomId, roomCode) => set({ roomId, roomCode }),

  // IA
  aiPlayerIds: [],
  aiDifficulty: null,
  isSoloGame: false,
  setAIConfig: (aiPlayerIds, difficulty) => set({
    aiPlayerIds,
    aiDifficulty: difficulty,
    isSoloGame: true,
  }),
  clearAIConfig: () => set({
    aiPlayerIds: [],
    aiDifficulty: null,
    isSoloGame: false,
  }),

  // Jogo
  selectedTerritory: null,
  targetTerritory: null,
  setSelectedTerritory: (id) => set({ selectedTerritory: id }),
  setTargetTerritory: (id) => set({ targetTerritory: id }),
  clearSelection: () => set({ selectedTerritory: null, targetTerritory: null }),

  // UI
  showCombatModal: false,
  setShowCombatModal: (show) => set({ showCombatModal: show }),
  notification: null,
  showNotification: (message) => {
    set({ notification: message });
    setTimeout(() => set({ notification: null }), 3000);
  },

  // Audio
  soundEnabled: localStorage.getItem('war_sound') !== 'false',
  musicEnabled: localStorage.getItem('war_music') !== 'false',
  toggleSound: () =>
    set((state) => {
      const newValue = !state.soundEnabled;
      localStorage.setItem('war_sound', String(newValue));
      return { soundEnabled: newValue };
    }),
  toggleMusic: () =>
    set((state) => {
      const newValue = !state.musicEnabled;
      localStorage.setItem('war_music', String(newValue));
      return { musicEnabled: newValue };
    }),

  // Inicializacao
  setUser: (userId, name) => {
    localStorage.setItem('war_user_name', name);
    set({ userId, userName: name });
  },
  initVisitorId: () => set({ visitorId: generateVisitorId() }),
}));

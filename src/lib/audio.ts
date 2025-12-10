import { Howl, Howler } from 'howler';

// Sons do jogo
// Por enquanto usamos placeholders - substitua pelos arquivos reais
const SOUND_PATHS = {
  click: '/sounds/click.mp3',
  diceRoll: '/sounds/dice-roll.mp3',
  attack: '/sounds/attack.mp3',
  victory: '/sounds/victory.mp3',
  defeat: '/sounds/defeat.mp3',
  reinforce: '/sounds/reinforce.mp3',
  conquest: '/sounds/conquest.mp3',
  turnStart: '/sounds/turn-start.mp3',
  buttonHover: '/sounds/button-hover.mp3',
  notification: '/sounds/notification.mp3',
};

type SoundName = keyof typeof SOUND_PATHS;

class AudioManager {
  private sounds: Map<SoundName, Howl> = new Map();
  private music: Howl | null = null;
  private soundEnabled = true;
  private musicEnabled = true;
  private initialized = false;

  // Inicializa os sons (chame apos interacao do usuario)
  init() {
    if (this.initialized) return;

    // Pre-carrega sons mais usados
    // Nota: Os arquivos de som precisam existir em /public/sounds/
    // Por enquanto, o sistema funciona silenciosamente se nao encontrar os arquivos

    this.initialized = true;
  }

  // Carrega um som sob demanda
  private loadSound(name: SoundName): Howl | null {
    if (this.sounds.has(name)) {
      return this.sounds.get(name)!;
    }

    try {
      const sound = new Howl({
        src: [SOUND_PATHS[name]],
        volume: 0.5,
        preload: true,
        onloaderror: () => {
          console.warn(`Som nao encontrado: ${name}`);
        },
      });

      this.sounds.set(name, sound);
      return sound;
    } catch {
      console.warn(`Erro ao carregar som: ${name}`);
      return null;
    }
  }

  // Toca um som
  play(name: SoundName) {
    if (!this.soundEnabled) return;

    const sound = this.loadSound(name);
    if (sound) {
      sound.play();
    }
  }

  // Toca musica de fundo
  playMusic(path: string, loop = true) {
    if (!this.musicEnabled) return;

    if (this.music) {
      this.music.stop();
    }

    this.music = new Howl({
      src: [path],
      volume: 0.3,
      loop,
      onloaderror: () => {
        console.warn('Musica nao encontrada:', path);
      },
    });

    this.music.play();
  }

  // Para a musica
  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }

  // Habilita/desabilita sons
  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  // Habilita/desabilita musica
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.music) {
      this.music.stop();
    }
  }

  // Volume global
  setVolume(volume: number) {
    Howler.volume(volume);
  }

  // Para todos os sons
  stopAll() {
    Howler.stop();
  }
}

// Singleton
export const audio = new AudioManager();

// Sons pre-definidos para facilitar o uso
export const playSound = {
  click: () => audio.play('click'),
  diceRoll: () => audio.play('diceRoll'),
  attack: () => audio.play('attack'),
  victory: () => audio.play('victory'),
  defeat: () => audio.play('defeat'),
  reinforce: () => audio.play('reinforce'),
  conquest: () => audio.play('conquest'),
  turnStart: () => audio.play('turnStart'),
  buttonHover: () => audio.play('buttonHover'),
  notification: () => audio.play('notification'),
};

import { create } from 'zustand';
import { Song } from '@/types/music';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  volume: number;
  setIsPlaying: (isPlaying: boolean) => void;
  
  // Actions
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setPlaylist: (list: Song[]) => void;
  setVolume: (vol: number) => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 50,

  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaylist: (list) => set({ playlist: list }),
  
  setVolume: (vol) => set({ volume: vol }),

  playNext: () => {
    const { playlist, currentSong } = get();
    if (playlist.length === 0) return;
    if (!currentSong) {
      set({ currentSong: playlist[0], isPlaying: true });
      return;
    }
    const index = playlist.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (index + 1) % playlist.length;
    set({ currentSong: playlist[nextIndex], isPlaying: true });
  },

  playPrev: () => {
    const { playlist, currentSong } = get();
    if (playlist.length === 0) return;
    if (!currentSong) {
      set({ currentSong: playlist[0], isPlaying: true });
      return;
    }
    const index = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (index - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIndex], isPlaying: true });
  },
}));

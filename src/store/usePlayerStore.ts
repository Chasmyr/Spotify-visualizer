// ─────────────────────────────────────────────
//  Store Zustand — état global du player
//  Remplace les useState locaux de usePlayer
// ─────────────────────────────────────────────

import { create } from 'zustand'
import type { NormalizedTrack, SpotifyTrackRaw } from '../types/spotify'

interface PlayerStore {
  // État
  track:           NormalizedTrack | null
  recommendations: SpotifyTrackRaw[]
  isLoading:       boolean
  error:           string | null

  // Actions
  setTrack:           (track: NormalizedTrack | null) => void
  setRecommendations: (tracks: SpotifyTrackRaw[]) => void
  setLoading:         (isLoading: boolean) => void
  setError:           (error: string | null) => void

  // Mise à jour partielle de la progression (optimisation — évite un re-render complet)
  updateProgress: (progress: number, isPlaying: boolean) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  track:           null,
  recommendations: [],
  isLoading:       true,
  error:           null,

  setTrack:           (track) => set({ track }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setLoading:         (isLoading) => set({ isLoading }),
  setError:           (error) => set({ error }),

  updateProgress: (progress, isPlaying) =>
    set((state) => ({
      track: state.track ? { ...state.track, progress, isPlaying } : null,
    })),
}))

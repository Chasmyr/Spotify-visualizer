// ─────────────────────────────────────────────
//  usePlayer — Hook central du visualizer
//  Polling /currently-playing toutes les 5s
//  Fetch audio features uniquement si track change
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { getValidToken } from '../api/auth'
import type {
  NormalizedTrack,
  UsePlayerReturn,
  SpotifyPlayerRaw,
  SpotifyAudioFeaturesRaw,
  SpotifyRecommendationsRaw,
  SpotifyTrackRaw,
  AudioFeatures,
} from '../types/spotify'

const POLL_INTERVAL = 5000
const PITCH_CLASSES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const

function formatKey(key: number, mode: number): string {
  if (key === -1) return 'N/A'
  return `${PITCH_CLASSES[key]} ${mode === 1 ? 'Major' : 'Minor'}`
}

async function apiFetch<T>(endpoint: string): Promise<T | null> {
  const token = await getValidToken()
  if (!token) throw new Error('Non authentifié')
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const err = await res.json() as { error?: { message?: string } }
    throw new Error(err?.error?.message ?? `API error ${res.status}`)
  }
  return res.json() as Promise<T>
}

function normalizeFeatures(raw: SpotifyAudioFeaturesRaw): AudioFeatures {
  return {
    bpm:              Math.round(raw.tempo),
    energy:           raw.energy,
    danceability:     raw.danceability,
    valence:          raw.valence,
    acousticness:     raw.acousticness,
    liveness:         raw.liveness,
    speechiness:      raw.speechiness,
    instrumentalness: raw.instrumentalness,
    loudness:         raw.loudness,
    loudnessNorm:     Math.max(0, (raw.loudness + 60) / 60),
    key:              formatKey(raw.key, raw.mode),
    keyRaw:           raw.key,
    mode:             raw.mode,
  }
}

function normalizeTrack(
  raw: SpotifyPlayerRaw,
  features: SpotifyAudioFeaturesRaw | null
): NormalizedTrack {
  const track = raw.item
  return {
    id:        track.id,
    title:     track.name,
    artist:    track.artists.map((a) => a.name).join(', '),
    album:     track.album.name,
    artwork:   track.album.images[0]?.url ?? null,
    duration:  track.duration_ms,
    progress:  raw.progress_ms,
    isPlaying: raw.is_playing,
    uri:       track.uri,
    features:  features ? normalizeFeatures(features) : null,
  }
}

export function usePlayer(): UsePlayerReturn {
  const [track,           setTrack]           = useState<NormalizedTrack | null>(null)
  const [isLoading,       setIsLoading]       = useState<boolean>(true)
  const [error,           setError]           = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<SpotifyTrackRaw[]>([])
  const lastTrackIdRef = useRef<string | null>(null)

  const poll = useCallback(async (): Promise<void> => {
    try {
      const raw = await apiFetch<SpotifyPlayerRaw>('/me/player/currently-playing?market=FR')

      if (!raw?.item) {
        setTrack(null)
        lastTrackIdRef.current = null
        setIsLoading(false)
        return
      }

      const currentId = raw.item.id

      // Même morceau → mise à jour progression uniquement
      if (currentId === lastTrackIdRef.current) {
        setTrack((prev) =>
          prev ? { ...prev, progress: raw.progress_ms, isPlaying: raw.is_playing } : prev
        )
        setIsLoading(false)
        return
      }

      // Nouveau morceau détecté
      lastTrackIdRef.current = currentId
      setTrack(normalizeTrack(raw, null)) // affichage immédiat sans features
      setIsLoading(false)

      const features = await apiFetch<SpotifyAudioFeaturesRaw>(`/audio-features/${currentId}`)
      setTrack(normalizeTrack(raw, features))
      setError(null)

      // Recommendations basées sur l'énergie
      if (features) {
        apiFetch<SpotifyRecommendationsRaw>(
          `/recommendations?seed_tracks=${currentId}&target_energy=${features.energy.toFixed(2)}&limit=5&market=FR`
        )
          .then((data) => setRecommendations(data?.tracks ?? []))
          .catch(() => {})
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void poll()
    const id = setInterval(() => void poll(), POLL_INTERVAL)
    return () => clearInterval(id)
  }, [poll])

  return { track, isLoading, error, recommendations, refresh: poll }
}

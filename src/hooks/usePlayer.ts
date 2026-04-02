// ─────────────────────────────────────────────
//  usePlayer — Hook central du visualizer
//  Polling /currently-playing toutes les 5s
//  Features générées de façon déterministe (fakeFeatures)
// ─────────────────────────────────────────────

import { useEffect, useCallback, useRef } from 'react'
import { getValidToken } from '../api/auth'
import { usePlayerStore } from '../store/usePlayerStore'
import { generateFakeFeatures } from '../utils/fakeFeatures'
import type {
  SpotifyPlayerRaw,
  NormalizedTrack,
} from '../types/spotify'

const POLL_INTERVAL = 5000

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

function normalizeTrack(raw: SpotifyPlayerRaw): NormalizedTrack {
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
    features:  generateFakeFeatures(track.id),
  }
}

export function usePlayer(): void {
  const { setTrack, setLoading, setError, updateProgress } = usePlayerStore()
  const lastTrackIdRef = useRef<string | null>(null)

  const poll = useCallback(async (): Promise<void> => {
    try {
      const raw = await apiFetch<SpotifyPlayerRaw>('/me/player/currently-playing?market=FR')

      if (!raw?.item) {
        setTrack(null)
        lastTrackIdRef.current = null
        setLoading(false)
        return
      }

      const currentId = raw.item.id

      // Même morceau → mise à jour progression uniquement
      if (currentId === lastTrackIdRef.current) {
        updateProgress(raw.progress_ms, raw.is_playing)
        setLoading(false)
        return
      }

      // Nouveau morceau détecté — features générées immédiatement, pas de fetch
      lastTrackIdRef.current = currentId
      const normalized = normalizeTrack(raw)
      setTrack(normalized)
      setLoading(false)
      setError(null)

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
      setLoading(false)
    }
  }, [setTrack, setLoading, setError, updateProgress])

  useEffect(() => {
    void poll()
    const id = setInterval(() => void poll(), POLL_INTERVAL)
    return () => clearInterval(id)
  }, [poll])
}

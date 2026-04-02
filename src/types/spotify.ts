// ─────────────────────────────────────────────
//  Types Spotify — source de vérité unique
// ─────────────────────────────────────────────

// ── API Spotify (réponses brutes) ─────────────

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyArtist {
  id: string
  name: string
  uri: string
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  uri: string
}

export interface SpotifyTrackRaw {
  id: string
  name: string
  uri: string
  duration_ms: number
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  external_urls: { spotify: string }
}

export interface SpotifyPlayerRaw {
  is_playing: boolean
  progress_ms: number
  item: SpotifyTrackRaw
}

/**
 * @deprecated Le endpoint /v1/audio-features est déprécié par Spotify
 * depuis le 27/11/2024 pour les nouvelles apps.
 * Ce type est conservé pour référence mais n'est plus utilisé.
 * Les audio features sont maintenant simulées via src/utils/fakeFeatures.ts
 */
export interface SpotifyAudioFeaturesRaw {
  id: string
  tempo: number
  energy: number
  danceability: number
  valence: number
  acousticness: number
  liveness: number
  speechiness: number
  instrumentalness: number
  loudness: number
  key: number
  mode: number
}

export interface SpotifyRecommendationsRaw {
  tracks: SpotifyTrackRaw[]
}

// ── Données normalisées (utilisées dans les composants) ──

export interface AudioFeatures {
  bpm: number
  energy: number
  danceability: number
  valence: number
  acousticness: number
  liveness: number
  speechiness: number
  instrumentalness: number
  loudness: number
  loudnessNorm: number
  key: string
  keyRaw: number
  mode: number
}

export interface NormalizedTrack {
  id: string
  title: string
  artist: string
  album: string
  artwork: string | null
  duration: number
  progress: number
  isPlaying: boolean
  uri: string
  features: AudioFeatures
}

// ── Hook usePlayer ────────────────────────────

export interface UsePlayerReturn {
  track: NormalizedTrack | null
  isLoading: boolean
  error: string | null
  recommendations: SpotifyTrackRaw[]
  refresh: () => Promise<void>
}

// ── Auth ──────────────────────────────────────

export interface SpotifyTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

export interface SpotifyApiError {
  error: {
    status: number
    message: string
  }
}

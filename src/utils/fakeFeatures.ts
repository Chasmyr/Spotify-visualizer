// ─────────────────────────────────────────────
//  fakeFeatures.ts
//  Génère des audio features déterministes
//  à partir de l'ID Spotify du morceau.
//
//  Pourquoi : le endpoint /v1/audio-features
//  a été déprécié par Spotify le 27/11/2024
//  pour toutes les apps créées après cette date.
//
//  Principe : même ID → même seed → mêmes valeurs.
//  Le morceau A aura toujours le même BPM fictif,
//  différent du morceau B.
// ─────────────────────────────────────────────

import type { AudioFeatures } from '../types/spotify'

const PITCH_CLASSES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const

/**
 * Transforme un ID Spotify (string) en nombre entier.
 * Utilisé comme graine pour le générateur pseudo-aléatoire.
 */
function hashId(id: string): number {
  return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

/**
 * Générateur pseudo-aléatoire déterministe.
 * Retourne toujours la même valeur pour le même seed.
 * @param seed  - graine numérique
 * @param min   - borne inférieure
 * @param max   - borne supérieure
 */
function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000
  const normalized = x - Math.floor(x) // valeur entre 0 et 1
  return min + normalized * (max - min)
}

/**
 * Génère des audio features cohérentes et stables
 * à partir de l'ID du morceau Spotify.
 *
 * Chaque feature utilise un offset différent (seed + N)
 * pour que les valeurs soient indépendantes entre elles
 * tout en restant déterministes par morceau.
 */
export function generateFakeFeatures(trackId: string): AudioFeatures {
  const seed = hashId(trackId)

  const keyRaw   = Math.floor(seededRandom(seed + 6, 0, 12)) // 0–11
  const mode     = Math.round(seededRandom(seed + 7, 0, 1))  // 0 ou 1
  const loudness = parseFloat(seededRandom(seed + 8, -30, -3).toFixed(1))

  return {
    bpm:              Math.round(seededRandom(seed,      80, 180)),
    energy:           parseFloat(seededRandom(seed + 1,  0, 1).toFixed(2)),
    danceability:     parseFloat(seededRandom(seed + 2,  0, 1).toFixed(2)),
    valence:          parseFloat(seededRandom(seed + 3,  0, 1).toFixed(2)),
    acousticness:     parseFloat(seededRandom(seed + 4,  0, 1).toFixed(2)),
    liveness:         parseFloat(seededRandom(seed + 5,  0, 1).toFixed(2)),
    keyRaw,
    mode,
    key:              `${PITCH_CLASSES[keyRaw]} ${mode === 1 ? 'Major' : 'Minor'}`,
    loudness,
    loudnessNorm:     Math.max(0, (loudness + 60) / 60),
    speechiness:      parseFloat(seededRandom(seed + 9,  0, 0.5).toFixed(2)),
    instrumentalness: parseFloat(seededRandom(seed + 10, 0, 1).toFixed(2)),
  }
}

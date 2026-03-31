// ─────────────────────────────────────────────
//  Spotify Auth — Authorization Code with PKCE
// ─────────────────────────────────────────────

import type { SpotifyTokenResponse } from '../types/spotify'

const CLIENT_ID    = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = (import.meta.env.VITE_REDIRECT_URI as string | undefined) ?? 'http://localhost:5173/callback'

const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-email',
  'user-top-read',
].join(' ')

const KEYS = {
  ACCESS_TOKEN:  'sp_access_token',
  REFRESH_TOKEN: 'sp_refresh_token',
  EXPIRES_AT:    'sp_expires_at',
  CODE_VERIFIER: 'sp_code_verifier',
} as const

// ── PKCE helpers ──────────────────────────────

function generateCodeVerifier(length = 128): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data   = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// ── Auth flow ─────────────────────────────────

export async function login(): Promise<void> {
  const verifier  = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  localStorage.setItem(KEYS.CODE_VERIFIER, verifier)
  const params = new URLSearchParams({
    client_id:             CLIENT_ID,
    response_type:         'code',
    redirect_uri:          REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge:        challenge,
    scope:                 SCOPES,
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code: string): Promise<SpotifyTokenResponse> {
  const verifier = localStorage.getItem(KEYS.CODE_VERIFIER)
  if (!verifier) throw new Error('Code verifier manquant — relancer le login')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      code_verifier: verifier,
    }),
  })
  if (!res.ok) {
    const err = await res.json() as { error_description?: string }
    throw new Error(err.error_description ?? 'Token exchange failed')
  }
  const data = await res.json() as SpotifyTokenResponse
  persistTokens(data)
  localStorage.removeItem(KEYS.CODE_VERIFIER)
  return data
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(KEYS.REFRESH_TOKEN)
  if (!refreshToken) throw new Error('Pas de refresh token')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) { logout(); throw new Error('Refresh échoué') }
  const data = await res.json() as SpotifyTokenResponse
  persistTokens(data)
  return data.access_token
}

// ── Token management ──────────────────────────

function persistTokens({ access_token, refresh_token, expires_in }: SpotifyTokenResponse): void {
  localStorage.setItem(KEYS.ACCESS_TOKEN, access_token)
  if (refresh_token) localStorage.setItem(KEYS.REFRESH_TOKEN, refresh_token)
  localStorage.setItem(KEYS.EXPIRES_AT, (Date.now() + (expires_in - 60) * 1000).toString())
}

export async function getValidToken(): Promise<string | null> {
  const token     = localStorage.getItem(KEYS.ACCESS_TOKEN)
  const expiresAt = Number(localStorage.getItem(KEYS.EXPIRES_AT) ?? 0)
  if (!token) return null
  if (Date.now() >= expiresAt) return refreshAccessToken()
  return token
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(KEYS.ACCESS_TOKEN))
}

export function logout(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}

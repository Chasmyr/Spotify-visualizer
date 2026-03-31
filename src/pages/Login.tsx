import type { JSX } from 'react'
import { useSearchParams } from 'react-router-dom'
import { login } from '../api/auth'

type AuthError = 'access_denied' | 'token_failed' | null

function getAuthError(param: string | null): AuthError {
  if (param === 'access_denied' || param === 'token_failed') return param
  return null
}

export default function Login(): JSX.Element {
  const [searchParams] = useSearchParams()
  const error: AuthError = getAuthError(searchParams.get('error'))

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black gap-6">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#1DB954" />
        <path
          d="M20 24c8-4 20-3 27 3"
          stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"
        />
        <path
          d="M22 32c6-3 16-2 22 2"
          stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"
        />
        <path
          d="M24 40c5-2 12-2 17 1"
          stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"
        />
      </svg>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-white">Spotify Visualizer</h1>
        <p className="text-zinc-500 text-sm">Visualise tes morceaux en temps réel</p>
      </div>

      <button
        onClick={() => void login()}
        className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full px-8 py-3 transition-colors"
      >
        Se connecter avec Spotify
      </button>

      {error === 'access_denied' && (
        <p className="text-red-400 text-xs text-center">Connexion refusée. Réessaie.</p>
      )}
      {error === 'token_failed' && (
        <p className="text-red-400 text-xs text-center">Erreur d'authentification. Réessaie.</p>
      )}
    </div>
  )
}

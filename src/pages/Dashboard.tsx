import type { JSX } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../hooks/usePlayer'
import { logout } from '../api/auth'
import NowPlaying from '../components/NowPlaying'
import AudioFeaturesGrid from '../components/AudioFeaturesGrid'
import RadarChart from '../components/RadarChart'
import SimilarTracks from '../components/SimilarTracks'

export default function Dashboard(): JSX.Element {
  const { track, isLoading, error, recommendations } = usePlayer()
  const navigate = useNavigate()

  useEffect(() => {
    if (!track?.features) return
    const energy = track.features.energy
    const color: string = energy < 0.4 ? '#3b82f6' : energy < 0.7 ? '#1DB954' : '#f97316'
    document.documentElement.style.setProperty('--accent', color)
  }, [track?.features?.energy])

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-bold tracking-tight">Spotify Visualizer</h1>
        <button
          onClick={() => { logout(); void navigate('/login') }}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Déconnexion
        </button>
      </header>

      <main className="p-8">
        {/* Chargement */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-700 border-t-[var(--accent)]" />
          </div>
        )}

        {/* Erreur */}
        {error && !isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Aucun morceau */}
        {!isLoading && !error && !track && (
          <div className="flex items-center justify-center h-64">
            <p className="text-zinc-500 text-sm">Aucun morceau en lecture sur Spotify</p>
          </div>
        )}

        {/* Contenu principal */}
        {!isLoading && track && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-8">
              {/* Colonne gauche — 1/3 */}
              <div className="w-1/3 flex-shrink-0">
                <NowPlaying track={track} />
              </div>

              {/* Colonne droite — 2/3 */}
              <div className="flex-1 flex flex-col gap-4">
                <AudioFeaturesGrid features={track.features} />
                <RadarChart features={track.features} />
              </div>
            </div>

            {/* Pleine largeur */}
            <SimilarTracks tracks={recommendations} />
          </div>
        )}
      </main>
    </div>
  )
}

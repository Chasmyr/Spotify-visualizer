import type { JSX } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'

export default function MiniPlayer(): JSX.Element | null {
  const track = usePlayerStore((s) => s.track)

  if (!track) return null

  const progress = (track.progress / track.duration) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-4 py-3 flex items-center gap-4">
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800">
        <div
          className="bg-[var(--accent)] h-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Artwork */}
      {track.artwork ? (
        <img
          src={track.artwork}
          alt={track.album}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-md bg-zinc-800 flex-shrink-0" />
      )}

      {/* Infos track */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{track.title}</p>
        <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
      </div>

      {/* BPM badge */}
      <div className="hidden sm:flex items-center gap-1 bg-zinc-800 rounded-full px-2 py-1">
        <span className="text-xs font-mono text-[var(--accent)]">{track.features.bpm} BPM</span>
      </div>

      {/* Indicateur énergie */}
      <div className="hidden md:flex items-center gap-2 w-24">
        <span className="text-xs text-zinc-500">Énergie</span>
        <div className="bg-zinc-700 rounded-full h-1 flex-1">
          <div
            className="bg-[var(--accent)] h-full rounded-full transition-all duration-700"
            style={{ width: `${track.features.energy * 100}%` }}
          />
        </div>
      </div>

      {/* Tonalité badge */}
      <div className="hidden lg:flex">
        <span className="text-xs font-mono text-purple-300 bg-purple-900/40 border border-purple-700/50 rounded-full px-2 py-1">
          {track.features.key}
        </span>
      </div>
    </div>
  )
}

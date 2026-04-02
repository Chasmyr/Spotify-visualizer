import type { JSX } from 'react'
import type { AudioFeatures } from '../types/spotify'

interface AudioFeaturesGridProps {
  features: AudioFeatures
}

export default function AudioFeaturesGrid({ features }: AudioFeaturesGridProps): JSX.Element {
  const barHeights = [40, 70, 55, 85, 45, 60, 75, 50]

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* BPM */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">BPM</p>
        <p className="text-3xl font-mono text-[var(--accent)]">{features.bpm}</p>
        <div className="flex items-end gap-[3px] mt-2 h-8">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-[var(--accent)] rounded-sm opacity-80"
              style={{
                height: `${h}%`,
                animation: 'pulse 1s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Énergie */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Énergie</p>
        <p className="text-3xl font-mono text-white">{features.energy.toFixed(2)}</p>
        <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5">
          <div
            className="bg-[var(--accent)] h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${features.energy * 100}%` }}
          />
        </div>
      </div>

      {/* Tonalité */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Tonalité</p>
        <p className="text-2xl font-bold text-purple-300">{features.key}</p>
        <span className="mt-2 inline-block bg-purple-900/40 text-purple-300 border border-purple-700/50 rounded-full px-3 py-1 text-xs">
          {features.mode === 1 ? 'Major' : 'Minor'}
        </span>
      </div>

      {/* Valence */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Valence</p>
        <p className="text-3xl font-mono text-white">{features.valence.toFixed(2)}</p>
        <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              background: 'linear-gradient(to right, #3b82f6, #facc15)',
              width: `${features.valence * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

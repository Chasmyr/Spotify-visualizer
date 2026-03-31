import type { JSX } from 'react'
import type { NormalizedTrack } from '../types/spotify'

interface NowPlayingProps {
  track: NormalizedTrack
}

function formatMs(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function NowPlaying({ track }: NowPlayingProps): JSX.Element {
  const progress = (track.progress / track.duration) * 100

  return (
    <div className="flex flex-col gap-4">
      {track.artwork ? (
        <img
          src={track.artwork}
          alt={track.album}
          className={[
            'w-44 h-44 rounded-xl object-cover',
            track.isPlaying
              ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-zinc-950 animate-pulse'
              : '',
          ].join(' ')}
        />
      ) : (
        <div className="w-44 h-44 rounded-xl bg-zinc-800 flex items-center justify-center text-4xl">
          🎵
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-xs">
        <p className="text-xl font-bold text-white truncate">{track.title}</p>
        <p className="text-zinc-400 text-sm">{track.artist}</p>
        <p className="text-zinc-600 text-xs truncate">{track.album}</p>
      </div>

      <div className="flex flex-col gap-1 max-w-xs">
        <div className="w-full bg-zinc-800 rounded-full h-1">
          <div
            className="bg-[var(--accent)] rounded-full h-1 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-zinc-500">
          <span>{formatMs(track.progress)}</span>
          <span>{formatMs(track.duration)}</span>
        </div>
      </div>
    </div>
  )
}

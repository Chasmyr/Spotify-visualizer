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

  const artworkClass = [
    'rounded-xl object-cover flex-shrink-0',
    'w-20 h-20 lg:w-full lg:h-auto lg:aspect-square',
    track.isPlaying
      ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-zinc-950 animate-pulse'
      : '',
  ].join(' ')

  const artwork = track.artwork ? (
    <img src={track.artwork} alt={track.album} className={artworkClass} />
  ) : (
    <div className="w-20 h-20 lg:w-full lg:aspect-square rounded-xl bg-zinc-800 flex items-center justify-center text-4xl flex-shrink-0">
      🎵
    </div>
  )

  return (
    <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-start">
      {artwork}

      <div className="flex flex-1 min-w-0 flex-col gap-3 lg:w-full">
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold text-white truncate lg:text-xl">{track.title}</p>
          <p className="text-zinc-400 text-sm">{track.artist}</p>
          <p className="text-zinc-600 text-xs truncate">{track.album}</p>
        </div>

        <div className="flex flex-col gap-1 w-full">
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
    </div>
  )
}

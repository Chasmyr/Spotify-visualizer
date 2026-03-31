import type { JSX } from 'react'
import type { SpotifyTrackRaw } from '../types/spotify'

interface SimilarTracksProps {
  tracks: SpotifyTrackRaw[]
}

export default function SimilarTracks({ tracks }: SimilarTracksProps): JSX.Element {
  if (tracks.length === 0) {
    return <p className="text-zinc-500 text-sm">Chargement des suggestions...</p>
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        Morceaux similaires
      </p>
      <ul className="flex flex-col gap-1">
        {tracks.slice(0, 5).map((track) => (
          <li
            key={track.id}
            onClick={() => window.open(track.external_urls.spotify, '_blank')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <img
              src={track.album.images[2]?.url}
              alt={track.album.name}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium text-white truncate">{track.name}</p>
              <p className="text-xs text-zinc-400">{track.artists.map((a) => a.name).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

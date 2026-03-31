import type { JSX } from 'react'
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { AudioFeatures } from '../types/spotify'

interface RadarChartProps {
  features: AudioFeatures | null
}

interface RadarDataPoint {
  axis: string
  value: number
}

export default function RadarChart({ features }: RadarChartProps): JSX.Element {
  if (!features) {
    return <div className="h-56 bg-zinc-900 rounded-xl animate-pulse" />
  }

  const data: RadarDataPoint[] = [
    { axis: 'Dance',      value: features.danceability },
    { axis: 'Énergie',    value: features.energy },
    { axis: 'Volume',     value: features.loudnessNorm },
    { axis: 'Valence',    value: features.valence },
    { axis: 'Acoustique', value: features.acousticness },
    { axis: 'Live',       value: features.liveness },
  ]

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Profil sonore</p>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius={75}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#71717a', fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

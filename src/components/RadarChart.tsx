import type { JSX } from 'react'
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { AudioFeatures } from '../types/spotify'

interface RadarChartProps {
  features: AudioFeatures
}

interface RadarDataPoint {
  axis: string
  value: number
}

export default function RadarChart({ features }: RadarChartProps): JSX.Element {
  const data: RadarDataPoint[] = [
    { axis: 'Dance',      value: Math.round(features.danceability * 100) },
    { axis: 'Énergie',    value: Math.round(features.energy * 100) },
    { axis: 'Volume',     value: Math.round(features.loudnessNorm * 100) },
    { axis: 'Valence',    value: Math.round(features.valence * 100) },
    { axis: 'Acoustique', value: Math.round(features.acousticness * 100) },
    { axis: 'Live',       value: Math.round(features.liveness * 100) },
  ]

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Profil sonore</p>
      <ResponsiveContainer width="100%" height={260}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#27272a" />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#71717a', fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.2}
            strokeWidth={1.5}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

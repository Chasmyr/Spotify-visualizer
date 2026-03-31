import type { JSX } from 'react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeCodeForToken } from '../api/auth'

export default function Callback(): JSX.Element {
  const navigate = useNavigate()
  const called   = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')
    const error  = params.get('error')
    if (error || !code) { navigate('/login?error=access_denied'); return }
    exchangeCodeForToken(code)
      .then(() => navigate('/'))
      .catch(() => navigate('/login?error=token_failed'))
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <p className="text-green-400 font-mono text-sm animate-pulse">Connexion en cours...</p>
    </div>
  )
}

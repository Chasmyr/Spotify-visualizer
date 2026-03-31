import type { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './api/auth'
import Login      from './pages/Login'
import Callback   from './pages/Callback'
import Dashboard  from './pages/Dashboard'
import MiniPlayer from './components/MiniPlayer'

interface PrivateRouteProps {
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

function AppContent(): JSX.Element {
  const location = useLocation()
  const hidePlayer = location.pathname === '/login' || location.pathname === '/callback'

  return (
    <>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
      {!hidePlayer && <MiniPlayer />}
    </>
  )
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

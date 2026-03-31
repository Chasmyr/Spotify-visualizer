import type { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './api/auth'
import Login     from './pages/Login'
import Callback  from './pages/Callback'
import Dashboard from './pages/Dashboard'

interface PrivateRouteProps {
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

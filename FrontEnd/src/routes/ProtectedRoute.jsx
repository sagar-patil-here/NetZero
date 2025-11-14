import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!currentUser) {
    return <Navigate to="/landing" replace state={{ from: location }} />
  }

  return children
}


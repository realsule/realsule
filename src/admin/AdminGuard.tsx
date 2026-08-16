import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export function AdminGuard() {
  const { isAuthed } = useAdminAuth()
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export function AdminLogin() {
  const { isAuthed, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (isAuthed) return <Navigate to="/admin" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = login(password)
    setError(!ok)
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span className="script admin-login-logo">Sule.</span>
        <h1>Content Studio</h1>
        <p className="modal-lead">
          Not a real login system — there's no backend to check this against. It just keeps the
          studio out of casual reach. See the comment in AdminAuthContext.tsx before relying on it.
        </p>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
          />
        </div>
        {error && <p className="admin-login-error">That password isn't right.</p>}
        <button type="submit" className="btn btn-solid" style={{ width: '100%' }}>
          Enter studio
        </button>
      </form>
    </div>
  )
}

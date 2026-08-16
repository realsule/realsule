import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const SESSION_KEY = 'suleiman-portfolio-admin-authed'

/**
 * ⚠️ THIS IS NOT REAL SECURITY.
 *
 * There is no backend here, which means there is nothing that can
 * actually verify a password in secret. Whatever value ends up here —
 * whether hardcoded or pulled from an env var at build time — gets
 * baked directly into the JavaScript bundle every visitor downloads.
 * Anyone who opens their browser's dev tools can read it out of the
 * source, or just flip the sessionStorage flag this gate checks.
 *
 * What this DOES do: keep /admin out of casual reach (it's not linked
 * from the public nav, and it asks for a password before rendering
 * anything), which is a reasonable bar for a personal portfolio only
 * you use. It is NOT a substitute for real authentication.
 *
 * The password comes from VITE_ADMIN_PASSWORD (see .env.example and
 * the README's "Environment variables" section) so you're not stuck
 * editing source code to change it, and so a Docker image can be built
 * with a different password than whatever's committed to git — but
 * again: build-time env vars in a client-only app are a convenience,
 * not a secret. If you ever want this to be actually secure, you need
 * a backend that checks the password server-side and issues a session
 * (e.g. a small serverless function + a hashed password that only the
 * server ever sees).
 */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme123'

if (import.meta.env.PROD && ADMIN_PASSWORD === 'changeme123') {
  // Doesn't block anything -- just makes the risk visible in the
  // console of a production build that forgot to set a real value.
  console.warn(
    '[admin] VITE_ADMIN_PASSWORD was not set — falling back to the default "changeme123". ' +
      'Set it in your .env (or as a Docker build arg) before sharing this deployment.',
  )
}

interface AdminAuthContextValue {
  isAuthed: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(
    () => window.sessionStorage.getItem(SESSION_KEY) === 'true',
  )

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAuthed,
      login: (password: string) => {
        const ok = password === ADMIN_PASSWORD
        if (ok) {
          window.sessionStorage.setItem(SESSION_KEY, 'true')
          setIsAuthed(true)
        }
        return ok
      },
      logout: () => {
        window.sessionStorage.removeItem(SESSION_KEY)
        setIsAuthed(false)
      },
    }),
    [isAuthed],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return ctx
}

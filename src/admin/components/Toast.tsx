import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  kind: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, kind?: Toast['kind']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, kind: Toast['kind'] = 'success') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="admin-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.kind}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

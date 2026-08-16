import type { ReactNode } from 'react'

interface AdminModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Same .modal-overlay/.modal classes as BookingModal — one visual language across the whole site, public and admin. */
export function AdminModal({ title, onClose, children }: AdminModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="modal admin-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

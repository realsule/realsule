interface ConfirmDialogProps {
  title: string
  body: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Reuses the same .modal-overlay/.modal classes as the booking modal so it matches the site's own UI. */
export function ConfirmDialog({ title, body, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="modal admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="modal-lead">{body}</p>
        <div className="admin-confirm-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-solid admin-danger-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

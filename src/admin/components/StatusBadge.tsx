interface StatusBadgeProps {
  published: boolean
}

export function StatusBadge({ published }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${published ? 'status-published' : 'status-draft'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

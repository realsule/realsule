interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div className="admin-empty-state">{message}</div>
}

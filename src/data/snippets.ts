export interface Snippet {
  id: string
  label: string
  language: string
  code: string
}

export const snippets: Snippet[] = [
  {
    id: 'react',
    label: 'BookingCard.tsx',
    language: 'tsx',
    code: `type BookingCardProps = {
  studio: string
  date: string
  onConfirm: () => void
}

export function BookingCard({ studio, date, onConfirm }: BookingCardProps) {
  return (
    <div className="booking-card">
      <h3>{studio}</h3>
      <p>{date}</p>
      <button onClick={onConfirm}>Confirm booking</button>
    </div>
  )
}

// Try editing this — it's just plain text, nothing runs on a server.`,
  },
  {
    id: 'python',
    label: 'vault.py',
    language: 'python',
    code: `from cryptography.fernet import Fernet

def encrypt_file(path: str, key: bytes) -> None:
    fernet = Fernet(key)
    with open(path, "rb") as f:
        data = f.read()
    with open(path, "wb") as f:
        f.write(fernet.encrypt(data))

# A trimmed-down piece of VaultCrypt, my CLI encrypted vault.
# Edit this snippet — it's here to show how I write code, not to execute it.`,
  },
  {
    id: 'sql',
    label: 'invoice.sql',
    language: 'sql',
    code: `select
  b.id,
  c.name as client,
  b.package,
  b.amount,
  b.status
from bookings b
join clients c on c.id = b.client_id
where b.status = 'confirmed'
order by b.created_at desc;

-- This is the kind of query behind the Hire Me booking flow above.`,
  },
]

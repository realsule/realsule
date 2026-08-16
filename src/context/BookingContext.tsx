import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface BookingContextValue {
  isOpen: boolean
  /** Package name the visitor clicked from, if any (prefills the form). */
  selectedTier: string | null
  openBooking: (tier?: string) => void
  closeBooking: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  // useMemo so consumers don't re-render on every keystroke elsewhere in the tree
  const value = useMemo<BookingContextValue>(
    () => ({
      isOpen,
      selectedTier,
      openBooking: (tier) => {
        setSelectedTier(tier ?? null)
        setIsOpen(true)
      },
      closeBooking: () => setIsOpen(false),
    }),
    [isOpen, selectedTier],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

/** Call this from any component to open/close the booking modal. */
export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}

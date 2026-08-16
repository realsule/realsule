import { useEffect, useState } from 'react'

const STORAGE_KEY = 'suleiman-portfolio-view-count'
const SESSION_FLAG_KEY = 'suleiman-portfolio-view-counted'

function readCount(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY) ?? '0')
  } catch {
    return 0
  }
}

/**
 * There's no backend, so this cannot be a real "X people have visited
 * this site" counter -- that requires a server tallying requests from
 * every visitor. What this DOES honestly do: count page loads of the
 * public site in THIS browser, persisted across visits.
 *
 * Two hooks, on purpose:
 *   - useRecordedViewCount() INCREMENTS the total, once per browser tab
 *     session (guarded by sessionStorage, not just a mount-time ref --
 *     that also survives React StrictMode's dev-only double-invoke of
 *     effects). This is the one that should be called from exactly one
 *     place: the public Footer.
 *   - useViewCountValue() only READS the current total. The admin
 *     Dashboard uses this one -- if it used the incrementing version
 *     too, every time you glanced at your own dashboard it would count
 *     as a "visit," which would be a lie.
 *
 * If you later add a backend (see README), swap the internals of
 * useRecordedViewCount for a `fetch('/api/views', { method: 'POST' })`
 * call -- neither Footer nor Dashboard need to change, only this file.
 */
export function useRecordedViewCount(): number {
  const [count, setCount] = useState<number>(readCount)

  useEffect(() => {
    try {
      const alreadyCountedThisSession = window.sessionStorage.getItem(SESSION_FLAG_KEY) === 'true'
      if (!alreadyCountedThisSession) {
        const next = readCount() + 1
        window.localStorage.setItem(STORAGE_KEY, String(next))
        window.sessionStorage.setItem(SESSION_FLAG_KEY, 'true')
        setCount(next)
      }
    } catch {
      // localStorage/sessionStorage can throw in locked-down environments
      // (private browsing in some browsers, etc.) -- a missing counter
      // isn't worth breaking the page over.
    }
  }, [])

  return count
}

/** Read-only -- does NOT increment. Safe to call from the admin dashboard. */
export function useViewCountValue(): number {
  const [count, setCount] = useState<number>(readCount)

  useEffect(() => {
    setCount(readCount())
  }, [])

  return count
}

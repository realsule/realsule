import { useEffect, useState } from 'react'

/**
 * Shown for a short fixed window when the app first mounts, then fades
 * and unmounts itself. There's nothing real to wait for (no backend, no
 * data fetch) — this is purely the entrance moment from the reference
 * design, so the timeout is deliberate rather than tied to a loading
 * condition.
 */
const DISPLAY_MS = 1300
const FADE_MS = 400

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), DISPLAY_MS)
    const removeTimer = setTimeout(() => setVisible(false), DISPLAY_MS + FADE_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`loading-screen ${fading ? 'fading' : ''}`} aria-hidden="true">
      <span className="loading-text">Loadin&apos;</span>
    </div>
  )
}

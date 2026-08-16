import { useTheme } from '../context/ThemeContext'

/**
 * Small pill button that flips light/dark. Lives in the TopBar so it's
 * visible on every scroll position, not tucked away in a menu — the
 * point was to switch "anytime", so it needs to always be reachable.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <span className="theme-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
      <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

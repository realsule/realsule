import type { IllustrationType } from '../cms/types'

/**
 * Small set of hand-drawn-style line icons, one per service step.
 * Kept as inline SVG (not <img> files) so the whole site stays
 * dependency-free — no image assets to ship or go missing.
 * All strokes use currentColor so they inherit whatever text color
 * the parent .service-card sets.
 */

function CompassIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="38" />
      <path d="M65 35 L45 45 L35 65 L55 55 Z" fill="currentColor" stroke="none" />
      <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 15 C25 15 12 32 12 50 C12 65 22 70 30 65 C36 61 44 63 44 70 C44 78 50 85 62 82 C82 77 88 60 88 48 C88 28 72 15 50 15 Z" />
      <circle cx="34" cy="40" r="5" fill="currentColor" stroke="none" />
      <circle cx="52" cy="30" r="5" fill="currentColor" stroke="none" />
      <circle cx="68" cy="42" r="5" fill="currentColor" stroke="none" />
      <circle cx="65" cy="60" r="5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="34" width="56" height="42" rx="8" />
      <path d="M68 46 L88 36 L88 74 L68 64 Z" />
      <circle cx="40" cy="55" r="13" />
      <path d="M28 34 L34 24 L52 24 L58 34" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 28 L14 50 L35 72" />
      <path d="M65 28 L86 50 L65 72" />
      <path d="M57 20 L43 80" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 12 C64 26 68 46 62 66 L38 66 C32 46 36 26 50 12 Z" />
      <circle cx="50" cy="38" r="7" />
      <path d="M38 60 L22 78 M62 60 L78 78" />
      <path d="M44 68 L40 86 M56 68 L60 86" />
    </svg>
  )
}

const icons: Record<IllustrationType, () => JSX.Element> = {
  compass: CompassIcon,
  palette: PaletteIcon,
  camera: CameraIcon,
  code: CodeIcon,
  rocket: RocketIcon,
}

export function ServiceIllustration({ type }: { type: IllustrationType }) {
  const Icon = icons[type]
  return (
    <div className="service-illustration" aria-hidden="true">
      <Icon />
    </div>
  )
}

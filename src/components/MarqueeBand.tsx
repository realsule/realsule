/**
 * Four diagonally-skewed, endlessly-scrolling bands of a single word +
 * icon — the same device as the reference site's "QUALITY / REACTIVITY /
 * CURIOSITY / CREATIVITY" section. Each band repeats its word many times
 * in a row so the CSS animation (translateX, looping at -50%) reads as
 * an infinite marquee rather than a strip that visibly resets.
 */

interface Band {
  word: string
  icon: string
  colorClass: string
  direction: 'left' | 'right'
}

const bands: Band[] = [
  { word: 'CODE', icon: '⚡', colorClass: 'mq-sky', direction: 'left' },
  { word: 'CRAFT', icon: '🎨', colorClass: 'mq-peach', direction: 'right' },
  { word: 'CURIOSITY', icon: '🧪', colorClass: 'mq-mint', direction: 'left' },
  { word: 'STORY', icon: '🎬', colorClass: 'mq-lavender', direction: 'right' },
]

function BandRow({ band }: { band: Band }) {
  // Repeat the word a bunch of times so the strip is comfortably wider
  // than any viewport before it needs to loop.
  const repeated = Array.from({ length: 10 })

  return (
    <div className={`marquee-row ${band.colorClass} marquee-${band.direction}`}>
      <div className="marquee-track">
        {repeated.map((_, i) => (
          <span className="marquee-item" key={i}>
            {band.icon} {band.word}
          </span>
        ))}
      </div>
    </div>
  )
}

export function MarqueeBand() {
  return (
    <section className="marquee-section" aria-hidden="true">
      {bands.map((band) => (
        <BandRow key={band.word} band={band} />
      ))}
    </section>
  )
}

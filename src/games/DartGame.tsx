import { useState } from 'react'
import type { MouseEvent } from 'react'

const DARTS_PER_ROUND = 3
const CENTER = 110
const RINGS = [
  { radius: 18, points: 50, label: 'Bullseye' },
  { radius: 45, points: 25, label: 'Inner ring' },
  { radius: 75, points: 15, label: 'Middle ring' },
  { radius: 105, points: 5, label: 'Outer ring' },
]
const MISS_POINTS = 0

/**
 * Score is derived from which concentric ring the click lands in,
 * measured as distance from the board's center — simpler and more
 * forgiving than trying to hit an exact pixel-perfect sector.
 */
function scoreFromClick(dx: number, dy: number): { points: number; label: string } {
  const distance = Math.sqrt(dx * dx + dy * dy)
  for (const ring of RINGS) {
    if (distance <= ring.radius) return { points: ring.points, label: ring.label }
  }
  return { points: MISS_POINTS, label: 'Miss' }
}

export function DartGame() {
  const [throwsThisRound, setThrowsThisRound] = useState<number[]>([])
  const [lastHit, setLastHit] = useState<string | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [rounds, setRounds] = useState(0)

  const roundDone = throwsThisRound.length >= DARTS_PER_ROUND

  function handleBoardClick(e: MouseEvent<SVGSVGElement>) {
    if (roundDone) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    // Convert the click from screen pixels into the SVG's own 0–220
    // coordinate space, then measure from the center point.
    const x = ((e.clientX - rect.left) / rect.width) * 220
    const y = ((e.clientY - rect.top) / rect.height) * 220
    const { points, label } = scoreFromClick(x - CENTER, y - CENTER)

    setThrowsThisRound((prev) => [...prev, points])
    setLastHit(`${label} — +${points}`)
    setTotalScore((prev) => prev + points)
  }

  function nextRound() {
    setThrowsThisRound([])
    setLastHit(null)
    setRounds((r) => r + 1)
  }

  function resetGame() {
    setThrowsThisRound([])
    setLastHit(null)
    setTotalScore(0)
    setRounds(0)
  }

  return (
    <div className="game-widget dart-widget">
      <div className="game-status">
        Round {rounds + 1} — throw {Math.min(throwsThisRound.length + 1, DARTS_PER_ROUND)} of {DARTS_PER_ROUND}
        {' · '}Total: {totalScore}
      </div>

      <svg
        viewBox="0 0 220 220"
        className="dartboard"
        onClick={handleBoardClick}
        role="img"
        aria-label="Dartboard — click a ring to throw"
      >
        {[...RINGS].reverse().map((ring, i) => (
          <circle
            key={ring.label}
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            className={`dart-ring ring-${i}`}
          />
        ))}
      </svg>

      {lastHit && <div className="dart-hit">{lastHit}</div>}

      <div className="game-actions">
        {roundDone ? (
          <button type="button" className="game-reset" onClick={nextRound}>
            Next round
          </button>
        ) : (
          <span className="dart-hint">Click the board to throw a dart</span>
        )}
        <button type="button" className="game-reset ghost" onClick={resetGame}>
          Reset score
        </button>
      </div>
    </div>
  )
}

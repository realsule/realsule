import { useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import type { Square } from 'chess.js'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

// Unicode chess glyphs, keyed by chess.js's own piece-type + color codes.
const PIECE_GLYPHS: Record<string, string> = {
  wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
  bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
}

/**
 * Two-player local chess. chess.js handles all the actual rules (legal
 * moves, check, checkmate, stalemate, castling, en passant, promotion —
 * promotion always resolves to a queen here, kept simple on purpose).
 * The component's only job is turning clicks into moves.
 */
export function ChessGame() {
  // useMemo (not useState) for the engine instance itself — it's a
  // mutable object we call methods on, not data we re-render from
  // directly. `fen` below is the actual render-triggering state.
  const game = useMemo(() => new Chess(), [])
  const [fen, setFen] = useState(game.fen())
  const [selected, setSelected] = useState<Square | null>(null)

  const board = game.board()
  const legalTargets = selected
    ? game.moves({ square: selected, verbose: true }).map((m) => m.to)
    : []

  function squareName(fileIndex: number, rankIndex: number): Square {
    return `${FILES[fileIndex]}${RANKS[rankIndex]}` as Square
  }

  function handleSquareClick(square: Square) {
    if (game.isGameOver()) return

    const piece = game.get(square)

    // Nothing selected yet — select this square only if it holds a
    // piece belonging to whoever's turn it is.
    if (!selected) {
      if (piece && piece.color === game.turn()) setSelected(square)
      return
    }

    // Clicking the already-selected square deselects it.
    if (square === selected) {
      setSelected(null)
      return
    }

    // Try the move. Always promote to a queen if it happens to be a
    // pawn reaching the last rank — a simplification, noted above.
    const move = game.move({ from: selected, to: square, promotion: 'q' })
    if (move) {
      setFen(game.fen())
      setSelected(null)
      return
    }

    // Illegal target — if it's another one of the current player's own
    // pieces, switch the selection to that piece instead of clearing it.
    if (piece && piece.color === game.turn()) {
      setSelected(square)
    } else {
      setSelected(null)
    }
  }

  function reset() {
    game.reset()
    setFen(game.fen())
    setSelected(null)
  }

  let status: string
  if (game.isCheckmate()) status = `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`
  else if (game.isStalemate()) status = 'Stalemate — draw'
  else if (game.isDraw()) status = 'Draw'
  else if (game.isCheck()) status = `${game.turn() === 'w' ? 'White' : 'Black'} is in check`
  else status = `${game.turn() === 'w' ? 'White' : 'Black'} to move`

  return (
    <div className="game-widget chess-widget">
      <div className="game-status">{status}</div>

      {/* fen is read here only to force a re-render when it changes —
          the board array itself is pulled fresh from `game` each render. */}
      <div className="chess-board" data-fen={fen}>
        {RANKS.map((_, rankIndex) =>
          FILES.map((_, fileIndex) => {
            const square = squareName(fileIndex, rankIndex)
            const piece = board[rankIndex][fileIndex]
            const isDark = (fileIndex + rankIndex) % 2 === 1
            const isSelected = square === selected
            const isTarget = legalTargets.includes(square)

            return (
              <button
                key={square}
                className={[
                  'chess-square',
                  isDark ? 'dark' : 'light',
                  isSelected ? 'selected' : '',
                  isTarget ? 'target' : '',
                ].join(' ').trim()}
                onClick={() => handleSquareClick(square)}
                aria-label={`${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
              >
                {piece && PIECE_GLYPHS[`${piece.color}${piece.type}`]}
              </button>
            )
          }),
        )}
      </div>

      <button type="button" className="game-reset" onClick={reset}>
        New game
      </button>
    </div>
  )
}

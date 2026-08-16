import { useState } from 'react'

type Cell = 'X' | 'O' | null

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],           // diagonals
]

function getWinner(board: Cell[]): Cell {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

/** Classic 3x3, two players sharing one screen — no AI opponent. */
export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = getWinner(board)
  const isDraw = !winner && board.every((cell) => cell !== null)

  function handleClick(index: number) {
    if (board[index] || winner) return
    const next = [...board]
    next[index] = xIsNext ? 'X' : 'O'
    setBoard(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  let status: string
  if (winner) status = `${winner} wins! 🎉`
  else if (isDraw) status = "It's a draw."
  else status = `${xIsNext ? 'X' : 'O'}'s turn`

  return (
    <div className="game-widget ttt-widget">
      <div className="game-status">{status}</div>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`ttt-cell ${cell ? `filled-${cell}` : ''}`}
            onClick={() => handleClick(i)}
            aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ', empty'}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <button type="button" className="game-reset" onClick={reset}>
        Restart
      </button>
    </div>
  )
}

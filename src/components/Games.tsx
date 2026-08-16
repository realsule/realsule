import { TicTacToe } from '../games/TicTacToe'
import { DartGame } from '../games/DartGame'
import { ChessGame } from '../games/ChessGame'

interface GameEntry {
  id: string
  title: string
  instructions: string
  Component: () => JSX.Element
}

const games: GameEntry[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    instructions: 'Two players, one screen. Click a square to place your mark — X goes first. Get three in a row to win.',
    Component: TicTacToe,
  },
  {
    id: 'darts',
    title: 'Darts',
    instructions: 'Click anywhere on the board to throw. Bullseye scores 50, and it drops the closer you land to the edge. Three throws per round.',
    Component: DartGame,
  },
  {
    id: 'chess',
    title: 'Chess',
    instructions: 'Real rules, no AI — click a piece, then click where to move it. Legal squares are highlighted once you select a piece. Pawns always promote to a queen.',
    Component: ChessGame,
  },
]

/**
 * All three games rendered together in one grid — nothing is hidden
 * behind a tab, so a visitor can see (and play) every game at a glance.
 */
export function Games() {
  return (
    <section className="games" id="games">
      <h2>
        Take a <span className="hl2">break</span>
      </h2>
      <p className="games-lead">
        A few small games built the same way as everything else on this site — plain TypeScript,
        no backend. Play a round while you're here.
      </p>
      <div className="games-grid">
        {games.map(({ id, title, instructions, Component }) => (
          <div className="game-card" key={id}>
            <h3>{title}</h3>
            <p className="game-instructions">{instructions}</p>
            <Component />
          </div>
        ))}
      </div>
    </section>
  )
}

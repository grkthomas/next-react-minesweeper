import GameCell from './GameCell'

export default function GameBoard({ board, onCellClick, onCellRightClick, onCellDoubleClick }) {
  if (!board.length) {
    return (
      <div className="game">
        <div className="text-center">
          <i className="fas fa-play-circle fa-3x text-primary mb-3"></i>
          <h4>Click "New Game" to start playing!</h4>
          <p className="text-muted">Choose your difficulty and begin the adventure</p>
          <div className="mt-3">
            <small className="text-info">
              <i className="fas fa-info-circle me-1"></i>
              Pro tip: Double-click numbered cells to auto-reveal neighbors when correctly flagged!
            </small>
          </div>
        </div>
      </div>
    )
  }

  const cols = board[0]?.length || 0

  return (
    <div className="game">
      <div 
        className="game-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, var(--game-cell-size))`
        }}
      >
        {board.flat().map((cell, index) => (
          <GameCell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            onCellClick={onCellClick}
            onCellRightClick={onCellRightClick}
            onCellDoubleClick={onCellDoubleClick}
          />
        ))}
      </div>
    </div>
  )
}
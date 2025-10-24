export default function GameStats({ gameState, mineCount, flagCount, timer }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-2 bg-secondary flex-wrap">
      <div className="mx-3 mb-1">
        <i className="fas fa-bomb text-danger me-1"></i>
        Mines: {mineCount - flagCount}
      </div>
      <div className="mx-3 mb-1">
        <i className="fas fa-flag text-warning me-1"></i>
        Flags: {flagCount}
      </div>
      <div className="mx-3 mb-1">
        <i className="fas fa-clock text-info me-1"></i>
        Time: {timer}s
      </div>
      <div className="mx-3 mb-1">
        Status: 
        <span className={`ms-1 ${gameState === 'won' ? 'text-success' : gameState === 'lost' ? 'text-danger' : 'text-info'}`}>
          {gameState === 'playing' ? 'In Progress' : gameState === 'won' ? 'You Won!' : gameState === 'lost' ? 'Game Over' : 'Ready'}
        </span>
      </div>
    </div>
  )
}
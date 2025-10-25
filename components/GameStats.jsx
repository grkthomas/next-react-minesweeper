export default function GameStats({ gameState, mineCount, flagCount, timer }) {
  // Format timer in mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Get badge class and text for game state
  const getGameStateBadge = () => {
    switch (gameState) {
      case 'won':
        return { class: 'badge bg-success', text: '🎉 You Won!' }
      case 'lost':
        return { class: 'badge bg-danger', text: '💥 Game Over' }
      case 'playing':
        return { class: 'badge bg-primary', text: '🎮 In Progress' }
      default:
        return { class: 'badge bg-secondary', text: '⭐ Ready' }
    }
  }

  const stateBadge = getGameStateBadge()

  return (
    <div className="d-flex justify-content-center align-items-center py-2 bg-secondary flex-wrap">
      <div className="mx-3 mb-1">
        <i className="fas fa-bomb text-danger me-1"></i>
        <span> Mines: </span>
        <span className="fw-bold"> {mineCount - flagCount} </span>
      </div>
      <div className="mx-3 mb-1">
        <i className="fas fa-flag text-warning me-1"></i>
        <span> Flags: </span>
        <span className="fw-bold"> {flagCount} </span>
      </div>
      <div className="mx-3 mb-1">
        <i className="fas fa-clock text-info me-1"></i>
        <span> Time: </span>
        <span className="fw-bold font-monospace"> {formatTimer(timer)} </span>
      </div>
      <div className="mx-3 mb-1">
        <span> Status: </span>
        <span className={`ms-1 ${stateBadge.class}`}>
          <h5 className="mb-0"> {stateBadge.text} </h5>
        </span>
      </div>
    </div>
  )
}
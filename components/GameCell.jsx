export default function GameCell({ cell, onCellClick, onCellRightClick, onCellDoubleClick, isHighlighted }) {
  const getCellContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return <i className="fas fa-bomb text-danger"></i>
      }
      if (cell.neighborMines > 0) {
        return <span className={`mine-${cell.neighborMines}`}>{cell.neighborMines}</span>
      }
      return ''
    }
    if (cell.isFlagged) {
      return <i className="fas fa-flag text-warning"></i>
    }
    return ''
  }

  const getCellClass = () => {
    let baseClass = 'btn btn-sm m-0 p-1 game-cell'
    
    // Add simulation highlight
    if (isHighlighted) {
      baseClass += ' btn-warning simulation-highlight'
    } else if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += ' btn-danger'
      } else {
        baseClass += ' btn-light text-dark'
        // Add visual hint for numbered cells that can be double-clicked
        if (cell.neighborMines > 0) {
          baseClass += ' chord-clickable'
        }
      }
    } else {
      baseClass += ' btn-secondary'
    }
    return baseClass
  }

  const handleDoubleClick = () => {
    // Only allow double-click on revealed cells with numbers
    if (cell.isRevealed && !cell.isMine && cell.neighborMines > 0) {
      onCellDoubleClick(cell.row, cell.col)
    }
  }

  return (
    <button
      className={getCellClass()}
      onClick={() => onCellClick(cell.row, cell.col)}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onCellRightClick(cell.row, cell.col)
      }}
      title={cell.isRevealed && cell.neighborMines > 0 ? 'Double-click to reveal neighbors if correctly flagged' : ''}
    >
      {getCellContent()}
    </button>
  )
}
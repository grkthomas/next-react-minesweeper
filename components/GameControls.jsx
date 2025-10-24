export default function GameControls({ 
  difficulty, 
  onDifficultyChange, 
  onNewGame, 
  customRows, 
  customCols, 
  onCustomRowsChange, 
  onCustomColsChange 
}) {
  return (
    <div className="d-flex justify-content-center align-items-center py-3 border-bottom border-secondary flex-wrap">
      <button 
        onClick={onNewGame} 
        className="btn btn-primary mx-1 action-button mb-2"
      >
        <i className="fas fa-redo"></i> New Game
      </button>
      
      <button 
        onClick={() => onDifficultyChange('easy')}
        className={`btn mx-1 action-button mb-2 ${difficulty === 'easy' ? 'btn-success' : 'btn-secondary'}`}
      >
        Easy
      </button>
      
      <button 
        onClick={() => onDifficultyChange('medium')}
        className={`btn mx-1 action-button mb-2 ${difficulty === 'medium' ? 'btn-success' : 'btn-secondary'}`}
      >
        Medium
      </button>
      
      <button 
        onClick={() => onDifficultyChange('hard')}
        className={`btn mx-1 action-button mb-2 ${difficulty === 'hard' ? 'btn-success' : 'btn-secondary'}`}
      >
        Hard
      </button>
      
      <span className="vertical-divider"></span>
      
      <button 
        onClick={() => onDifficultyChange('custom')}
        className={`btn mx-1 action-button mb-2 ${difficulty === 'custom' ? 'btn-success' : 'btn-secondary'}`}
      >
        Custom
      </button>
      
      <input 
        type="number" 
        value={customRows}
        onChange={(e) => onCustomRowsChange(parseInt(e.target.value) || 5)}
        className="form-control action-input bg-secondary mx-1 mb-2" 
        step="1" 
        min="5" 
        max="50"
        placeholder="Rows"
      />
      
      <input 
        type="number" 
        value={customCols}
        onChange={(e) => onCustomColsChange(parseInt(e.target.value) || 5)}
        className="form-control action-input bg-secondary mx-1 mb-2" 
        step="1" 
        min="5" 
        max="50"
        placeholder="Cols"
      />
    </div>
  )
}
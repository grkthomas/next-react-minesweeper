// Minesweeper React App - Standalone Mount

const { useState, useEffect, useCallback } = React;

// Game configuration
const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
};

// Header Component
const Header = () => {
  return (
    <header className="bg-dark text-white p-3 border-bottom border-secondary">
      <nav className="container-fluid d-flex justify-content-between align-items-center">
        <h1 className="h3 mb-0">
          <i className="fas fa-bomb me-2"></i>
          Minesweeper
        </h1>
        <div className="text-muted">
          <small>React Standalone</small>
        </div>
      </nav>
    </header>
  );
};

// Game Controls Component
const GameControls = ({ difficulty, onDifficultyChange, onNewGame, customRows, customCols, onCustomRowsChange, onCustomColsChange }) => {
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
  );
};

// Game Cell Component
const GameCell = ({ cell, onCellClick, onCellRightClick }) => {
  const getCellContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return <i className="fas fa-bomb text-danger"></i>;
      }
      if (cell.neighborMines > 0) {
        return cell.neighborMines;
      }
      return '';
    }
    if (cell.isFlagged) {
      return <i className="fas fa-flag text-warning"></i>;
    }
    return '';
  };

  const getCellClass = () => {
    let baseClass = 'btn btn-sm m-0 p-1 game-cell';
    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += ' btn-danger';
      } else {
        baseClass += ' btn-light text-dark';
      }
    } else {
      baseClass += ' btn-secondary';
    }
    return baseClass;
  };

  return (
    <button
      className={getCellClass()}
      onClick={() => onCellClick(cell.row, cell.col)}
      onContextMenu={(e) => {
        e.preventDefault();
        onCellRightClick(cell.row, cell.col);
      }}
      style={{ width: '40px', height: '40px', fontSize: '12px' }}
    >
      {getCellContent()}
    </button>
  );
};

// Game Board Component
const GameBoard = ({ board, onCellClick, onCellRightClick }) => {
  if (!board.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <i className="fas fa-play-circle fa-3x text-primary mb-3"></i>
          <h4>Click "New Game" to start playing!</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="game p-4 d-flex justify-content-center">
      <div 
        className="game-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${board[0]?.length || 0}, 40px)`,
          gap: '2px',
          maxWidth: '90vw',
          overflow: 'auto'
        }}
      >
        {board.flat().map((cell, index) => (
          <GameCell
            key={index}
            cell={cell}
            onCellClick={onCellClick}
            onCellRightClick={onCellRightClick}
          />
        ))}
      </div>
    </div>
  );
};

// Game Stats Component
const GameStats = ({ gameState, mineCount, flagCount, timer }) => {
  return (
    <div className="d-flex justify-content-center align-items-center py-2 bg-secondary">
      <div className="mx-3">
        <i className="fas fa-bomb text-danger me-1"></i>
        Mines: {mineCount - flagCount}
      </div>
      <div className="mx-3">
        <i className="fas fa-flag text-warning me-1"></i>
        Flags: {flagCount}
      </div>
      <div className="mx-3">
        <i className="fas fa-clock text-info me-1"></i>
        Time: {timer}s
      </div>
      <div className="mx-3">
        Status: 
        <span className={`ms-1 ${gameState === 'won' ? 'text-success' : gameState === 'lost' ? 'text-danger' : 'text-info'}`}>
          {gameState === 'playing' ? 'In Progress' : gameState === 'won' ? 'You Won!' : gameState === 'lost' ? 'Game Over' : 'Ready'}
        </span>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-dark text-white p-3 border-top border-secondary">
      <div className="container text-center">
        <small>&copy; 2024 Minesweeper Game - Built with React CDN</small>
      </div>
    </footer>
  );
};

// Main Minesweeper App Component
const MinesweeperApp = () => {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
  const [difficulty, setDifficulty] = useState('easy');
  const [customRows, setCustomRows] = useState(10);
  const [customCols, setCustomCols] = useState(10);
  const [mineCount, setMineCount] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Create empty board
  const createBoard = useCallback((rows, cols, mines) => {
    const newBoard = Array(rows).fill().map((_, row) =>
      Array(cols).fill().map((_, col) => ({
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (newBoard[newRow][newCol].isMine) count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    let settings;
    if (difficulty === 'custom') {
      const mines = Math.floor((customRows * customCols) * 0.2); // 20% mines
      settings = { rows: customRows, cols: customCols, mines };
    } else {
      settings = DIFFICULTY_SETTINGS[difficulty];
    }

    const newBoard = createBoard(settings.rows, settings.cols, settings.mines);
    setBoard(newBoard);
    setGameState('ready');
    setMineCount(settings.mines);
    setFlagCount(0);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }, [difficulty, customRows, customCols, createBoard, timerInterval]);

  // Handle cell click (reveal)
  const handleCellClick = (row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[row][col].isRevealed || board[row][col].isFlagged) return;

    // Start timer on first click
    if (gameState === 'ready') {
      setGameState('playing');
      const interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
      setTimerInterval(interval);
    }

    const newBoard = [...board];
    
    // If clicked on mine, game over
    if (newBoard[row][col].isMine) {
      // Reveal all mines
      newBoard.forEach(boardRow => {
        boardRow.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true;
        });
      });
      setBoard(newBoard);
      setGameState('lost');
      clearInterval(timerInterval);
      return;
    }

    // Flood fill for empty cells
    const revealCell = (r, c) => {
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return;
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return;

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealCell(r + dr, c + dc);
          }
        }
      }
    };

    revealCell(row, col);
    setBoard(newBoard);

    // Check win condition
    const totalCells = newBoard.length * newBoard[0].length;
    const revealedCells = newBoard.flat().filter(cell => cell.isRevealed).length;
    if (revealedCells === totalCells - mineCount) {
      setGameState('won');
      clearInterval(timerInterval);
    }
  };

  // Handle right click (flag)
  const handleCellRightClick = (row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    
    const newFlagCount = newBoard.flat().filter(cell => cell.isFlagged).length;
    setFlagCount(newFlagCount);
    setBoard(newBoard);
  };

  // Initialize game on mount
  useEffect(() => {
    startNewGame();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <main className="flex-fill bg-dark">
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={startNewGame}
          customRows={customRows}
          customCols={customCols}
          onCustomRowsChange={setCustomRows}
          onCustomColsChange={setCustomCols}
        />
        
        {board.length > 0 && (
          <GameStats
            gameState={gameState}
            mineCount={mineCount}
            flagCount={flagCount}
            timer={timer}
          />
        )}
        
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      </main>
      
      <Footer />
    </div>
  );
};

// Standalone Mount - React App Entry Point
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<MinesweeperApp />);
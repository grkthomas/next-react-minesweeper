// Removed devLog imports

// Game configuration constants
export const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
}

export class GameUtil {
  /**
   * Create a new minesweeper board with mines placed randomly
   * @param {number} rows - Number of rows
   * @param {number} cols - Number of columns  
   * @param {number} mines - Number of mines to place
   * @returns {Array} 2D array representing the game board
   */
  static createBoard(rows, cols, mines) {
    const newBoard = Array(rows).fill(null).map((_, row) =>
      Array(cols).fill(null).map((_, col) => ({
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    )

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (newBoard[newRow][newCol].isMine) count++
              }
            }
          }
          newBoard[row][col].neighborMines = count
        }
      }
    }

    return newBoard
  }

  /**
   * Get difficulty settings for a given difficulty level
   * @param {string} difficulty - 'easy', 'medium', 'hard', or 'custom'
   * @param {number} customRows - Custom rows (for custom difficulty)
   * @param {number} customCols - Custom cols (for custom difficulty)
   * @returns {Object} Settings object with rows, cols, mines
   */
  static getDifficultySettings(difficulty, customRows = 10, customCols = 10) {
    if (difficulty === 'custom') {
      const mines = Math.floor((customRows * customCols) * 0.2) // 20% mines
      return { rows: customRows, cols: customCols, mines }
    }
    return DIFFICULTY_SETTINGS[difficulty]
  }

  /**
   * Flood fill algorithm to reveal connected empty cells
   * @param {Array} board - Current game board
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @returns {Array} Updated board with revealed cells
   */
  static floodFillReveal(board, startRow, startCol) {
    const newBoard = board.map(row => [...row])
    
    const revealCell = (r, c) => {
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return

      newBoard[r][c].isRevealed = true

      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealCell(r + dr, c + dc)
          }
        }
      }
    }

    revealCell(startRow, startCol)
    return newBoard
  }

  /**
   * Handle a cell click and return the updated game state
   * @param {Array} board - Current game board
   * @param {number} row - Row of clicked cell
   * @param {number} col - Column of clicked cell
   * @param {number} mineCount - Total number of mines
   * @param {boolean} isSimulated - Whether this is a simulated click
   * @returns {Object} Result with newBoard, gameState, shouldStopTimer
   */
  static handleCellClick(board, row, col, mineCount, isSimulated = false) {
    
    if (board[row][col].isRevealed || board[row][col].isFlagged) {
      return { newBoard: board, gameState: null, shouldStopTimer: false }
    }

    // If clicked on mine, game over
    if (board[row][col].isMine) {
      const newBoard = board.map(boardRow => [...boardRow])
      
      // Reveal all mines
      newBoard.forEach(boardRow => {
        boardRow.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true
        })
      })
      
      return { 
        newBoard, 
        gameState: 'lost', 
        shouldStopTimer: true 
      }
    }

    // Safe cell - use flood fill to reveal
    const newBoard = GameUtil.floodFillReveal(board, row, col)
    
    // Check win condition
    const totalCells = newBoard.length * newBoard[0].length
    const revealedCells = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isRevealed).length, 0)
    
    if (revealedCells === totalCells - mineCount) {
      return { 
        newBoard, 
        gameState: 'won', 
        shouldStopTimer: true 
      }
    }

    return { 
      newBoard, 
      gameState: null, 
      shouldStopTimer: false 
    }
  }

  /**
   * Handle chord clicking (double-click on numbered cell)
   * @param {Array} board - Current game board
   * @param {number} row - Row of clicked cell
   * @param {number} col - Column of clicked cell
   * @param {number} mineCount - Total number of mines
   * @returns {Object} Result with newBoard, gameState, shouldStopTimer
   */
  static handleChordClick(board, row, col, mineCount) {
    const cell = board[row][col]
    
    // Only work on revealed cells with numbers
    if (!cell.isRevealed || cell.isMine || cell.neighborMines === 0) {
      return { newBoard: board, gameState: null, shouldStopTimer: false }
    }

    // Get all neighboring cells
    const neighbors = []
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < board.length && 
            newCol >= 0 && newCol < board[0].length && 
            !(dr === 0 && dc === 0)) {
          neighbors.push({ row: newRow, col: newCol, cell: board[newRow][newCol] })
        }
      }
    }

    // Count flags among neighbors
    const flaggedNeighbors = neighbors.filter(n => n.cell.isFlagged).length
    
    // Only proceed if flag count matches the number on the cell
    if (flaggedNeighbors !== cell.neighborMines) {
      return { newBoard: board, gameState: null, shouldStopTimer: false }
    }

    // Get unflagged, unrevealed neighbors to reveal
    const cellsToReveal = neighbors.filter(n => !n.cell.isFlagged && !n.cell.isRevealed)
    
    if (cellsToReveal.length === 0) {
      return { newBoard: board, gameState: null, shouldStopTimer: false }
    }

    const newBoard = board.map(row => [...row])
    let hitMine = false

    // Reveal all unflagged neighbors
    for (const neighborData of cellsToReveal) {
      const { row: nRow, col: nCol } = neighborData
      
      if (newBoard[nRow][nCol].isMine) {
        // Hit a mine - reveal all mines
        newBoard.forEach(boardRow => {
          boardRow.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true
          })
        })
        hitMine = true
        break
      } else {
        // Safe cell - use flood fill to reveal
        const floodFilledBoard = GameUtil.floodFillReveal(newBoard, nRow, nCol)
        // Copy the flood fill results back
        for (let r = 0; r < floodFilledBoard.length; r++) {
          for (let c = 0; c < floodFilledBoard[0].length; c++) {
            newBoard[r][c] = floodFilledBoard[r][c]
          }
        }
      }
    }

    if (hitMine) {
      return { 
        newBoard, 
        gameState: 'lost', 
        shouldStopTimer: true 
      }
    } else {
      // Check win condition
      const totalCells = newBoard.length * newBoard[0].length
      const revealedCells = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isRevealed).length, 0)
      if (revealedCells === totalCells - mineCount) {
        return { 
          newBoard, 
          gameState: 'won', 
          shouldStopTimer: true 
        }
      }
    }

    return { 
      newBoard, 
      gameState: null, 
      shouldStopTimer: false 
    }
  }

  /**
   * Handle right click (flagging)
   * @param {Array} board - Current game board
   * @param {number} row - Row of clicked cell
   * @param {number} col - Column of clicked cell
   * @returns {Object} Result with newBoard and flagCount
   */
  static handleRightClick(board, row, col) {
    if (board[row][col].isRevealed) {
      return { newBoard: board, flagCount: null }
    }

    const newBoard = board.map(row => [...row])
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    
    const flagCount = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isFlagged).length, 0)
    
    return { newBoard, flagCount }
  }

  /**
   * Complete click handler that manages all click logic including validation,
   * state management, timer handling, and simulation history
   * @param {Object} params - Parameters object
   * @returns {Object} Result object with actions to perform
   */
  static handleCompleteClick(params) {
    const {
      clickType, // 'left', 'right', 'double'
      row,
      col,
      // Current state (from refs for simulation safety)
      currentBoard,
      currentGameState,
      currentMineCount,
      currentTimerInterval,
      // Additional options
      isSimulated = false,
      // Utility imports
      SimulationUtil
    } = params

    // Early validation - game already ended
    if (currentGameState === 'won' || currentGameState === 'lost') {
      return { actions: [] }
    }

    // Validate board structure and bounds
    if (!currentBoard || !Array.isArray(currentBoard) || currentBoard.length === 0 ||
        row < 0 || row >= currentBoard.length ||
        !Array.isArray(currentBoard[row]) || col < 0 || col >= currentBoard[row].length) {
      console.error(`Invalid board access at (${row}, ${col}). Board structure:`, currentBoard)
      return { actions: [] }
    }

    const actions = []

    // Handle different click types
    if (clickType === 'right') {
      const result = GameUtil.handleRightClick(currentBoard, row, col)
      if (result.newBoard !== currentBoard) {
        actions.push({ type: 'setBoard', payload: result.newBoard })
      }
      if (result.flagCount !== null) {
        actions.push({ type: 'setFlagCount', payload: result.flagCount })
      }
      return { actions }
    }

    if (clickType === 'double') {
      const result = GameUtil.handleChordClick(currentBoard, row, col, currentMineCount)
      
      if (result.newBoard !== currentBoard) {
        actions.push({ type: 'setBoard', payload: result.newBoard })
      }
      
      if (result.gameState) {
        actions.push({ type: 'setGameState', payload: result.gameState })
      }
      
      if (result.shouldStopTimer && currentTimerInterval) {
        actions.push({ type: 'stopTimer' })
      }
      
      return { actions }
    }

    // Handle left click (main click)
    if (clickType === 'left') {
      // Add simulation history if simulated
      if (isSimulated && SimulationUtil) {
        const clickInfo = SimulationUtil.createHistoryEntry(row, col, currentBoard[row][col])
        actions.push({ type: 'addSimulationHistory', payload: clickInfo })
      }

      // Start timer on first click (game state transitions from ready to playing)
      if (currentGameState === 'ready') {
        actions.push({ type: 'setGameState', payload: 'playing' })
        actions.push({ type: 'startTimer' })
      }

      // Process the actual click
      const result = GameUtil.handleCellClick(currentBoard, row, col, currentMineCount, isSimulated)

      if (result.newBoard) {
        actions.push({ type: 'setBoard', payload: result.newBoard })
      }

      if (result.gameState) {
        // Log terminal outcomes for visibility
        if (result.gameState === 'won' || result.gameState === 'lost') {
          if (isSimulated) {
            const clickedCell = currentBoard[row][col]
            if (result.gameState === 'lost') {
              console.log(`💥 Fatal move at (${row}, ${col}) - ${clickedCell.isMine ? 'mine' : 'safe'} -> GAME OVER`)
            } else {
              console.log('🏆 Game won by simulation')
            }
          }
          console.log(`🛑 Game ended with state: ${result.gameState}`)
        }
        
        actions.push({ type: 'setGameState', payload: result.gameState })
      }

      // Handle timer stopping
      if (result.shouldStopTimer || (result.gameState === 'won' || result.gameState === 'lost')) {
        if (currentTimerInterval) {
          actions.push({ type: 'stopTimer' })
        }
      }

      return { actions }
    }

    return { actions: [] }
  }
}

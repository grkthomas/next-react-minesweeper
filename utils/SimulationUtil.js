// utils/SimulationUtil.js

/** 
 * Utility functions for managing game simulations.
 * The purpose of the simulator is to provide a proof-of-concept automated player
 * that can interact with the Minesweeper game board for testing or demonstration purposes.
 * 
 * Said proof-of-concept will be used to build a more advanced automated player in the future by replacing 
 * the selectRandomCell() with smarter logic.
 * 
 * It supports flag-based simulations where cells are selected and clicked based on simple heuristics.
 * The simulation can be started, stopped, and will automatically halt when the game ends.
 */




export class SimulationUtil {
  /**
   * Create a flag-based simulation manager
   * @param {Object} callbacks - Object containing required callback functions
   * @param {Function} callbacks.getCurrentState - Function returning {gameState, board}
   * @param {Function} callbacks.handleCellClick - Cell click handler
   * @param {Function} callbacks.setHighlightedCell - Highlighted cell setter
   * @param {Function} callbacks.setIsSimulating - Simulation state setter  
   * @param {Function} callbacks.setSimulationInterval - Interval setter
   * @returns {Object} Simulation manager with methods
   */

  static INTERVAL_TIME = 2000

  static createFlagBasedSimulation(callbacks) {
    const {
      getCurrentState,
      handleCellClick,
      setHighlightedCell,
      setIsSimulating
    } = callbacks

    // Internal simulation flags
    const simulationFlags = {
      step: 'idle',
      selectedCell: null,
      shouldStop: false
    }

    // Promise-based delay helper
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    // Track running async loop
    let runningPromise = null

    // Note: interval-based executeStep removed; async runner below is the source of truth

    /**
     * Start the flag-based simulation
     * @param {number} stepInterval - Interval between steps in ms (default: 500)
     * @returns {boolean} true if started successfully, false otherwise
     */
    // Note: interval-based start removed; use startAsync instead

    /**
     * Promise-based simulation without setInterval. Runs sequentially with awaits.
     * @param {number} stepInterval - Total time per iteration (ms)
     * @param {number} highlightMs - Highlight duration (ms)
     * @param {number} deadMs - Dead time after click (ms)
     */
    const startAsync = (stepInterval = INTERVAL_TIME, highlightMs, deadMs) => {
      const { gameState, board } = getCurrentState()

      // Validate board before starting
      if (!board || !Array.isArray(board) || board.length === 0) {
        console.error('🚨 Cannot start async simulation - invalid board:', board)
        return false
      }

      if (gameState === 'won' || gameState === 'lost') {
        console.log('❌ Cannot start async simulation - game already ended')
        return false
      }

      // If already running, ignore duplicate starts
      if (runningPromise) {
        console.log('ℹ️ Async simulation already running')
        return true
      }

      // Derive per-phase durations from total stepInterval if not provided
      const hMs = typeof highlightMs === 'number' ? highlightMs : Math.floor(stepInterval / 2)
      const dMs = typeof deadMs === 'number' ? deadMs : (stepInterval - hMs)
      console.log(`▶️ STARTING ASYNC SIMULATION with ${stepInterval}ms steps (highlight=${hMs}ms, dead=${dMs}ms)`)

      // Reset flags
      simulationFlags.step = 'idle'
      simulationFlags.selectedCell = null
      simulationFlags.shouldStop = false

      setIsSimulating(true)
      // No interval used in async mode

      runningPromise = (async () => {
        try {
          while (true) {
            if (simulationFlags.shouldStop) break

            const { gameState: gs, board: b } = getCurrentState()
            if (!b || !Array.isArray(b) || b.length === 0) break
            if (gs === 'won' || gs === 'lost') break

            // Step 1: choose cell
            const cells = SimulationUtil.getUnrevealedCells(b)
            if (cells.length === 0) break
            const cell = SimulationUtil.selectRandomCell(cells)
            console.log(`🎯 [ASYNC] Selected cell: (${cell.row}, ${cell.col})`)

            // Step 2: highlight
            setHighlightedCell(`${cell.row}-${cell.col}`)
            await delay(hMs)
            setHighlightedCell(null)

            // Step 3: click
            handleCellClick(cell.row, cell.col, true)

            // Step 4: wait
            await delay(dMs)
          }
        } finally {
          // Cleanup
          setIsSimulating(false)
          setHighlightedCell(null)
          simulationFlags.step = 'idle'
          runningPromise = null
          console.log('🧹 Async simulation cleanup complete')
        }
      })()

      return true
    }

    /**
     * Stop the simulation manually
     */
    // Note: interval-based stop removed; use stopAsync instead

    // Stop async loop
    const stopAsync = () => {
      console.log('🛑 MANUAL STOP (async) - stopping simulation')
      simulationFlags.shouldStop = true
      simulationFlags.step = 'idle'
    }

    /**
     * Stop simulation due to game end
     */
    // Note: interval-based stopOnGameEnd removed; use stopOnGameEndAsync instead

    const stopOnGameEndAsync = (gameState) => {
      console.log(`🎮 GAME ENDED (${gameState}) - stopping async simulation`)
      simulationFlags.shouldStop = true
      simulationFlags.step = 'idle'
    }

    return {
      startAsync,
      stopAsync,
      stopOnGameEndAsync,
      getFlags: () => simulationFlags
    }
  }
  /**
   * Get all unrevealed, unflagged cells available for simulation
   * @param {Array} board - Current game board
   * @returns {Array} Array of {row, col} objects for clickable cells
   */
  static getUnrevealedCells(board) {
    const unrevealedCells = []

    // Validate board structure
    if (!board || !Array.isArray(board) || board.length === 0) {
      console.error('🚨 Invalid board in getUnrevealedCells:', board)
      return unrevealedCells
    }

    board.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) {
        console.error(`🚨 Invalid row ${rowIndex}:`, row)
        return
      }

      row.forEach((cell, colIndex) => {
        if (!cell || typeof cell !== 'object') {
          console.error(`🚨 Invalid cell at (${rowIndex}, ${colIndex}):`, cell)
          return
        }

        if (!cell.isRevealed && !cell.isFlagged) {
          unrevealedCells.push({ row: rowIndex, col: colIndex })
        }
      })
    })
    return unrevealedCells
  }

  /**
   * Select a random cell from available unrevealed cells
   * @param {Array} unrevealedCells - Array of available cells
   * @returns {Object|null} Random cell {row, col} or null if no cells available
   */
  static selectRandomCell(unrevealedCells) {
    if (unrevealedCells.length === 0) return null

    const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)]
    return randomCell
  }

  /**
   * Check if simulation should continue
   * @param {string} gameState - Current game state ('ready', 'playing', 'won', 'lost')
   * @param {Array} board - Current game board
   * @returns {Object} {shouldContinue: boolean, reason: string}
   */
  static shouldContinueSimulation(gameState, board) {
    if (gameState === 'won' || gameState === 'lost') {
      return {
        shouldContinue: false,
        reason: `Game ended with state: ${gameState}`
      }
    }

    const unrevealedCells = SimulationUtil.getUnrevealedCells(board)
    if (unrevealedCells.length === 0) {
      return {
        shouldContinue: false,
        reason: 'No more cells to reveal'
      }
    }

    return {
      shouldContinue: true,
      reason: `${unrevealedCells.length} cells remaining`
    }
  }

  /**
   * Create a simulation history entry
   * @param {number} row - Cell row
   * @param {number} col - Cell column
   * @param {Object} cell - Cell object from board
   * @returns {Object} History entry object
   */
  static createHistoryEntry(row, col, cell) {
    const historyEntry = {
      timestamp: new Date().toLocaleTimeString(),
      row,
      col,
      cellType: cell.isMine ? 'mine' : cell.neighborMines === 0 ? 'empty' : `number-${cell.neighborMines}`,
      result: cell.isMine ? 'BOOM!' : 'safe'
    }

    return historyEntry
  }

  // Interval-based helpers removed (executeSimulationStep, cleanupSimulation, createSimulationStep, startSimulation)
}

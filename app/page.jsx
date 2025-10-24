'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import GameControls from '../components/GameControls'
import GameStats from '../components/GameStats'
import GameBoard from '../components/GameBoard'
import Footer from '../components/Footer'

// Game configuration
const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
}

export default function MinesweeperPage() {
  const [board, setBoard] = useState([])
  const [gameState, setGameState] = useState('ready') // ready, playing, won, lost
  const [difficulty, setDifficulty] = useState('easy')
  const [customRows, setCustomRows] = useState(10)
  const [customCols, setCustomCols] = useState(10)
  const [mineCount, setMineCount] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)

  // Create empty board
  const createBoard = useCallback((rows, cols, mines) => {
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
  }, [])

  // Start new game
  const startNewGame = useCallback(() => {
    let settings
    if (difficulty === 'custom') {
      const mines = Math.floor((customRows * customCols) * 0.2) // 20% mines
      settings = { rows: customRows, cols: customCols, mines }
    } else {
      settings = DIFFICULTY_SETTINGS[difficulty]
    }

    const newBoard = createBoard(settings.rows, settings.cols, settings.mines)
    setBoard(newBoard)
    setGameState('ready')
    setMineCount(settings.mines)
    setFlagCount(0)
    setTimer(0)
    
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  }, [difficulty, customRows, customCols, createBoard, timerInterval])

  // Handle cell click (reveal)
  const handleCellClick = (row, col) => {
    if (gameState === 'won' || gameState === 'lost') return
    if (board[row][col].isRevealed || board[row][col].isFlagged) return

    // Start timer on first click
    if (gameState === 'ready') {
      setGameState('playing')
      const interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
      setTimerInterval(interval)
    }

    const newBoard = [...board.map(row => [...row])]
    
    // If clicked on mine, game over
    if (newBoard[row][col].isMine) {
      // Reveal all mines
      newBoard.forEach(boardRow => {
        boardRow.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true
        })
      })
      setBoard(newBoard)
      setGameState('lost')
      if (timerInterval) clearInterval(timerInterval)
      return
    }

    // Flood fill for empty cells
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

    revealCell(row, col)
    setBoard(newBoard)

    // Check win condition
    const totalCells = newBoard.length * newBoard[0].length
    const revealedCells = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isRevealed).length, 0)
    if (revealedCells === totalCells - mineCount) {
      setGameState('won')
      if (timerInterval) clearInterval(timerInterval)
    }
  }

  // Handle right click (flag)
  const handleCellRightClick = (row, col) => {
    if (gameState === 'won' || gameState === 'lost') return
    if (board[row][col].isRevealed) return

    const newBoard = [...board.map(row => [...row])]
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    
    const newFlagCount = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isFlagged).length, 0)
    setFlagCount(newFlagCount)
    setBoard(newBoard)
  }

  // Handle double click (chord clicking / auto-reveal neighbors)
  const handleCellDoubleClick = (row, col) => {
    if (gameState === 'won' || gameState === 'lost') return
    
    const cell = board[row][col]
    
    // Only work on revealed cells with numbers
    if (!cell.isRevealed || cell.isMine || cell.neighborMines === 0) return

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
    if (flaggedNeighbors !== cell.neighborMines) return

    // Get unflagged, unrevealed neighbors to reveal
    const cellsToReveal = neighbors.filter(n => !n.cell.isFlagged && !n.cell.isRevealed)
    
    if (cellsToReveal.length === 0) return

    const newBoard = [...board.map(row => [...row])]
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
        const revealCell = (r, c) => {
          if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return
          if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return

          newBoard[r][c].isRevealed = true

          // If it's an empty cell (no neighboring mines), reveal its neighbors too
          if (newBoard[r][c].neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                revealCell(r + dr, c + dc)
              }
            }
          }
        }

        revealCell(nRow, nCol)
      }
    }

    setBoard(newBoard)

    if (hitMine) {
      setGameState('lost')
      if (timerInterval) clearInterval(timerInterval)
    } else {
      // Check win condition
      const totalCells = newBoard.length * newBoard[0].length
      const revealedCells = newBoard.reduce((acc, row) => acc + row.filter(cell => cell.isRevealed).length, 0)
      if (revealedCells === totalCells - mineCount) {
        setGameState('won')
        if (timerInterval) clearInterval(timerInterval)
      }
    }
  }

  // Initialize game on mount
  useEffect(() => {
    startNewGame()
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [])

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty)
  }

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
          onCellDoubleClick={handleCellDoubleClick}
        />
      </main>
      
      <Footer />
    </div>
  )
}
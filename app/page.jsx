'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import GameControls from '../components/GameControls'
import GameStats from '../components/GameStats'
import GameBoard from '../components/GameBoard'
import SimulationSidebar from '../components/SimulationSidebar'
import Footer from '../components/Footer'
import { GameUtil } from '../utils/GameUtil'
import { SimulationUtil } from '../utils/SimulationUtil'

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
  const [isSimulating, setIsSimulating] = useState(false)
  // Interval removed in async simulation mode
  const [highlightedCell, setHighlightedCell] = useState(null)
  const [simulationHistory, setSimulationHistory] = useState([])
  
  // Refs to track current state for simulation (avoid closure issues)
  const gameStateRef = useRef(gameState)
  const boardRef = useRef(board)
  const mineCountRef = useRef(mineCount)
  const timerIntervalRef = useRef(timerInterval)
  const isSimulatingRef = useRef(isSimulating)
  // Interval ref not needed in async mode
  
  // Update refs when state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])
  
  useEffect(() => {
    boardRef.current = board
  }, [board])

  // Keep additional refs in sync
  useEffect(() => { mineCountRef.current = mineCount }, [mineCount])
  useEffect(() => { timerIntervalRef.current = timerInterval }, [timerInterval])
  useEffect(() => { isSimulatingRef.current = isSimulating }, [isSimulating])
  // No simulation interval to sync in async mode

  // Start new game
  const startNewGame = useCallback(() => {
    // Stop any ongoing simulation
    // No interval to clear in async mode
    setIsSimulating(false)
    setHighlightedCell(null)
    setSimulationHistory([])
    
    // Get difficulty settings using GameUtil
    const settings = GameUtil.getDifficultySettings(difficulty, customRows, customCols)
    
    // Create new board using GameUtil
    const newBoard = GameUtil.createBoard(settings.rows, settings.cols, settings.mines)
    setBoard(newBoard)
    setGameState('ready')
    setMineCount(settings.mines)
    setFlagCount(0)
    setTimer(0)
    
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [difficulty, customRows, customCols, timerInterval])

  // Unified click handler using GameUtil
  const processClickActions = useCallback((actions) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'setBoard':
          setBoard(action.payload)
          break
        case 'setGameState':
          setGameState(action.payload)
          break
        case 'setFlagCount':
          setFlagCount(action.payload)
          break
        case 'startTimer':
          const interval = setInterval(() => {
            setTimer(t => t + 1)
          }, 1000)
          setTimerInterval(interval)
          break
        case 'stopTimer':
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            setTimerInterval(null)
            timerIntervalRef.current = null
          }
          break
        case 'addSimulationHistory':
          setSimulationHistory(prev => [...prev, action.payload])
          break
      }
    })
  }, [])

  // Handle cell click (reveal) - Clean version using GameUtil
  const handleCellClick = useCallback((row, col, isSimulated = false) => {
    const result = GameUtil.handleCompleteClick({
      clickType: 'left',
      row,
      col,
      currentBoard: boardRef.current,
      currentGameState: gameStateRef.current,
      currentMineCount: mineCountRef.current,
      currentTimerInterval: timerIntervalRef.current,
      isSimulated,
      SimulationUtil
    })
    
    processClickActions(result.actions)
  }, [processClickActions])

  // Handle right click (flag) - Clean version using GameUtil
  const handleCellRightClick = useCallback((row, col) => {
    const result = GameUtil.handleCompleteClick({
      clickType: 'right',
      row,
      col,
      currentBoard: boardRef.current,
      currentGameState: gameStateRef.current,
      currentMineCount: mineCountRef.current,
      currentTimerInterval: timerIntervalRef.current
    })
    
    processClickActions(result.actions)
  }, [processClickActions])

  // Handle double click (chord clicking / auto-reveal neighbors) - Clean version using GameUtil  
  const handleCellDoubleClick = useCallback((row, col) => {
    const result = GameUtil.handleCompleteClick({
      clickType: 'double',
      row,
      col,
      currentBoard: boardRef.current,
      currentGameState: gameStateRef.current,
      currentMineCount: mineCountRef.current,
      currentTimerInterval: timerIntervalRef.current
    })
    
    processClickActions(result.actions)
  }, [processClickActions])

  // Initialize game on mount
  useEffect(() => {
    startNewGame()
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [timerInterval])

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty)
  }

  // Flag-based simulation manager
  const simulationManager = useRef(null)

  // Initialize simulation manager
  if (!simulationManager.current) {
    simulationManager.current = SimulationUtil.createFlagBasedSimulation({
      getCurrentState: () => ({ gameState: gameStateRef.current, board: boardRef.current }),
      handleCellClick,
      setHighlightedCell,
      setIsSimulating
    })
  }

  // Simulation logic is now handled by SimulationUtil

  // Simulation toggle logic using SimulationUtil
  const handleSimulateToggle = useCallback(() => {
    if (isSimulating) {
      // Stop simulation manually (async path)
      simulationManager.current.stopAsync()
    } else {
      // Validate board before starting simulation
      if (!board || !Array.isArray(board) || board.length === 0) {
        console.error('🚨 Cannot start simulation - board not ready:', board)
        return
      }
      
      // Start async simulation with default interval (configured in SimulationUtil)
      simulationManager.current.startAsync()
    }
  }, [isSimulating, board])

  // Stop simulation when game ends
  useEffect(() => {
    if ((gameState === 'won' || gameState === 'lost') && isSimulating) {
      simulationManager.current.stopOnGameEndAsync(gameState)
    }
  }, [gameState, isSimulating])

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
          isSimulating={isSimulating}
          onSimulateToggle={handleSimulateToggle}
          gameState={gameState}
        />
        
        {board.length > 0 && (
          <GameStats
            gameState={gameState}
            mineCount={mineCount}
            flagCount={flagCount}
            timer={timer}
          />
        )}
        
        <div className="game">
          <div className={(isSimulating || simulationHistory.length > 0) ? "game-with-sidebar" : ""}>
            <SimulationSidebar 
              simulationHistory={simulationHistory}
              isVisible={isSimulating || simulationHistory.length > 0}
            />
            
            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              onCellDoubleClick={handleCellDoubleClick}
              highlightedCell={highlightedCell}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

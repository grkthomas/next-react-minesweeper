# Next.js - React - Minesweeper

A modern Minesweeper game built with Next.js, React, and Bootstrap 5 with a beautiful dark theme.

## Features

- 🎮 **Classic Minesweeper Gameplay**: Traditional mine-sweeping with modern UI
- ⚡ **Advanced Features**: Chord-clicking and flood fill algorithms
- 🎯 **Multiple Difficulty Levels**: Easy, Medium, Hard, and Custom grid sizes
- 🎨 **Dark Theme**: Beautiful dark mode with Bootstrap 5
- ⏱️ **Timer & Statistics**: Track your time, mines, and flags
- 🤖 **Autoplay Simulator**: Watch an automated player highlight moves and log every click
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Next.js Powered**: Fast, optimized React application
- 🎪 **Visual Enhancements**: Chord-click indicators and hover effects
- 🏆 **Persistent Scoreboard**: Save your best times to a local SQLite database and view the top results

## Game Rules

### Basic Controls
- **Left Click**: Reveal a cell
- **Right Click**: Flag/unflag a cell as a potential mine
- **Double Click**: Chord-click (auto-reveal neighbors when correctly flagged)

### Objective
- **Goal**: Reveal all cells that don't contain mines
- **Win Condition**: All non-mine cells revealed
- **Lose Condition**: Click on a mine

### Advanced Features
- **Chord-Clicking**: Double-click any revealed numbered cell when you have the correct number of flags around it to auto-reveal all unflagged neighbors
- **Flood Fill**: Clicking empty cells (0 neighboring mines) automatically reveals connected safe areas
- **Visual Hints**: Numbered cells show a blue dot indicator when they can be chord-clicked

### Simulation Mode
- **Toggle Autoplay**: Use the `Simulate` button in the controls to let an automated player pick random unrevealed cells while the board highlights the next move.
- **Live Click Log**: A sidebar appears during or after simulation runs, capturing timestamps, coordinates, cell types, and whether each click was safe or a mine.
- **Automatic Shutdown**: The simulator stops itself when you end it manually, win, lose, or start a brand-new game, ensuring normal play resumes instantly.

## Difficulty Levels

| Difficulty | Grid Size | Mines |
|------------|-----------|-------|
| Easy       | 9×9       | 10    |
| Medium     | 16×16     | 40    |
| Hard       | 16×30     | 99    |
| Custom     | Variable  | 20%   |

## Getting Started

### Prerequisites

- **Node.js 18+** (Latest LTS recommended)
- **npm 8+** or **yarn 1.22+**
- **Git** (for cloning)

### Installation Guide

#### **Standard Installation**

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd minesweeper-nextjs
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Scoreboard Storage (SQLite)

This project stores scores locally using SQLite via `better-sqlite3`.

- Database file: `data/scores.sqlite` (created on first run)
- API endpoints:
   - `GET /api/scores?limit=10&size=9x9` — fetch top scores (fastest times), optional `size` filter
   - `POST /api/scores` — body: `{ name: string, mines: number, size: string, time: number }`
- Table schema: `scores(id, name, mines, size, time, created_at)`

When you win a game, you'll be prompted to enter your name to save your score. The scoreboard component displays the top results and can be refreshed.

#### **WSL2/Linux Troubleshooting Installation**

If you encounter issues with `npm install` (especially on WSL2), try this step-by-step approach:

1. **Clean Previous Attempts**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   ```

2. **Configure npm for WSL2**
   ```bash
   npm config set fetch-retry-mintimeout 20000
   npm config set fetch-retry-maxtimeout 120000
   npm config set fetch-timeout 300000
   ```

3. **Install Dependencies Sequentially** (Recommended for WSL2)
   ```bash
   # Install core React dependencies first
   npm install react@^18.2.0 --no-audit --no-fund --legacy-peer-deps
   
   # Install React DOM
   npm install react-dom@^18.2.0 --no-audit --no-fund --legacy-peer-deps
   
   # Install Bootstrap
   npm install bootstrap@^5.3.2 --no-audit --no-fund --legacy-peer-deps
   
   # Install Next.js
   npm install next@latest --no-audit --no-fund --legacy-peer-deps
   ```

4. **Alternative: Use Yarn** (Often more reliable on WSL2)
   ```bash
   npm install -g yarn
   yarn install
   ```

#### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| `ENOTEMPTY: directory not empty` | Delete `node_modules` and retry with sequential installation |
| Timeout errors | Increase timeout settings and use `--legacy-peer-deps` |
| Permission errors | Use `sudo` carefully or fix npm permissions |
| WSL2 filesystem issues | Install dependencies sequentially, avoid large batch installs |
| Network connectivity | Check firewall, try different registry: `npm config set registry https://registry.npmjs.org/` |

#### **Verification Steps**

After successful installation, verify your setup:

```bash
# Check installed packages
npm list --depth=0

# Expected output should include:
# ├── bootstrap@5.3.x
# ├── next@16.x.x
# ├── react-dom@18.x.x
# └── react@18.x.x

# Test development server
npm run dev
```

#### **Environment-Specific Notes**

- **Windows/WSL2**: Use sequential installation method
- **macOS**: Standard installation usually works
- **Linux**: May need sequential installation for complex dependency trees
- **Docker**: Consider using Node.js Alpine images for smaller footprint

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Static Export (Note)

Static export (`output: 'export'`) is not compatible with API routes or the SQLite scoreboard. To use the scoreboard, run the app with the Node server:

```bash
npm run build
npm start
```

If you do want a pure static export, you must remove the scoreboard feature (or switch to a client-only storage approach).

### Advanced Troubleshooting

#### **If npm install Still Fails:**

1. **Check Node.js Version**
   ```bash
   node --version  # Should be 18+ 
   npm --version   # Should be 8+
   ```

2. **Clear All npm Cache**
   ```bash
   npm cache clean --force
   npm cache verify
   ```

3. **Use Different Package Manager**
   ```bash
   # Try pnpm (often works better than npm)
   npm install -g pnpm
   pnpm install
   
   # Or try yarn
   npm install -g yarn  
   yarn install
   ```

4. **Manual Dependency Resolution**
   ```bash
   # Install peer dependencies manually
   npm install react react-dom
   npm install next
   npm install bootstrap
   npm install eslint eslint-config-next
   ```

#### **WSL2-Specific Solutions:**

- **Move project to Linux filesystem**: `/home/user/` instead of `/mnt/c/`
- **Disable Windows Defender real-time scanning** for the project directory
- **Use Windows Terminal** instead of VS Code integrated terminal
- **Update WSL2**: `wsl --update` in Windows PowerShell

## Project Structure

```
minesweeper-nextjs/
├── app/
│   ├── layout.jsx          # Root layout with Bootstrap & theming
│   ├── page.jsx            # Main game page with logic
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── Header.jsx          # App header component
│   ├── GameControls.jsx    # Game controls (difficulty, new game)
│   ├── GameStats.jsx       # Game statistics display
│   ├── GameBoard.jsx       # Game board container
│   ├── GameCell.jsx        # Individual game cell
│   └── Footer.jsx          # App footer
├── package.json            # Dependencies & scripts
├── next.config.js          # Next.js configuration
└── README.md              # This file
```

## Technologies Used

- **Next.js 16**: React framework with App Router and Turbopack
- **React 18**: UI library with modern hooks
- **Bootstrap 5**: CSS framework with dark theme
- **Font Awesome**: Icons for enhanced UI
- **CSS Custom Properties**: Theme customization
- **JavaScript ES6+**: Modern JavaScript with recursive algorithms

## Customization

### Theme Colors

All colors are defined as CSS custom properties in `app/globals.css`:

```css
:root {
  --primary-bg: #212529;
  --secondary-bg: #343a40;
  --accent-bg: #495057;
  /* ... modify these to change the theme */
}
```

### Game Settings

Modify difficulty settings in `app/page.jsx`:

```javascript
const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms

```bash
npm run build
```

Deploy the generated files to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Algorithm Deep Dive: Flood Fill Implementation

### 🌊 **What is Flood Fill?**

Flood fill is a **recursive algorithm** that automatically reveals large areas of safe cells when you click on an "empty" cell (a cell with 0 neighboring mines). It's like water flooding through connected empty spaces.

### 🎯 **Where It's Applied in the Project:**

The flood fill algorithm is implemented in **TWO locations** in the minesweeper project:

#### **1. Primary Location: `handleCellClick` Function**
```javascript
// Lines 125-142 in app/page.jsx
const revealCell = (r, c) => {
  // Boundary and safety checks
  if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return
  if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return

  // Reveal the current cell
  newBoard[r][c].isRevealed = true

  // THE MAGIC: If this cell has 0 neighboring mines, flood fill to neighbors
  if (newBoard[r][c].neighborMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(r + dr, c + dc)  // Recursive call!
      }
    }
  }
}
```

#### **2. Secondary Location: `handleCellDoubleClick` Function (Chord-Clicking)**
```javascript
// Same algorithm used in chord-clicking for auto-revealing neighbors
const revealCell = (r, c) => {
  if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return
  if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return

  newBoard[r][c].isRevealed = true

  // Same flood fill logic for chord-clicking
  if (newBoard[r][c].neighborMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(r + dr, c + dc)
      }
    }
  }
}
```

### 🔄 **How the Algorithm Works Step-by-Step:**

1. **Initial Click**: Player clicks on a cell
2. **Safety Check**: Verify it's not a mine, not already revealed, not flagged
3. **Reveal Cell**: Mark the clicked cell as revealed
4. **Check Neighbor Count**: If `neighborMines === 0` (empty cell):
5. **Recursive Expansion**: Call `revealCell()` on all 8 neighboring cells
6. **Boundary Protection**: Each recursive call checks boundaries and stops conditions
7. **Chain Reaction**: The process continues until it hits numbered cells (1-8) or boundaries

### 📊 **Visual Example:**

```
Before Click:        After Click on Empty Cell:
? ? ? ? ?           ? 1 1 1 ?
? ? ? ? ?           1 1 0 1 1
? ? X ? ?    →      1 0 0 0 1
? ? ? ? ?           1 1 1 1 1
? ? ? ? ?           ? ? ? ? ?

X = Clicked cell (empty)
Numbers = Automatically revealed
? = Still hidden
```

### ⚡ **Performance & Stopping Conditions:**

#### **The Algorithm Stops When It Hits:**
1. **Numbered Cells** (`neighborMines > 0`) - Reveals them but doesn't continue
2. **Mines** (`cell.isMine === true`) - Never reveals, stops expansion  
3. **Flagged Cells** (`cell.isFlagged === true`) - Respects player flags
4. **Already Revealed** (`cell.isRevealed === true`) - Prevents infinite loops
5. **Grid Boundaries** (`r < 0 || r >= length`) - Prevents array errors

#### **Recursive Safety:**
- **No Stack Overflow**: Each cell can only be visited once due to `isRevealed` check
- **Efficient**: Stops immediately when hitting numbered cells
- **Safe**: Never reveals mines or flagged cells

### 🎮 **Game Impact:**

#### **Player Experience:**
- **One-Click Clearing**: Single click can reveal dozens of cells
- **Strategic Advantage**: Quickly clear safe areas to focus on mine detection
- **Standard Behavior**: Matches all professional minesweeper implementations

#### **Performance Benefits:**
- **Instant Feedback**: All connected empty cells reveal simultaneously
- **Reduced Clicking**: Players don't need to manually click every safe cell
- **Visual Satisfaction**: Creates satisfying "cascading" reveal effect

### 🔧 **Implementation Details:**

#### **Key Features in the Code:**
1. **Immutable Updates**: Uses `[...board.map(row => [...row])]` for React state
2. **Boundary Checking**: Prevents array index errors
3. **Double Implementation**: Same logic for normal clicks AND chord-clicking
4. **Win Detection**: Properly counts revealed cells after flood fill
5. **Game State**: Integrated with timer and game state management

#### **The Magic Formula:**
```javascript
// This single line triggers the entire flood fill:
if (newBoard[r][c].neighborMines === 0) {
  // Recursively reveal all 8 neighbors
}
```

This algorithm is the **heart of minesweeper gameplay** - it transforms a simple grid-clicking game into a strategic puzzle by automatically clearing safe areas and revealing the mine-adjacent numbered cells that provide clues for the next move! 🎯

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Enjoy playing Minesweeper!** 💣🎮
export default function Footer() {
  return (
    <footer className="bg-dark text-white p-3 border-top border-secondary">
      <div className="container text-center">
        <small>&copy; 2024 Minesweeper Game - Built with Next.js & React</small>
        <div className="mt-1">
          <small className="text-muted">
            Left click to reveal • Right click to flag • Double-click numbered cells to auto-reveal neighbors
          </small>
        </div>
      </div>
    </footer>
  )
}
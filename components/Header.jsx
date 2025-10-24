export default function Header() {
  return (
    <header className="bg-dark text-white p-3 border-bottom border-secondary">
      <nav className="container-fluid d-flex justify-content-between align-items-center">
        <h1 className="h3 mb-0">
          <i className="fas fa-bomb me-2"></i>
          Minesweeper
        </h1>
        <div className="text-muted">
          <small>Next.js React</small>
        </div>
      </nav>
    </header>
  )
}
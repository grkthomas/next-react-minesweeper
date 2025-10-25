export default function SimulationSidebar({ simulationHistory, isVisible }) {
  if (!isVisible) return null

  return (
    <div className="simulation-sidebar">
      <div className="sidebar-header">
        <h6 className="mb-2">
          <i className="fas fa-robot me-2"></i>
          Simulation Log
        </h6>
        <small className="text-muted">
          {simulationHistory.length} clicks
        </small>
      </div>
      
      <div className="sidebar-content">
        <pre className="simulation-log">
          {simulationHistory.length === 0 ? (
            <span className="text-muted">No clicks yet...</span>
          ) : (
            simulationHistory.map((click, index) => (
              <div key={index} className={`log-entry ${click.result === 'BOOM!' ? 'log-boom' : 'log-safe'}`}>
                <span className="log-time">{click.timestamp}</span>
                <span className="log-coords">({click.row},{click.col})</span>
                <span className="log-type">{click.cellType}</span>
                <span className="log-result">{click.result}</span>
              </div>
            ))
          )}
        </pre>
      </div>
    </div>
  )
}
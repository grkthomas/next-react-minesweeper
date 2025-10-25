'use client'

import React, { useEffect, useState, useCallback } from 'react'

export default function ScoreBoard({ sizeFilter, embedded = false }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ limit: '10' })
      if (sizeFilter) params.set('size', sizeFilter)
      const res = await fetch(`/api/scores?${params.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Failed to load scores')
      setScores(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [sizeFilter])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  const table = (
    <>
      {error && <div className="alert alert-danger m-2">{error}</div>}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-sm mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time (s)</th>
              <th>Mines</th>
              <th>Size</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-3">No scores yet</td>
              </tr>
            )}
            {scores.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.time}</td>
                <td>{s.mines}</td>
                <td>{s.size}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  if (embedded) {
    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <strong>Scoreboard</strong>
          <button className="btn btn-sm btn-outline-light" onClick={fetchScores} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        {table}
      </div>
    )
  }

  return (
    <div className="container my-3">
      <div className="card bg-secondary text-light">
        <div className="card-header d-flex align-items-center justify-content-between">
          <strong>Scoreboard</strong>
          <button className="btn btn-sm btn-outline-light" onClick={fetchScores} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="card-body p-0">
          {table}
        </div>
      </div>
    </div>
  )
}

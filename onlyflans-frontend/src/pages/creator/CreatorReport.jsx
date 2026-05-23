import { useState } from 'react';
import api from '../../api/axios';
import '../../styles/onlyflans.css';

export default function CreatorReport() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);
    try {
      const res = await api.get(`/creator/report?start=${start}&end=${end}`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar reporte');
    }
  };

  return (
    <>
      <h2 className="of-page-title">Reporte de Ingresos</h2>
      <p className="of-page-sub">Filtrá por fecha para ver tus ganancias en flanes</p>

      <div className="of-card" style={{ marginBottom: 28 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="of-label">Desde</label>
            <input
              type="date"
              className="of-input"
              style={{ marginBottom: 0 }}
              value={start}
              onChange={e => setStart(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="of-label">Hasta</label>
            <input
              type="date"
              className="of-input"
              style={{ marginBottom: 0 }}
              value={end}
              onChange={e => setEnd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="of-btn" style={{ paddingBottom: 10, paddingTop: 10 }}>
            Buscar
          </button>
        </form>
      </div>

      {error && <div className="of-alert-danger">{error}</div>}

      {report && (
        <>
          <div className="of-stats" style={{ marginBottom: 28 }}>
            <div className="of-stat">
              <div className="of-stat-label">Total flanes</div>
              <div className="of-stat-value blue">🍮 {report.total_flanes}</div>
            </div>
            <div className="of-stat">
              <div className="of-stat-label">Total Bs.</div>
              <div className="of-stat-value">Bs. {report.total_bs}</div>
            </div>
            <div className="of-stat">
              <div className="of-stat-label">Donaciones</div>
              <div className="of-stat-value">{report.donations_count}</div>
            </div>
          </div>

          <div className="of-card">
            <div className="of-card-title">Historial de donaciones</div>
            {report.history.length === 0 ? (
              <div className="of-empty">Sin donaciones en ese período.</div>
            ) : (
              <table className="of-table">
                <thead>
                  <tr>
                    <th>Seguidor</th>
                    <th>Flanes</th>
                    <th>Bs.</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {report.history.map(d => (
                    <tr key={d.id}>
                      <td>{d.follower?.name}</td>
                      <td>🍮 {d.flanes}</td>
                      <td>Bs. {d.amount_bs}</td>
                      <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
}
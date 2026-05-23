import { useState } from 'react';
import api from '../../api/axios';

const OF_BLUE = '#00AFF0';

export default function DonationHistory() {
  const [start, setStart]   = useState('');
  const [end, setEnd]       = useState('');
  const [creator, setCreator] = useState('');
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const params = new URLSearchParams({ start, end });
      if (creator.trim()) params.append('creator', creator.trim());
      const res = await api.get(`/follower/donations?${params}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar historial');
    } finally { setLoading(false); }
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' };
  const inputStyle = {
    height: 42, borderRadius: 10, border: '1px solid #ddd',
    fontSize: 14, padding: '0 14px', outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
    background: '#fff', color: '#111',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 22, color: '#111' }}>Historial de Donaciones</h2>
          <p style={{ margin: 0, color: '#999', fontSize: 14 }}>Filtrá tus apoyos por fecha y creador</p>
        </div>

        <div style={{ background: '#f7f7f7', borderRadius: 14, padding: '20px', marginBottom: '1.75rem', border: '1px solid #eee' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Desde</label>
                <input type="date" value={start} onChange={e => setStart(e.target.value)} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = OF_BLUE}
                  onBlur={e => e.target.style.borderColor = '#ddd'} />
              </div>
              <div>
                <label style={labelStyle}>Hasta</label>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = OF_BLUE}
                  onBlur={e => e.target.style.borderColor = '#ddd'} />
              </div>
              <div>
                <label style={labelStyle}>Creador (opcional)</label>
                <input value={creator} onChange={e => setCreator(e.target.value)}
                  placeholder="Nombre del creador" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = OF_BLUE}
                  onBlur={e => e.target.style.borderColor = '#ddd'} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '10px 28px', borderRadius: 24,
              background: loading ? '#ccc' : OF_BLUE,
              border: 'none', color: '#fff',
              fontWeight: 600, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
              {loading ? 'Buscando...' : 'Buscar donaciones'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#cc0000', fontSize: 14 }}>
            {error}
          </div>
        )}

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.75rem' }}>
              {[
                { label: 'Total flanes', value: `🍮 ${data.total_flanes}` },
                { label: 'Total Bs.', value: `Bs. ${data.total_bs}` },
                { label: 'Donaciones', value: data.donations_count },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#fff', border: '1px solid #e8e8e8',
                  borderRadius: 12, padding: '16px', textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: '#999', fontWeight: 500 }}>{stat.label}</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111' }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #eee', background: '#f7f7f7' }}>
                <h5 style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#333' }}>Detalle de donaciones</h5>
              </div>

              {data.history.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999', fontSize: 14 }}>
                  Sin donaciones en ese período.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['Creador', 'Flanes', 'Monto', 'Fecha'].map(h => (
                        <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#555', borderBottom: '1px solid #eee' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.map((d, i) => (
                      <tr key={d.id} style={{ borderBottom: i < data.history.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 18px', color: '#111', fontWeight: 500 }}>{d.creator?.name}</td>
                        <td style={{ padding: '12px 18px', color: '#555' }}>🍮 {d.flanes}</td>
                        <td style={{ padding: '12px 18px', color: '#555' }}>Bs. {d.amount_bs}</td>
                        <td style={{ padding: '12px 18px', color: '#999' }}>{new Date(d.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
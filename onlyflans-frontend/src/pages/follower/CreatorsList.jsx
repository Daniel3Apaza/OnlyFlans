import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OF_BLUE = '#00AFF0';
const avatarColors = ['#FAC775', '#9FE1CB', '#CECBF6', '#F4C0D1', '#B5D4F4', '#F5C4B3'];
const avatarEmoji  = ['🧑‍🍳','🎨','🎸','📸','✍️','🎬','🎮','🎤'];

function CreatorCard({ creator }) {
  const idx = creator.id % avatarColors.length;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 12,
      border: '1px solid #e8e8e8', background: '#fff',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = OF_BLUE; e.currentTarget.style.boxShadow = `0 0 0 1px ${OF_BLUE}22`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 52, height: 52, borderRadius: '50%', padding: 2, background: `linear-gradient(135deg, ${OF_BLUE}, #0060a0)`, flexShrink: 0 }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          border: '2px solid #fff', overflow: 'hidden',
          background: avatarColors[idx],
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {creator.profile?.avatar_url
            ? <img src={`http://localhost:3000/${creator.profile.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : avatarEmoji[creator.id % avatarEmoji.length]}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {creator.name}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#999' }}>Creador · OnlyFlans</p>
      </div>

      <Link to={`/creators/${creator.id}`} style={{
        flexShrink: 0, padding: '8px 20px', borderRadius: 24,
        background: OF_BLUE, color: '#fff',
        fontWeight: 600, fontSize: 13, textDecoration: 'none',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#0090c5'}
        onMouseLeave={e => e.currentTarget.style.background = OF_BLUE}
      >
        Ver perfil
      </Link>
    </div>
  );
}

export default function CreatorsList() {
  const [creators, setCreators] = useState([]);
  const [search, setSearch]     = useState('');
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/follower/creators').then(r => setCreators(r.data)).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { setResults(null); return; }
    const res = await api.get(`/follower/creators/search?q=${encodeURIComponent(search)}`);
    setResults(res.data);
  };

  const list = results ?? creators;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 22, color: '#111' }}>Creadores</h2>
          <p style={{ margin: 0, color: '#999', fontSize: 14 }}>
            {loading ? '...' : `${creators.length} creadores disponibles`}
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); if (!e.target.value) setResults(null); }}
              placeholder="Buscar creadores..."
              style={{
                width: '100%', height: 44, borderRadius: 24,
                border: '1px solid #ddd', background: '#f7f7f7',
                color: '#111', fontSize: 14, paddingLeft: 42, paddingRight: search ? 38 : 16,
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
              onFocus={e => { e.target.style.borderColor = OF_BLUE; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#f7f7f7'; }}
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); setResults(null); }}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 16, padding: 0 }}>✕</button>
            )}
          </div>
          <button type="submit" style={{
            padding: '0 24px', height: 44, borderRadius: 24,
            background: OF_BLUE, border: 'none', color: '#fff',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
          }}>Buscar</button>
        </form>

        {results !== null && (
          <p style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
            {results.length} resultado{results.length !== 1 ? 's' : ''} para "{search}"
          </p>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>Cargando creadores...</div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍮</div>
            <p style={{ color: '#999', fontSize: 14 }}>No se encontraron creadores.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.map(c => <CreatorCard key={c.id} creator={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OF_BLUE = '#00AFF0';
const avatarColors = ['#FAC775', '#9FE1CB', '#CECBF6', '#F4C0D1', '#B5D4F4', '#F5C4B3'];
const avatarEmoji  = ['🧑‍🍳','🎨','🎸','📸','✍️','🎬','🎮','🎤'];

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);

  const load = () => api.get('/follower/favorites').then(r => setFavorites(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleRemove = async (creatorId) => {
    await api.delete(`/follower/favorites/${creatorId}`);
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 22, color: '#111' }}>Suscripciones</h2>
          <p style={{ margin: 0, color: '#999', fontSize: 14 }}>
            {!loading && `${favorites.length} creador${favorites.length !== 1 ? 'es' : ''} favorito${favorites.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>Cargando...</div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⭐</div>
            <h5 style={{ fontWeight: 700, color: '#111', marginBottom: 8 }}>No tenés favoritos todavía</h5>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>Explorá creadores y marcalos como favoritos</p>
            <Link to="/creators" style={{
              display: 'inline-block', padding: '11px 28px',
              borderRadius: 24, background: OF_BLUE,
              color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>Explorar creadores</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {favorites.map(fav => {
              const creator = fav.creator;
              if (!creator) return null;
              const idx = creator.id % avatarColors.length;
              return (
                <div key={fav.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 12,
                  border: '1px solid #e8e8e8', background: '#fff',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}
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
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#111' }}>{creator.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#999' }}>Creador · OnlyFlans</p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link to={`/creators/${creator.id}`} style={{
                      padding: '8px 18px', borderRadius: 24,
                      background: OF_BLUE, color: '#fff',
                      fontWeight: 600, fontSize: 13, textDecoration: 'none',
                    }}>Ver perfil</Link>
                    <button onClick={() => handleRemove(creator.id)} style={{
                      padding: '8px 14px', borderRadius: 24,
                      border: '1px solid #ddd', background: '#fff',
                      color: '#666', fontWeight: 500, fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e24b4a'; e.currentTarget.style.color = '#e24b4a'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#666'; }}
                    >Quitar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
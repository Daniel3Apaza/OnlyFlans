import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const OF_BLUE = '#00AFF0';
const FLAN_PRICE = 10;
const avatarColors = ['#FAC775', '#9FE1CB', '#CECBF6', '#F4C0D1', '#B5D4F4', '#F5C4B3'];
const avatarEmoji  = ['🧑‍🍳','🎨','🎸','📸','✍️','🎬','🎮','🎤'];

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'hace unos minutos';
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ayer' : `hace ${d}d`;
}

export default function CreatorPublicProfile() {
  const { id } = useParams();
  const [data, setData]               = useState(null);
  const [flanes, setFlanes]           = useState(1);
  const [comment, setComment]         = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast]             = useState(null);
  const [isFav, setIsFav]             = useState(false);
  const [donating, setDonating]       = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => api.get(`/follower/creators/${id}`).then(r => setData(r.data));
  useEffect(() => { load(); }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonating(true);
    try {
      const res = await api.post('/follower/donate', { creator_id: id, flanes: Number(flanes) });
      showToast('ok', res.data.message);
      load();
    } catch (err) {
      showToast('err', err.response?.data?.message || 'Error al donar');
    } finally { setDonating(false); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    try {
      await api.post(`/follower/posts/${selectedPost}/comments`, { content: comment });
      setComment(''); setSelectedPost(null);
      showToast('ok', 'Comentario enviado ✓');
    } catch (err) { showToast('err', err.response?.data?.message || 'Error al comentar'); }
  };

  const handleFav = async () => {
    try {
      if (isFav) {
        await api.delete(`/follower/favorites/${id}`);
        setIsFav(false); showToast('ok', 'Quitado de favoritos');
      } else {
        await api.post(`/follower/favorites/${id}`);
        setIsFav(true); showToast('ok', 'Agregado a favoritos ⭐');
      }
    } catch (err) { showToast('err', err.response?.data?.message || 'Error'); }
  };

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#999', fontFamily: 'sans-serif' }}>
      Cargando...
    </div>
  );

  const { creator, posts_locked, posts } = data;
  const avatarIdx = creator.id % avatarColors.length;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'ok' ? '#e8f8ff' : '#fff5f5',
          border: `1px solid ${toast.type === 'ok' ? OF_BLUE : '#fcc'}`,
          color: toast.type === 'ok' ? '#006699' : '#cc0000',
          padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ position: 'relative', height: 200, background: '#e8f8ff', overflow: 'hidden' }}>
        {creator.profile?.banner_url
          ? <img src={`http://localhost:3000/${creator.profile.banner_url}`} alt="banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #e8f8ff, #b3e8f9)` }} />
        }
        
        <Link to="/feed" style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', zIndex: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#111', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            ←
          </div>
        </Link>

        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8, fontSize: 12, color: '#666' }}>
          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 999, padding: '4px 12px', fontWeight: 600 }}>
            {posts?.length ?? 0} posts
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem 4rem' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36, marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            border: '4px solid #fff',
            background: avatarColors[avatarIdx],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}>
            {creator.profile?.avatar_url
              ? <img src={`http://localhost:3000/${creator.profile.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : avatarEmoji[creator.id % avatarEmoji.length]}
          </div>

          <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
            <button onClick={handleFav} style={{
              padding: '9px 20px', borderRadius: 24,
              border: `1px solid ${isFav ? OF_BLUE : '#ddd'}`,
              background: isFav ? '#e8f8ff' : '#fff',
              color: isFav ? OF_BLUE : '#555',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}>
              {isFav ? '⭐ Siguiendo' : '☆ Seguir'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 20, color: '#111' }}>{creator.name}</h2>
          <p style={{ margin: '0 0 6px', fontSize: 13, color: '#999' }}>@{creator.name?.toLowerCase().replace(/\s/g, '_')} · Disponible ahora</p>
          {creator.profile?.bio && <p style={{ margin: 0, color: '#444', fontSize: 14, lineHeight: 1.55 }}>{creator.profile.bio}</p>}
        </div>

        <div style={{ border: `1px solid ${OF_BLUE}`, borderRadius: 14, padding: '18px 20px', marginBottom: '1.5rem', background: '#f0fbff' }}>
          <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 15, color: '#111' }}>
            🍮 Apoyar a {creator.name}
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>Enviá flanes para desbloquear su contenido</p>
          <form onSubmit={handleDonate} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #ddd', borderRadius: 24, padding: '4px 14px', background: '#fff' }}>
              <button type="button" onClick={() => setFlanes(Math.max(1, flanes - 1))}
                style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #eee', background: '#f5f5f5', color: '#333', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#111' }}>{flanes}</span>
              <button type="button" onClick={() => setFlanes(flanes + 1)}
                style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #eee', background: '#f5f5f5', color: '#333', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <span style={{ fontSize: 13, color: '#888' }}>= Bs. {flanes * FLAN_PRICE}</span>
            <button type="submit" disabled={donating} style={{
              marginLeft: 'auto', padding: '10px 28px', borderRadius: 24,
              background: OF_BLUE, border: 'none', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: donating ? 'not-allowed' : 'pointer',
              opacity: donating ? 0.7 : 1, fontFamily: 'inherit',
            }}>
              {donating ? 'Enviando...' : `Donar ${flanes} flan${flanes > 1 ? 'es' : ''}`}
            </button>
          </form>
        </div>

        {creator.goals?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>Metas de apoyo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {creator.goals.map(g => (
                <div key={g.id} style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #e8e8e8', background: '#fff' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, color: '#111' }}>🎯 {g.title}</p>
                  {g.description && <p style={{ margin: 0, fontSize: 13, color: '#777' }}>{g.description}</p>}
                  {g.target_flanes && <p style={{ margin: '6px 0 0', fontSize: 12, color: OF_BLUE, fontWeight: 600 }}>Meta: {g.target_flanes} flanes</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {posts_locked ? (
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', display: 'flex', gap: 16, alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#111' }}>0</p>
                <p style={{ margin: 0, fontSize: 11, color: '#999' }}>PUBLICACIONES</p>
              </div>
            </div>
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>🔒</div>
              <p style={{ fontSize: 15, color: '#666', margin: '0 0 6px' }}>
                El contenido de <strong>{creator.name}</strong> está bloqueado
              </p>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
                Enviá un flan para desbloquear todas las publicaciones
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: '0 0 2px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 100, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#ccc' }}>🔒</div>
              ))}
            </div>
            <div style={{ padding: '14px 18px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#666' }}>🖼️ {posts?.length ?? '?'} · 📷 {posts?.length ?? '?'}</span>
              <span style={{ fontSize: 13, color: '#999' }}>🔒</span>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 24, borderBottom: '2px solid #eee', marginBottom: '1rem', paddingBottom: '0' }}>
              <button style={{ paddingBottom: 12, borderBottom: `2px solid ${OF_BLUE}`, marginBottom: -2, background: 'none', border: 'none', fontWeight: 600, fontSize: 13, color: OF_BLUE, cursor: 'pointer', fontFamily: 'inherit' }}>
                {posts?.length ?? 0} PUBLICACIONES
              </button>
            </div>

            {!posts || posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#999', fontSize: 14 }}>
                Este creador aún no publicó nada.
              </div>
            ) : posts.map(post => (
              <div key={post.id} style={{ border: '1px solid #e8e8e8', borderRadius: 12, marginBottom: 12, overflow: 'hidden', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarColors[avatarIdx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, overflow: 'hidden', flexShrink: 0 }}>
                    {creator.profile?.avatar_url
                      ? <img src={`http://localhost:3000/${creator.profile.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : avatarEmoji[creator.id % avatarEmoji.length]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#111' }}>{creator.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#999' }}>{timeAgo(post.createdAt)}</p>
                  </div>
                </div>

                {post.image_url && (
                  <img src={`http://localhost:3000/${post.image_url}`} alt="post"
                    style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                )}

                <div style={{ padding: '12px 14px 6px' }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#333' }}>{post.content}</p>
                </div>

                <div style={{ padding: '8px 14px 12px', borderTop: '1px solid #f0f0f0', marginTop: 6 }}>
                  {selectedPost === post.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        placeholder="Tu comentario..."
                        style={{ flex: 1, height: 36, borderRadius: 24, border: `1px solid ${OF_BLUE}`, padding: '0 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                      />
                      <button onClick={handleComment} style={{ padding: '0 16px', height: 36, borderRadius: 24, background: OF_BLUE, border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Enviar</button>
                      <button onClick={() => setSelectedPost(null)} style={{ padding: '0 12px', height: 36, borderRadius: 24, background: 'transparent', border: '1px solid #ddd', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedPost(post.id)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 24, fontSize: 13,
                      background: 'transparent', border: '1px solid #ddd', color: '#777', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      💬 Comentar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
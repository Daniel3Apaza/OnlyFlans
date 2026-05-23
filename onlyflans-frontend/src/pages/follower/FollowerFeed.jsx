import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OF_BLUE = '#00AFF0';
const FLAN_PRICE = 10;
const avatarColors = ['#FAC775', '#9FE1CB', '#CECBF6', '#F4C0D1', '#B5D4F4'];
const avatarEmoji  = ['🧑‍🍳','🎨','🎸','📸','✍️','🎬','🎮','🎤'];

function Avatar({ creator, size = 38 }) {
  const idx = creator.id % avatarColors.length;
  if (creator.profile?.avatar_url) {
    return <img src={`http://localhost:3000/${creator.profile.avatar_url}`} alt={creator.name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: avatarColors[idx], display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.45,
    }}>{avatarEmoji[creator.id % avatarEmoji.length]}</div>
  );
}

function StoryRing({ creator }) {
  return (
    <Link to={`/creators/${creator.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', padding: 2,
          background: `linear-gradient(135deg, ${OF_BLUE}, #0060a0)`,
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            border: '2px solid #fff', overflow: 'hidden',
            background: avatarColors[creator.id % avatarColors.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>
            {creator.profile?.avatar_url
              ? <img src={`http://localhost:3000/${creator.profile.avatar_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : avatarEmoji[creator.id % avatarEmoji.length]}
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#555', maxWidth: 64, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {creator.name.split(' ')[0]}
        </span>
      </div>
    </Link>
  );
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'hace unos minutos';
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}

function PostCard({ post, onDonate }) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment]         = useState('');
  const [msg, setMsg]                 = useState('');
  const [flanCount, setFlanCount]     = useState(1);
  const [donating, setDonating]       = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/follower/posts/${post.id}/comments`, { content: comment });
      setComment(''); setShowComment(false);
      setMsg('Comentario enviado ✓');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  const handleDonate = async () => {
    setDonating(true);
    try {
      await onDonate(post.creator.id, flanCount);
      setMsg(`¡Enviaste ${flanCount} flan${flanCount > 1 ? 'es' : ''}! 🍮`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data?.message || 'Error al donar'); }
    finally { setDonating(false); }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
        <Avatar creator={post.creator} />
        <div style={{ flex: 1 }}>
          <Link to={`/creators/${post.creator.id}`} style={{ fontWeight: 600, fontSize: 14, color: '#111', textDecoration: 'none', display: 'block' }}>
            {post.creator.name}
          </Link>
          <span style={{ fontSize: 12, color: '#999' }}>{timeAgo(post.createdAt)}</span>
        </div>
        <Link to={`/creators/${post.creator.id}`} style={{
          padding: '7px 18px', borderRadius: 24,
          background: OF_BLUE, color: '#fff',
          fontWeight: 600, fontSize: 13, textDecoration: 'none',
        }}>Ver perfil</Link>
      </div>

      {post.image_url && (
        <img src={`http://localhost:3000/${post.image_url}`} alt="post"
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
      )}

      <div style={{ padding: '12px 16px 6px' }}>
        <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6, color: '#222' }}>{post.content}</p>
      </div>

      {msg && (
        <div style={{ margin: '0 16px 8px', padding: '8px 12px', background: '#e8f8ff', color: '#006699', borderRadius: 8, fontSize: 13 }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 14px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <button type="button" onClick={() => setFlanCount(Math.max(1, flanCount - 1))}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <span style={{ fontWeight: 600, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{flanCount}</span>
          <button type="button" onClick={() => setFlanCount(flanCount + 1)}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          <button onClick={handleDonate} disabled={donating} style={{
            padding: '8px 18px', borderRadius: 24,
            background: OF_BLUE, border: 'none', color: '#fff',
            fontWeight: 600, fontSize: 13, cursor: donating ? 'not-allowed' : 'pointer',
            opacity: donating ? 0.7 : 1, fontFamily: 'inherit',
          }}>
            🍮 Donar {flanCount} flan{flanCount > 1 ? 'es' : ''}
          </button>
          <span style={{ fontSize: 12, color: '#999' }}>Bs. {flanCount * FLAN_PRICE}</span>
        </div>

        <button onClick={() => setShowComment(!showComment)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '8px 14px', borderRadius: 24, fontSize: 13,
          background: 'transparent', border: '1px solid #ddd', color: '#555', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          💬 Comentar
        </button>
      </div>

      {showComment && (
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
          <input value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Escribí un comentario..."
            style={{ flex: 1, height: 38, borderRadius: 24, border: '1px solid #ddd', padding: '0 16px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = OF_BLUE}
            onBlur={e => e.target.style.borderColor = '#ddd'}
          />
          <button onClick={handleComment} style={{
            padding: '0 18px', height: 38, borderRadius: 24,
            background: OF_BLUE, border: 'none', color: '#fff',
            fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Enviar</button>
        </div>
      )}
    </div>
  );
}

export default function FollowerFeed() {
  const [posts, setPosts]       = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/follower/feed'),
      api.get('/follower/favorites'),
    ]).then(([feedRes, favRes]) => {
      setPosts(Array.isArray(feedRes.data) ? feedRes.data : []);
      setCreators(favRes.data.map(f => f.creator).filter(Boolean));
    }).finally(() => setLoading(false));
  }, []);

  const handleDonate = async (creatorId, flanes) => {
    await api.post('/follower/donate', { creator_id: creatorId, flanes });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12, color: '#999' }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${OF_BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ margin: 0, fontSize: 14 }}>Cargando feed...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#111' }}>Inicio</h4>
        <span style={{ fontSize: 12, color: '#999', background: '#f5f5f5', padding: '4px 12px', borderRadius: 999, border: '1px solid #eee' }}>
          {posts.length} publicaciones
        </span>
      </div>

      {creators.length > 0 && (
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14, marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
          {creators.map(c => <StoryRing key={c.id} creator={c} />)}
        </div>
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🍮</div>
          <h5 style={{ fontWeight: 700, color: '#111', marginBottom: 8 }}>Tu feed está vacío</h5>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
            Doná un flan a un creador para empezar a ver su contenido
          </p>
          <Link to="/creators" style={{
            display: 'inline-block', padding: '11px 28px',
            borderRadius: 24, background: OF_BLUE,
            color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          }}>Explorar creadores</Link>
        </div>
      ) : posts.map(post => (
        <PostCard key={post.id} post={post} onDonate={handleDonate} />
      ))}
    </div>
  );
}
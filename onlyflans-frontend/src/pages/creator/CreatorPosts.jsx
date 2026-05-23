import { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/onlyflans.css';

export default function CreatorPosts() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');

  const loadPosts = () => api.get('/creator/posts').then(r => setPosts(r.data));
  useEffect(() => { loadPosts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('content', content);
    if (image) form.append('image', image);
    await api.post('/creator/posts', form);
    setContent('');
    setImage(null);
    setMsg('Post publicado ✓');
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este post?')) return;
    await api.delete(`/creator/posts/${id}`);
    loadPosts();
  };

  return (
    <>
      <h2 className="of-page-title">Mis Posts</h2>
      <p className="of-page-sub">Publicá contenido exclusivo para tus seguidores</p>

      <div className="of-compose">
        {msg && <div className="of-alert-success">{msg}</div>}
        <form onSubmit={handleCreate}>
          <textarea
            className=""
            rows={3}
            placeholder="¿Qué querés compartir con tus seguidores?"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <div className="of-compose-footer">
            <label style={{ cursor: 'pointer', color: 'var(--of-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {image ? image.name : 'Adjuntar imagen'}
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setImage(e.target.files[0])} />
            </label>
            <button type="submit" className="of-btn">Publicar</button>
          </div>
        </form>
      </div>

      {posts.length === 0 && (
        <div className="of-empty">Todavía no publicaste nada. ¡Escribí tu primer post!</div>
      )}

      {posts.map(post => (
        <div key={post.id} className="of-post">
          <div className="of-post-header">
            <div className="of-avatar">YO</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Vos</div>
              <div className="of-post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <p className="of-post-content">{post.content}</p>

          {post.image_url && (
            <img
              src={`http://localhost:3000/${post.image_url}`}
              alt="post"
              className="of-post-img"
            />
          )}

          {post.comments?.length > 0 && (
            <div className="of-comments">
              <div className="of-comments-label">💬 Comentarios ({post.comments.length})</div>
              {post.comments.map(c => (
                <div key={c.id} className="of-comment">
                  <strong>{c.follower?.name}:</strong> {c.content}
                </div>
              ))}
            </div>
          )}

          <div className="of-post-footer">
            <span style={{ fontSize: 13, color: 'var(--of-muted)' }}>
              {post.comments?.length || 0} comentario{post.comments?.length !== 1 ? 's' : ''}
            </span>
            <button className="of-btn-danger" onClick={() => handleDelete(post.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
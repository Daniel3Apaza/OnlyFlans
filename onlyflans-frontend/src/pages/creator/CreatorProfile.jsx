import { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/onlyflans.css';

export default function CreatorProfile() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/creator/profile').then(res => {
      setProfile(res.data.profile);
      setBio(res.data.profile?.bio || '');
    });
  }, []);

  const saveBio = async (e) => {
    e.preventDefault();
    await api.post('/creator/profile', { bio });
    setMsg('Bio actualizada ✓');
  };

  const uploadFile = async (e, type) => {
    e.preventDefault();
    const file = type === 'avatar' ? avatarFile : bannerFile;
    if (!file) return;
    const form = new FormData();
    form.append(type, file);
    await api.post(`/creator/profile/${type}`, form);
    setMsg(`${type === 'avatar' ? 'Foto' : 'Banner'} actualizado ✓`);
  };

  return (
    <>
      <h2 className="of-page-title">Mi Perfil</h2>
      <p className="of-page-sub">Personalizá tu página pública</p>

      {msg && <div className="of-alert-success">{msg}</div>}

      {profile?.banner_url
        ? <img src={`http://localhost:3000/${profile.banner_url}`} alt="banner" className="of-banner" />
        : <div className="of-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--of-muted)', fontSize: 14 }}>Sin banner</div>
      }

      {profile?.avatar_url && (
        <img src={`http://localhost:3000/${profile.avatar_url}`} alt="avatar" className="of-avatar-lg" />
      )}

      <div className="of-card" style={{ marginBottom: 20 }}>
        <div className="of-card-title">Descripción (bio)</div>
        <form onSubmit={saveBio}>
          <textarea
            className="of-textarea"
            rows={3}
            placeholder="Contale a tus seguidores quién sos..."
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          <button type="submit" className="of-btn">Guardar bio</button>
        </form>
      </div>

      <div className="of-card" style={{ marginBottom: 20 }}>
        <div className="of-card-title">Foto de perfil</div>
        <form onSubmit={e => uploadFile(e, 'avatar')}>
          <input
            type="file"
            className="of-input"
            accept="image/*"
            onChange={e => setAvatarFile(e.target.files[0])}
            style={{ marginBottom: 14 }}
          />
          <button type="submit" className="of-btn-ghost">Subir foto</button>
        </form>
      </div>

      <div className="of-card">
        <div className="of-card-title">Banner</div>
        <form onSubmit={e => uploadFile(e, 'banner')}>
          <input
            type="file"
            className="of-input"
            accept="image/*"
            onChange={e => setBannerFile(e.target.files[0])}
            style={{ marginBottom: 14 }}
          />
          <button type="submit" className="of-btn-ghost">Subir banner</button>
        </form>
      </div>
    </>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const OF_BLUE = '#00AFF0';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'follower' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'creator' ? '/creator' : '/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', height: 44, borderRadius: 10,
    border: '1px solid #ddd', background: '#f7f7f7',
    fontSize: 14, padding: '0 14px', outline: 'none',
    fontFamily: 'inherit', color: '#111', boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s',
  };

  const handleFocus = e => { e.target.style.borderColor = OF_BLUE; e.target.style.background = '#fff'; };
  const handleBlur  = e => { e.target.style.borderColor = '#ddd';   e.target.style.background = '#f7f7f7'; };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        flex: 1, background: OF_BLUE,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, padding: '2rem',
      }} className="of-register-panel">
        <div style={{ fontSize: 72 }}>🍮</div>
        <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>OnlyFlans</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', maxWidth: 280, margin: 0, lineHeight: 1.6 }}>
          Creá tu cuenta y empezá a apoyar a tus creadores favoritos
        </p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
          {['Explorá creadores únicos', 'Donales flanes 🍮', 'Accedé a contenido exclusivo'].map(txt => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 14 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
              {txt}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        width: 420, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 24, color: '#111' }}>Crear cuenta</h2>
          <p style={{ margin: '0 0 28px', color: '#999', fontSize: 14 }}>Es gratis y lleva menos de un minuto</p>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #fcc', borderRadius: 10,
              padding: '10px 14px', marginBottom: 20, color: '#cc0000', fontSize: 14,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Nombre</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Tu nombre" required style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="tu@email.com" required style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Mínimo 8 caracteres" required style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Quiero registrarme como</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'follower', label: 'Seguidor', emoji: '👤', desc: 'Explorá y apoyá' },
                  { value: 'creator',  label: 'Creador',  emoji: '🎨', desc: 'Publicá y recibí' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${form.role === opt.value ? OF_BLUE : '#e0e0e0'}`,
                    background: form.role === opt.value ? '#f0fbff' : '#fafafa',
                    transition: 'all 0.15s',
                  }}>
                    <input type="radio" name="role" value={opt.value} checked={form.role === opt.value}
                      onChange={handleChange} style={{ display: 'none' }} />
                    <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: form.role === opt.value ? OF_BLUE : '#333' }}>{opt.label}</span>
                    <span style={{ fontSize: 11, color: '#999' }}>{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', height: 46, borderRadius: 10,
              background: loading ? '#aaa' : OF_BLUE,
              border: 'none', color: '#fff',
              fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'background 0.15s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0090c5'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = OF_BLUE; }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color: OF_BLUE, fontWeight: 600, textDecoration: 'none' }}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .of-register-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const OF_BLUE = '#00AFF0';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'follower' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'creator' ? '/creator' : '/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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
      }} className="of-login-panel">
        <div style={{ fontSize: 72 }}>🍮</div>
        <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>OnlyFlans</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', maxWidth: 280, margin: 0, lineHeight: 1.6 }}>
          La plataforma para apoyar a tus creadores favoritos con un flan 🍮
        </p>
      </div>

      <div style={{
        width: 420, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 24, color: '#111' }}>Iniciar sesión</h2>
          <p style={{ margin: '0 0 28px', color: '#999', fontSize: 14 }}>Bienvenido de vuelta</p>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #fcc', borderRadius: 10,
              padding: '10px 14px', marginBottom: 20, color: '#cc0000', fontSize: 14,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="tu@email.com" required style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Rol</label>
              <select name="role" value={form.role} onChange={handleChange} style={{
                ...inputStyle, cursor: 'pointer', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                paddingRight: 36,
              }}
                onFocus={handleFocus} onBlur={handleBlur}>
                <option value="follower">Seguidor</option>
                <option value="creator">Creador</option>
              </select>
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
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color: OF_BLUE, fontWeight: 600, textDecoration: 'none' }}>
              Registrate
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .of-login-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
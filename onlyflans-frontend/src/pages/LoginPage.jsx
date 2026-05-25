import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styles from '../styles/LoginPage.module.css';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.panelEmoji}>🍮</div>
        <h1 className={styles.panelTitle}>OnlyFlans</h1>
        <p className={styles.panelSubtitle}>
          La plataforma para apoyar a tus creadores favoritos con un flan 🍮
        </p>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Iniciar sesión</h2>
          <p className={styles.formSubtitle}>Bienvenido de vuelta</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="tu@email.com" required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                className={styles.input}
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
              />
            </div>

            <div className={styles.selectField}>
              <label className={styles.label}>Rol</label>
              <select
                className={styles.select}
                name="role" value={form.role} onChange={handleChange}
              >
                <option value="follower">Seguidor</option>
                <option value="creator">Creador</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

          </form>

          <p className={styles.footerText}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" className={styles.footerLink}>
              Registrate
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styles from '../styles/RegisterPage.module.css';

const ROLES = [
  { value: 'follower', label: 'Seguidor', emoji: '👤', desc: 'Explorá y apoyá' },
  { value: 'creator',  label: 'Creador',  emoji: '🎨', desc: 'Publicá y recibí' },
];

const FEATURES = [
  'Explorá creadores únicos',
  'Donales flanes 🍮',
  'Accedé a contenido exclusivo',
];

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
          Creá tu cuenta y empezá a apoyar a tus creadores favoritos
        </p>
        <ul className={styles.panelFeatures}>
          {FEATURES.map(txt => (
            <li key={txt} className={styles.panelFeatureItem}>
              <span className={styles.panelFeatureCheck}>✓</span>
              {txt}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Crear cuenta</h2>
          <p className={styles.formSubtitle}>Es gratis y lleva menos de un minuto</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className={styles.field}>
              <label className={styles.label}>Nombre</label>
              <input
                className={styles.input}
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Tu nombre" required
              />
            </div>

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
                onChange={handleChange} placeholder="Mínimo 8 caracteres" required
              />
            </div>

            <div className={styles.roleField}>
              <label className={styles.label}>Quiero registrarme como</label>
              <div className={styles.roleGrid}>
                {ROLES.map(opt => (
                  <label key={opt.value} className={styles.roleOption}>
                    <input
                      className={styles.roleOptionInput}
                      type="radio" name="role" value={opt.value}
                      checked={form.role === opt.value} onChange={handleChange}
                    />
                    <span className={styles.roleOptionEmoji}>{opt.emoji}</span>
                    <span className={styles.roleOptionLabel}>{opt.label}</span>
                    <span className={styles.roleOptionDesc}>{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

          </form>

          <p className={styles.footerText}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className={styles.footerLink}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
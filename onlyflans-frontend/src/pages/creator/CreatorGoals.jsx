import { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/onlyflans.css';

export default function CreatorGoals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [msg, setMsg] = useState('');

  const loadGoals = () => api.get('/creator/goals').then(r => setGoals(r.data));
  useEffect(() => { loadGoals(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/creator/goals', form);
    setForm({ title: '', description: '' });
    setMsg('Meta creada ✓');
    loadGoals();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta meta?')) return;
    await api.delete(`/creator/goals/${id}`);
    loadGoals();
  };

  return (
    <>
      <h2 className="of-page-title">Mis Metas</h2>
      <p className="of-page-sub">Definí los objetivos de apoyo para motivar a tus seguidores</p>

      <div className="of-card" style={{ marginBottom: 28 }}>
        <div className="of-card-title">Nueva meta</div>
        {msg && <div className="of-alert-success">{msg}</div>}
        <form onSubmit={handleCreate}>
          <div className="of-form-group">
            <label className="of-label">Título</label>
            <input
              className="of-input"
              placeholder="Ej: Llegar a 50 flanes este mes"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="of-form-group">
            <label className="of-label">Descripción (opcional)</label>
            <textarea
              className="of-textarea"
              rows={2}
              placeholder="Contale a tus seguidores para qué es esta meta..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button type="submit" className="of-btn">Crear meta</button>
        </form>
      </div>

      {goals.length === 0 && (
        <div className="of-empty">No tenés metas definidas todavía.</div>
      )}

      {goals.map(g => (
        <div key={g.id} className="of-goal">
          <div>
            <div className="of-goal-title">🎯 {g.title}</div>
            {g.description && <div className="of-goal-desc">{g.description}</div>}
          </div>
          <button className="of-btn-danger" onClick={() => handleDelete(g.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </>
  );
}
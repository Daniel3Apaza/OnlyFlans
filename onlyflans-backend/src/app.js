const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/creator', require('./routes/creator.routes'));
app.use('/api/follower', require('./routes/follower.routes'));

app.get('/', (req, res) => {
  res.json({ message: '🍮 OnlyFlans API funcionando', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

module.exports = app;

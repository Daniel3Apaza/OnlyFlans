const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Todos los campos son requeridos: name, email, password, role' });
    if (!['creator', 'follower'].includes(role))
      return res.status(400).json({ message: 'El rol debe ser "creator" o "follower"' });
    if (password.length < 6)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

    const existing = await Usuario.findOne({ where: { email, role } });
    if (existing)
      return res.status(409).json({
        message: `Ya existe una cuenta con ese email como ${role === 'creator' ? 'creador' : 'seguidor'}`,
      });

    const password_hash = await bcrypt.hash(password, 12);
    const newUser = await Usuario.create({ name, email, password_hash, role });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: 'Email, contraseña y rol son requeridos' });

    const foundUser = await Usuario.findOne({ where: { email, role } });
    if (!foundUser)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const valid = await bcrypt.compare(password, foundUser.password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(200).json({
      message: 'Sesión iniciada',
      token,
      user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role },
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const me = async (req, res) => {
  try {
    const foundUser = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(foundUser);
  } catch (err) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const logout = (req, res) => {
  return res.json({ message: 'Sesión cerrada. Elimina el token del frontend.' });
};

module.exports = { register, login, me, logout };
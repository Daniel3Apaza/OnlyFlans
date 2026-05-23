const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Creador = sequelize.define('Creador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  banner_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'creadores',
  timestamps: true,
});

module.exports = Creador;
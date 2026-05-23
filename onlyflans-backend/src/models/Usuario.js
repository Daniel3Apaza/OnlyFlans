const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['creator', 'follower']]
    }
  },
}, {
  tableName: 'Usuarios',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email', 'role'],
    },
  ],
});

module.exports = Usuario;

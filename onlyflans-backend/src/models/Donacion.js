const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donacion = sequelize.define('Donacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flanes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  amount_bs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'donaciones',
  timestamps: true,
});

module.exports = Donacion;

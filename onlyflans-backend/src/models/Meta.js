const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meta = sequelize.define('Meta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  target_flanes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Metas',
  timestamps: true,
});

module.exports = Meta;

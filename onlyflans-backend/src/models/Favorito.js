const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
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
}, {
  tableName: 'favoritos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'creator_id'], 
    },
  ],
});

module.exports = Favorito;

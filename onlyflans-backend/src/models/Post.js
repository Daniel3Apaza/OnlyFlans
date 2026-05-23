const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

module.exports = Post;

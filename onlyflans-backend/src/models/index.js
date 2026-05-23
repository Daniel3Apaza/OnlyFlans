const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Creador = require('./Creador');
const Meta = require('./Meta');
const Post = require('./Post');
const Comentario = require('./Comentario');
const Donacion = require('./Donacion');
const Favorito = require('./Favorito');

Usuario.hasOne(Creador, { foreignKey: 'Usuario_id', as: 'profile' });
Creador.belongsTo(Usuario, { foreignKey: 'Usuario_id', as: 'Usuario' });

Usuario.hasMany(Meta, { foreignKey: 'Usuario_id', as: 'goals' });
Meta.belongsTo(Usuario, { foreignKey: 'Usuario_id', as: 'creator' });

Usuario.hasMany(Post, { foreignKey: 'Usuario_id', as: 'posts' });
Post.belongsTo(Usuario, { foreignKey: 'Usuario_id', as: 'creator' });

Post.hasMany(Comentario, { foreignKey: 'post_id', as: 'comments' });
Comentario.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

Usuario.hasMany(Comentario, { foreignKey: 'Usuario_id', as: 'comments' });
Comentario.belongsTo(Usuario, { foreignKey: 'Usuario_id', as: 'follower' });

Usuario.hasMany(Donacion, { foreignKey: 'follower_id', as: 'donations_sent' });
Usuario.hasMany(Donacion, { foreignKey: 'creator_id', as: 'donations_received' });
Donacion.belongsTo(Usuario, { foreignKey: 'follower_id', as: 'follower' });
Donacion.belongsTo(Usuario, { foreignKey: 'creator_id', as: 'creator' });

Usuario.hasMany(Favorito, { foreignKey: 'follower_id', as: 'favorites' });
Usuario.hasMany(Favorito, { foreignKey: 'creator_id', as: 'favorited_by' });
Favorito.belongsTo(Usuario, { foreignKey: 'follower_id', as: 'follower' });
Favorito.belongsTo(Usuario, { foreignKey: 'creator_id', as: 'creator' });

const syncDB = async () => {
  await sequelize.sync({ force: true });
  console.log('Base de datos sincronizada');
};

module.exports = {
  sequelize,
  syncDB,
  Usuario,
  Creador,
  Meta,
  Post,
  Comentario,
  Donacion,
  Favorito,
};
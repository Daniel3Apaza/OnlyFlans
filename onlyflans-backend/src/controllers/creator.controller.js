const { Usuario, Creador, Meta, Post, Comentario, Donacion } = require('../models');
const { Op } = require('sequelize');
const path = require('path');

const getProfile = async (req, res) => {
  try {
    const profile = await Creador.findOne({ where: { Usuario_id: req.Usuario.id } });
    const Usuario = await Usuario.findByPk(req.Usuario.id, { attributes: ['id', 'name', 'email'] });
    return res.json({ Usuario, profile: profile || null });
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const upsertProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const [profile, created] = await Creador.findOrCreate({
      where: { Usuario_id: req.Usuario.id },
      defaults: { bio, Usuario_id: req.Usuario.id },
    });
    if (!created) {
      if (bio !== undefined) profile.bio = bio;
      await profile.save();
    }
    return res.json({ message: 'Perfil actualizado', profile });
  } catch (err) {
    return res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};


const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen' });

    const avatarUrl = `uploads/avatars/${req.file.filename}`;
    const [profile] = await Creador.findOrCreate({
      where: { Usuario_id: req.Usuario.id },
      defaults: { Usuario_id: req.Usuario.id },
    });
    profile.avatar_url = avatarUrl;
    await profile.save();

    return res.json({ message: 'Avatar actualizado', avatar_url: avatarUrl });
  } catch (err) {
    return res.status(500).json({ message: 'Error al subir avatar' });
  }
};

const uploadBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen' });

    const bannerUrl = `uploads/banners/${req.file.filename}`;
    const [profile] = await Creador.findOrCreate({
      where: { Usuario_id: req.Usuario.id },
      defaults: { Usuario_id: req.Usuario.id },
    });
    profile.banner_url = bannerUrl;
    await profile.save();

    return res.json({ message: 'Banner actualizado', banner_url: bannerUrl });
  } catch (err) {
    return res.status(500).json({ message: 'Error al subir banner' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { Usuario_id: req.Usuario.id },
      include: [
        {
          model: Comentario,
          as: 'comments',
          include: [{ model: Usuario, as: 'follower', attributes: ['id', 'name'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener posts' });
  }
};

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'El contenido del post es requerido' });

    const imageUrl = req.file ? `uploads/posts/${req.file.filename}` : null;

    const post = await Post.create({
      Usuario_id: req.Usuario.id,
      content,
      image_url: imageUrl,
    });

    return res.status(201).json({ message: 'Post creado', post });
  } catch (err) {
    return res.status(500).json({ message: 'Error al crear post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, Usuario_id: req.Usuario.id } });
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    await post.destroy();
    return res.json({ message: 'Post eliminado' });
  } catch (err) {
    return res.status(500).json({ message: 'Error al eliminar post' });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Meta.findAll({
      where: { Usuario_id: req.Usuario.id },
      order: [['createdAt', 'DESC']],
    });
    return res.json(goals);
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener metas' });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, description, target_flanes } = req.body;
    if (!title) return res.status(400).json({ message: 'El título de la meta es requerido' });

    const goal = await Meta.create({
      Usuario_id: req.Usuario.id,
      title,
      description,
      target_flanes: target_flanes || null,
    });

    return res.status(201).json({ message: 'Meta creada', goal });
  } catch (err) {
    return res.status(500).json({ message: 'Error al crear meta' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Meta.findOne({ where: { id: req.params.id, Usuario_id: req.Usuario.id } });
    if (!goal) return res.status(404).json({ message: 'Meta no encontrada' });

    const { title, description, target_flanes, is_active } = req.body;
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (target_flanes !== undefined) goal.target_flanes = target_flanes;
    if (is_active !== undefined) goal.is_active = is_active;

    await goal.save();
    return res.json({ message: 'Meta actualizada', goal });
  } catch (err) {
    return res.status(500).json({ message: 'Error al actualizar meta' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Meta.findOne({ where: { id: req.params.id, Usuario_id: req.Usuario.id } });
    if (!goal) return res.status(404).json({ message: 'Meta no encontrada' });
    await goal.destroy();
    return res.json({ message: 'Meta eliminada' });
  } catch (err) {
    return res.status(500).json({ message: 'Error al eliminar meta' });
  }
};

const getIncomeReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Los parámetros start y end son requeridos (formato: YYYY-MM-DD)' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const donations = await Donacion.findAll({
      where: {
        creator_id: req.Usuario.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      include: [
        { model: Usuario, as: 'follower', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalFlanes = donations.reduce((sum, d) => sum + d.flanes, 0);
    const totalBs = donations.reduce((sum, d) => sum + parseFloat(d.amount_bs), 0);

    return res.json({
      period: { start, end },
      total_flanes: totalFlanes,
      total_bs: totalBs.toFixed(2),
      donations_count: donations.length,
      history: donations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al generar reporte' });
  }
};

module.exports = {
  getProfile, upsertProfile, uploadAvatar, uploadBanner,
  getPosts, createPost, deletePost,
  getGoals, createGoal, updateGoal, deleteGoal,
  getIncomeReport,
};
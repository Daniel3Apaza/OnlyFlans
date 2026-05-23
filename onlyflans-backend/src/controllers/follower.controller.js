const { Usuario, Creador, Meta, Post, Comentario, Donacion, Favorito } = require('../models');
const { Op } = require('sequelize');

const FLAN_PRICE_BS = 10;


const listCreators = async (req, res) => {
  try {
    const creators = await Usuario.findAll({
      where: { role: 'creator' },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    return res.json(creators);
  } catch (err) {
    return res.status(500).json({ message: 'Error al listar creadores' });
  }
};

const searchCreators = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'El parámetro q es requerido' });

    const creators = await Usuario.findAll({
      where: {
        role: 'creator',
        name: { [Op.like]: `%${q}%` },
      },
      attributes: ['id', 'name'],
      include: [{ model: Creador, as: 'profile', attributes: ['avatar_url'] }],
      order: [['name', 'ASC']],
    });
    return res.json(creators);
  } catch (err) {
    return res.status(500).json({ message: 'Error al buscar creadores' });
  }
};

const getCreatorProfile = async (req, res) => {
  try {
    const creatorId = req.params.id;

    const creator = await Usuario.findOne({
      where: { id: creatorId, role: 'creator' },
      attributes: ['id', 'name'],
      include: [
        {
          model: Creador,
          as: 'profile',
          attributes: ['bio', 'avatar_url', 'banner_url'],
        },
        {
          model: Meta,
          as: 'goals',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'title', 'description', 'target_flanes'],
        },
      ],
    });

    if (!creator) return res.status(404).json({ message: 'Creador no encontrado' });

    const hasDonated = await Donacion.findOne({
      where: { follower_id: req.Usuario.id, creator_id: creatorId },
    });

    let posts = null;
    if (hasDonated) {
      posts = await Post.findAll({
        where: { Usuario_id: creatorId },
        attributes: ['id', 'content', 'image_url', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });
    }

    return res.json({
      creator,
      has_donated: !!hasDonated,
      posts_locked: !hasDonated,
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener perfil del creador' });
  }
};

const donate = async (req, res) => {
  try {
    const { creator_id, flanes, message } = req.body;

    if (!creator_id || !flanes) {
      return res.status(400).json({ message: 'creator_id y flanes son requeridos' });
    }

    if (flanes < 1 || !Number.isInteger(Number(flanes))) {
      return res.status(400).json({ message: 'Debes enviar al menos 1 flan' });
    }

    const creator = await Usuario.findOne({ where: { id: creator_id, role: 'creator' } });
    if (!creator) return res.status(404).json({ message: 'Creador no encontrado' });

    if (req.Usuario.id === Number(creator_id)) {
      return res.status(400).json({ message: 'No puedes donarte a ti mismo' });
    }

    const amount_bs = Number(flanes) * FLAN_PRICE_BS;

    const donation = await Donacion.create({
      follower_id: req.Usuario.id,
      creator_id,
      flanes: Number(flanes),
      amount_bs,
      message: message || null,
    });

    return res.status(201).json({
      message: `¡Enviaste ${flanes} flan${flanes > 1 ? 'es' : ''} a ${creator.name}!`,
      donation: {
        id: donation.id,
        flanes: donation.flanes,
        amount_bs: donation.amount_bs,
        creator: creator.name,
        createdAt: donation.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al procesar la donación' });
  }
};


const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) return res.status(400).json({ message: 'El comentario no puede estar vacío' });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const hasDonated = await Donacion.findOne({
      where: { follower_id: req.Usuario.id, creator_id: post.Usuario_id },
    });
    if (!hasDonated) {
      return res.status(403).json({ message: 'Debes donar al creador primero para poder comentar' });
    }

    const comment = await Comentario.create({
      post_id: postId,
      Usuario_id: req.Usuario.id,
      content,
    });

    return res.status(201).json({ message: 'Comentario agregado', comment });
  } catch (err) {
    return res.status(500).json({ message: 'Error al agregar comentario' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const creatorId = req.params.creatorId;

    const creator = await Usuario.findOne({ where: { id: creatorId, role: 'creator' } });
    if (!creator) return res.status(404).json({ message: 'Creador no encontrado' });

    const [fav, created] = await Favorito.findOrCreate({
      where: { follower_id: req.Usuario.id, creator_id: creatorId },
    });

    if (!created) {
      return res.status(409).json({ message: 'Ya está en tus favoritos' });
    }

    return res.status(201).json({ message: `${creator.name} agregado a favoritos` });
  } catch (err) {
    return res.status(500).json({ message: 'Error al agregar favorito' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const deleted = await Favorito.destroy({
      where: { follower_id: req.Usuario.id, creator_id: req.params.creatorId },
    });

    if (!deleted) return res.status(404).json({ message: 'No estaba en tus favoritos' });

    return res.json({ message: 'Creador eliminado de favoritos' });
  } catch (err) {
    return res.status(500).json({ message: 'Error al eliminar favorito' });
  }
};

const listFavorites = async (req, res) => {
  try {
    const favorites = await Favorito.findAll({
      where: { follower_id: req.Usuario.id },
      include: [
        {
          model: Usuario,
          as: 'creator',
          attributes: ['id', 'name'],
          include: [{ model: Creador, as: 'profile', attributes: ['avatar_url'] }],
        },
      ],
      order: [[{ model: Usuario, as: 'creator' }, 'name', 'ASC']],
    });
    return res.json(favorites);
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};


const getFeed = async (req, res) => {
  try {
    const donations = await Donacion.findAll({
      where: { follower_id: req.Usuario.id },
      attributes: ['creator_id'],
      group: ['creator_id'],
    });

    const creatorIds = donations.map((d) => d.creator_id);

    if (creatorIds.length === 0) {
      return res.json({ message: 'Aún no sigues a ningún creador. ¡Dona un flan!', posts: [] });
    }

    const posts = await Post.findAll({
      where: { Usuario_id: { [Op.in]: creatorIds } },
      include: [
        {
          model: Usuario,
          as: 'creator',
          attributes: ['id', 'name'],
          include: [{ model: Creador, as: 'profile', attributes: ['avatar_url'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener el feed' });
  }
};

const getDonationHistory = async (req, res) => {
  try {
    const { start, end, creator } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Los parámetros start y end son requeridos (YYYY-MM-DD)' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const where = {
      follower_id: req.Usuario.id,
      createdAt: { [Op.between]: [startDate, endDate] },
    };

    const creatorWhere = {};
    if (creator) {
      creatorWhere.name = { [Op.like]: `%${creator}%` };
    }

    const donations = await Donacion.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'creator',
          attributes: ['id', 'name'],
          where: Object.keys(creatorWhere).length ? creatorWhere : undefined,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalFlanes = donations.reduce((sum, d) => sum + d.flanes, 0);
    const totalBs = donations.reduce((sum, d) => sum + parseFloat(d.amount_bs), 0);

    return res.json({
      period: { start, end },
      creator_filter: creator || null,
      total_flanes: totalFlanes,
      total_bs: totalBs.toFixed(2),
      donations_count: donations.length,
      history: donations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener historial' });
  }
};

module.exports = {
  listCreators,
  searchCreators,
  getCreatorProfile,
  donate,
  addComment,
  addFavorite,
  removeFavorite,
  listFavorites,
  getFeed,
  getDonationHistory,
};
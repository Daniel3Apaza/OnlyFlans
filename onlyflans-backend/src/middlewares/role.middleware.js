const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.Usuario) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    if (req.Usuario.role !== role) {
      return res.status(403).json({
        message: `Acceso denegado. Esta ruta es solo para ${role === 'creator' ? 'creadores' : 'seguidores'}`,
      });
    }
    next();
  };
};

module.exports = requireRole;

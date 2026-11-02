// Pemakaian: requireRole('admin') atau requireRole('admin', 'mentor')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak punya akses ke fitur ini',
      });
    }
    next();
  };
}

module.exports = requireRole;
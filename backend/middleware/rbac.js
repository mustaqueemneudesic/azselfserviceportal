module.exports = function(roles = []){
  return function(req, res, next){
    // For now, expect `req.user.roles` set by auth middleware
    const userRoles = (req.user && req.user.roles) || [];
    // if no role requirements, allow
    if (!roles || roles.length === 0) return next();
    const allowed = roles.some(r=> userRoles.includes(r));
    if (!allowed) return res.status(403).json({ error: 'forbidden' });
    next();
  };
};

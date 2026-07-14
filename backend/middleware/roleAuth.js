const User = require("../models/User");

const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    // `req.user` is attached by authMiddleware — ensure it ran first.
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowed.join(" or ")}.`,
      });
    }

    next();
  };
};

/**
 * Admin-only shortcut (reserved for future admin features).
 */
const requireAdmin = requireRole("admin");

module.exports = { requireRole, requireAdmin };

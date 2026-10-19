/**
 * AUTH MIDDLEWARE
 * Verify JWT token dari Authorization header
 * Gunakan di route yang butuh authentication
 */

const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    // Ambil token dari Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract token (hapus "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach user data ke req object (bisa diakses di controller)
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = authMiddleware;
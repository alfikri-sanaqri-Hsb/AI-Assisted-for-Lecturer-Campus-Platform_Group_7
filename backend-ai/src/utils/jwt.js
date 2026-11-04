const jwt = require('jsonwebtoken');

// Role ikut masuk ke token supaya backend bisa mengecek akses
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError' ? 'Token sudah kedaluwarsa' : 'Token tidak valid'
    );
    error.statusCode = 401;
    throw error;
  }
}

function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = { generateToken, verifyToken, decodeToken };
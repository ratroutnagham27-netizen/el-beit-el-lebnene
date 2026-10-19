const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set in .env - using an insecure development secret.');
}

// Reads "Authorization: Bearer <token>" and attaches the user to req.user
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Only allows users whose role is "admin"
const requireAdmin = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  });

module.exports = { JWT_SECRET, verifyToken, requireAdmin };

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    // Note: In production, JWT_SECRET should be a strong random string in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wiswora_super_secret_key_123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

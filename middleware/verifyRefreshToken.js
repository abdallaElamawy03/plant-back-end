const jwt = require('jsonwebtoken');

const verifyRefreshToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden - Invalid or expired refresh token' });
    }

    req.user = decoded?.UserInfo?.username;
    req.roles = decoded?.UserInfo?.roles;
    next();
  });
};

module.exports = verifyRefreshToken;

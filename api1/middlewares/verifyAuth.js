const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  try {
    const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = {
      id: token.id
    };
    next();
  } catch {
    res.status(401).json({
      message: 'Authentication required.'
    });
  }
};

module.exports = verifyAuth;

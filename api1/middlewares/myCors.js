const myCors = (req, res, next) => {
  if (process.env.CORS_ALLOW_ORIGIN) {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN);
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'POST');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
  }

  next();
}

module.exports = myCors;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { id, password } = req.body;
  
  /**
   * 本来はここでID・パスワードの検証を行いますが、
   * 今回は便宜上、IDとパスワードに入力があれば全てOKとしています。
   */
  if (id && password) {
    const jwtMaxAgeSeconds = parseInt(process.env.JWT_MAX_AGE_MINUTES) * 60;
    const token = jwt.sign(
      {
        id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: jwtMaxAgeSeconds
      }
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: jwtMaxAgeSeconds * 1000
    });
    res.json({
      id,
      name: `ユーザー${id}` // 便宜上、ユーザー名を 「"ユーザー" + ID」に設定しています。
    });
  } else {
    res.status(422).json({
      message: 'Invalid id or password.'
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

module.exports = router;

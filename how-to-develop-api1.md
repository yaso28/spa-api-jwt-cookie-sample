<!-- omit in toc -->
# api1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)
- [環境変数設定](#環境変数設定)
- [CORS対応](#cors対応)
- [認証](#認証)
  - [ログイン・ログアウト](#ログインログアウト)
  - [検証](#検証)

## プロジェクト新規作成

Expressプロジェクトを新規作成します。

```bash
npx express-generator --no-view --git api1
cd api1
npm install
```

不要なファイルを削除します。

```bash
rm -rf public
rm routes/users.js
```

`routes/index.js`を編集して、jsonレスポンスを返すように改変します。

```js:routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to public api.'
  });
});

module.exports = router;
```

`app.js`を編集します。

```js:app.js
// 下記2行を削除します。
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// 省略

// 下記1行を削除します。
// app.use(express.static(path.join(__dirname, 'public')));

// 下記2行を削除します。
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// 下記1行を追加します。
app.use('/', require('./routes/index'));
```

## 環境変数設定

環境変数をファイル管理するパッケージをインストールします。

```bash
npm install dotenv
```

`package.json`を編集して、環境変数をファイルから読み込んで実行するコマンドを追加します。

```diff:package.json
-    "start": "node ./bin/www"
+    "start": "node ./bin/www",
+    "start:env": "node -r dotenv/config ./bin/www"
```

環境変数を設定するファイルを追加します。

```bash
touch .env
```

```:.env
PORT=8000
```

> ここではポート8000で実行するように設定しています。

## CORS対応

SPAとAPIでドメインが異なる場合に備えて、CORS対応をします。

> CORSの詳細は[こちら](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

CORSのmiddlewareを作成します。

```bash
mkdir middlewares
touch middlewares/myCors.js
```

```js:middlewares/myCors.js
const myCors = (req, res, next) => {
  if (process.env.CORS_ALLOW_ORIGIN) {
    // CORS対応
    res.header('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN);
    // Cookieを利用可能にします
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
      // Preflight Request対応
      res.header('Access-Control-Allow-Methods', 'POST');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
  }

  next();
}

module.exports = myCors;
```

`.env`を編集して、CORSの設定を追加します。

```:.env
CORS_ALLOW_ORIGIN=http://localhost:3000
```

> ここではSPAをhttpにてポート3000で実行する想定で `http://localhost:3000` と設定しています。

`app.js`を編集して、CORSのmiddlewareを読み込みます。

```js:app.js
app.use(cookieParser());
// 下記1行を追加します。
app.use(require('./middlewares/myCors'));

app.use('/', require('./routes/index'));
```

## 認証

認証に利用するJSON Web Token(JWT)のパッケージをインストールします。

```bash
npm install jsonwebtoken
```

### ログイン・ログアウト

ログイン・ログアウトのAPIを作成します。

```bash
touch routes/auth.js
```

```js:routes/auth.js
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
    // トークンを生成します。
    const token = jwt.sign(
      {
        id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: jwtMaxAgeSeconds
      }
    );
    // 生成したトークンをCookieにセットします。
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
  // Cookieのトークンを削除します。
  res.clearCookie('token');
  res.status(204).end();
});

module.exports = router;
```

`.env`を編集して、認証（JWT）の設定を追加します。

```:.env
JWT_MAX_AGE_MINUTES=1440
JWT_SECRET=vv2Gp6cuEob4isb6B
```

`app.js`を編集して、作成したログイン・ログアウトAPIを追加します。

```js:app.js
app.use('/', require('./routes/index'));
// 下記1行を追加します。
app.use('/auth', require('./routes/auth'));
```

### 検証

認証済みかどうか検証するmiddlewareを作成します。

```bash
touch middlewares/verifyAuth.js
```

```js:middlewares/verifyAuth.js
const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  try {
    // Cookieにあるトークンを検証します。
    const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    // 認証済みユーザー情報をリクエストにセットします。
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
```

認証で保護対象とするAPIを作成します。

```bash
touch routes/point.js
```

```js:routes/point.js
const express = require('express');
const router = express.Router();

// 今回は便宜上、データ取得処理を簡易的に作っています。（ここから）
const createMonth = (monthDiff) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + monthDiff);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
};
const getPointList = (user) => {
  return [
    { id: 1, month: createMonth(-3), user_id: user.id, acquired: 12, used: 10, remained: 251 },
    { id: 2, month: createMonth(-2), user_id: user.id, acquired: 11, used: 15, remained: 247 },
    { id: 3, month: createMonth(-1), user_id: user.id, acquired: 14, used: 11, remained: 250 },
  ];
};
// 今回は便宜上、データ取得処理を簡易的に作っています。（ここまで）

router.get('/list', (req, res) => {
  // verifyAuthでセットした認証済みユーザー情報をここで取得できます。
  const user = req.user;

  const pointList = getPointList(user);
  const resultList = pointList.map(row => ({ id: row.id, month: row.month }));
  res.json(resultList);
});

router.get('/get/:id', (req, res) => {
  // verifyAuthでセットした認証済みユーザー情報をここで取得できます。
  const user = req.user;

  const id = parseInt(req.params.id);
  const pointList = getPointList(user);
  const pointRow = pointList.find(row => row.id === id);

  if (pointRow) {
    res.json(pointRow);
  } else {
    res.status(404).json({
      message: 'Not found.'
    });
  };
});

module.exports = router;
```

`app.js`を編集して、作成したAPIを認証で保護して追加します。

```js:app.js
app.use('/auth', require('./routes/auth'));

// 下記2行を追加します。
const verifyAuth = require('./middlewares/verifyAuth');
app.use('/point', verifyAuth, require('./routes/point'));
```

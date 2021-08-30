<!-- omit in toc -->
# api1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)
- [環境変数設定](#環境変数設定)
- [CORS対応](#cors対応)

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
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
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

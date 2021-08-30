<!-- omit in toc -->
# api1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)

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

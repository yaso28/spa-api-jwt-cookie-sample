<!-- omit in toc -->
# spa-api-jwt-cookie-sample

- [ローカルでの利用方法](#ローカルでの利用方法)
  - [api1](#api1)
  - [spa1](#spa1)
- [開発手順](#開発手順)

## ローカルでの利用方法

このリポジトリをgit cloneします。

### api1

api1ディレクトリに移動したのち、パッケージをインストールします。

```bash
cd api1
npm ci
```

環境変数設定ファイルをコピーします。

```bash
cp .env.example .env
```

> コピーした`.env`ファイルを必要に応じて編集します。

下記コマンドで実行します。

```bash
npm run start:env
```

### spa1

spa1ディレクトリに移動したのち、パッケージをインストールします。

```bash
cd spa1
npm ci
```

下記コマンドで実行します。

```bash
npm start
```

## 開発手順

- api1 - [こちら](./how-to-develop-api1.md)
- spa1 - [こちら](./how-to-develop-spa1.md)

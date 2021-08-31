<!-- omit in toc -->
# spa-api-jwt-cookie-sample

- [概要](#概要)
- [ローカルでの利用方法](#ローカルでの利用方法)
  - [api1](#api1)
  - [spa1](#spa1)
- [開発手順](#開発手順)

## 概要

認証情報をJson Web Token(JWT)としてCookie上で管理するSPA-APIアプリケーションのサンプルです。

このアプリケーションでは、2種類のデータをCookie上で発行・保持・破棄する事により、認証状態を管理しています。

| Key | データ | 発行者・利用者・破棄者 | 保持者 | 用途 |
| --- | --- | --- | --- | --- |
| token | Json Web Token（ユーザーIDを含む） | API | SPA | APIがSPAからのリクエストを受け付ける際、リクエストのCookieにあるJWTデータを検証して、認証の有無を判別します。 |
| username | ユーザー名 | SPA | SPA | SPA内にて認証の有無を判別するために利用します。（APIとは関係ありません。）またユーザー名の画面表示にも利用します。 |

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
環境変数設定ファイルをコピーします。

```bash
cp .env.development.local.example .env.development.local
```

> コピーした`.env.development.local`ファイルを必要に応じて編集します。

下記コマンドで実行します。

```bash
npm start
```

## 開発手順

- api1 - [こちら](./how-to-develop-api1.md)
- spa1 - [こちら](./how-to-develop-spa1.md)

<!-- omit in toc -->
# spa-api-jwt-cookie-sample

- [ローカルでの利用方法](#ローカルでの利用方法)
  - [api1](#api1)
  - [spa1](#spa1)

## ローカルでの利用方法

このリポジトリをGit cloneします。

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

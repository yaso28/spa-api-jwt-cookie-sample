<!-- omit in toc -->
# spa1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)
- [API呼び出し](#api呼び出し)

## プロジェクト新規作成

Reactプロジェクトを新規作成します。

```bash
npx create-react-app spa1
cd spa1
```

## API呼び出し

axiosをインストールして設定します。

```bash
npm install axios
mkdir src/services
touch src/services/myAxios.js
```

```js:src/services/myAxios.js
import axios from 'axios';

const myAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
  withCredentials: true // Cookieを利用可能にします。
});

export default myAxios;
```

環境変数ファイルを作成して、APIのURLを設定します。

```bash
touch .env.development.local
```

```:.env.development.local
REACT_APP_API_BASE_URL=http://localhost:8000
```

> ここではAPIをhttpにてポート3000で実行する想定で `http://localhost:8000` と設定しています。

API呼び出しを実装します。

```bash
touch src/services/apiCall.js
```

```js:src/services/apiCall.js
import myAxios from './myAxios';

const get = (url) => myAxios.get(url);
const post = (url, data = {}) => myAxios.post(url, data);

const apiCall = {
  getIndex: () => get('/'),
  login: (data = {}) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  getPointList: () => get('/point/list'),
  getPoint: (id) => get(`/point/get/${id}`),
};

export default apiCall;
```

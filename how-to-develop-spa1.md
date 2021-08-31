<!-- omit in toc -->
# spa1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)
- [ページ遷移](#ページ遷移)
- [API呼び出し](#api呼び出し)

## プロジェクト新規作成

Reactプロジェクトを新規作成します。

```bash
npx create-react-app spa1
cd spa1
```

## ページ遷移

ページを作成します。

```bash
mkdir src/pages
touch src/pages/Home.js
touch src/pages/Login.js
touch src/pages/MyPage.js
touch src/pages/Point.js
```

```jsx:src/pages/Home.js
const Home = () => {
  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
```

> いったんタイトルだけの空のページを作成します。

> 他のページも同様に空のページを作成します。

ページ遷移に利用するReact Routerをインストールします。

```bash
npm install react-router-dom
```

共通部分のヘッダーとフッターを作成します。

```bash
mkdir src/components
touch src/components/Header.js
touch src/components/Header.css
touch src/components/Footer.js
touch src/components/Footer.css
```

```jsx:src/components/Header.js
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink exact to="/login">Login</NavLink></li>
          <li><NavLink exact to="/my-page">My Page</NavLink></li>
          <li><NavLink exact to="/point/1">Point</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```

```css:src/components/Header.css
header {
  border-bottom: 1px gray solid;
}

nav ul {
  list-style: none;
  display: flex;
  padding: 0 1rem;
}

nav li {
  margin-right: 1rem;
}
```

```jsx:src/components/Footer.js
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      SPA-API JWT Cookie Sample.
    </footer>
  )
};

export default Footer;
```

```css:src/components/Footer.css
footer {
  display: flex;
  min-height: 50px;
  justify-content: center;
  align-items: center;
  border-top: 1px gray solid;
}
```

`src/App.js`を編集して、ヘッダーとフッターの追加およびページ遷移のルート定義を行います。

```jsx:src/App.js
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Point from './pages/Point';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/my-page" exact component={MyPage} />
            <Route path="/point/:id" exact component={Point} />
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
```

`src/App.css`を編集して、デザインを調整します。

```css:src/App.css
#root {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 1rem;
}

h1 {
  margin: 1rem 0;
}
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

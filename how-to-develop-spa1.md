<!-- omit in toc -->
# spa1 開発手順

- [プロジェクト新規作成](#プロジェクト新規作成)
- [ページ遷移](#ページ遷移)
- [API呼び出し](#api呼び出し)
- [認証](#認証)
- [各ページの実装](#各ページの実装)

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
touch src/pages/NotFound.js
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

nav li a {
  text-decoration: none;
  color: white;
  background-color: gray;
  padding: 5px;
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
import NotFound from './pages/NotFound';

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
            <Route component={NotFound} />
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

## 認証

認証状態の管理をCookieで行うため、Cookieを操作するパッケージをインストールします。

```bash
npm install react-cookie
```

`src/pages/Login.js`を編集して、ログインフォームを実装します。

```src/pages/Login.js
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import apiCall from '../services/apiCall';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const [cookies, setCookie] = useCookies();

  const onIdChange = (event) => {
    setId(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!id || !password) {
      alert('ID and password required.');
      return;
    };
    
    try {
      const response = await apiCall.login({ id, password });
      // Cookieにユーザー名をセットします。
      setCookie('username', response.data.name, { maxAge: process.env.REACT_APP_AUTH_MAX_AGE_MINUTES * 60 });
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (cookies.username) {
      history.push('/my-page');
    }
  }, [cookies, history]);

  return (
    <>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>ID: <input type="text" value={id} onChange={onIdChange} /></label>
        </div>
        <div>
          <label>Password: <input type="text" value={password} onChange={onPasswordChange} /></label>
        </div>
        <div>
          <input type="submit" value="Login" />
        </div>
      </form>
    </>
  );
};

export default Login;
```

`.env.development.local`を編集して、認証状態管理の設定を追加します。

```:.env.development.local
REACT_APP_AUTH_MAX_AGE_MINUTES=1200
```

`src/components/Header.js`を編集します。

- 認証の有無に応じて、ナビゲーションリンクを切り替えます。
- ログアウトの処理を実装します。

```jsx:src/components/Header.js
import { NavLink, useHistory } from 'react-router-dom';
import './Header.css';
import { useCookies } from 'react-cookie';
import apiCall from '../services/apiCall';

const Header = () => {
  const [cookies, , removeCookie] = useCookies();
  const history = useHistory();

  const onLogoutClick = async (event) => {
    event.preventDefault();
    try {
      await apiCall.logout();
      // Cookieのユーザー名を削除します。
      removeCookie('username');
      history.push('/login');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          <li>Welcome, {cookies.username ?? 'Guest'} !</li>
          <li><NavLink exact to="/">Home</NavLink></li>
          {cookies.username
            ?
            <>
              <li><NavLink exact to="/my-page">My Page</NavLink></li>
              <li><a href="#!" onClick={onLogoutClick}>Logout</a></li>
            </>
            :
            <>
              <li><NavLink exact to="/login">Login</NavLink></li>
            </>
            }
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```

> Cookieにおけるユーザー名の有無によって、認証状態を管理する仕様にしてします。

## 各ページの実装

`src/pages/Home.js`を編集します。

```jsx:src/pages/Home.js
import { useState, useEffect } from 'react';
import apiCall from '../services/apiCall';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await apiCall.getIndex();
        setMessage(response.data.message);
      } catch (e) {
        alert(e.message);
      }
    };
    getMessage();
  }, []);

  return (
    <>
      <h1>Home</h1>
      
      <p>{message}</p>
    </>
  );
};

export default Home;
```

`src/pages/MyPage.js`を編集します。

```jsx:src/pages/MyPage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiCall from '../services/apiCall';

const MyPage = () => {
  const [pointList, setPointList] = useState([]);

  useEffect(() => {
    const getPointList = async () => {
      try {
        const response = await apiCall.getPointList();
        setPointList(response.data);
      } catch (e) {
        alert(e.message);
      }
    };
    getPointList();
  }, []);

  return (
    <>
      <h1>MyPage</h1>

      <h2>Points</h2>
      <ul>
        {pointList.map((pointRow) =>
          <li key={pointRow.id}>
            <Link to={`/point/${pointRow.id}`}>{pointRow.month}</Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default MyPage;
```

`src/pages/Point.js`を編集します。

```jsx:src/pages/Point.js
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiCall from '../services/apiCall';

const Point = () => {
  const { id } = useParams();
  const [point, setPoint] = useState(null);

  useEffect(() => {
    const getPoint = async (id) => {
      try {
        const response = await apiCall.getPoint(id);
        setPoint(response.data);
      } catch (e) {
        setPoint(null);
        alert(e.message);
      }
    };
    getPoint(id);
  }, [id]);

  return (
    <>
      <h1>Point</h1>

      {point &&
        <>
          <h2>{point.month}</h2>
          <table>
            <tbody>
              <tr>
                <th>Acquired</th>
                <td>{point.acquired} points</td>
              </tr>
              <tr>
                <th>Used</th>
                <td>{point.used} points</td>
              </tr>
              <tr>
                <th>Remained</th>
                <td>{point.remained} points</td>
              </tr>
            </tbody>
          </table>
        </>
      }

      <ul>
        <li><Link to={`/point/${parseInt(id) - 1}`}>Previous</Link></li>
        <li><Link to={`/point/${parseInt(id) + 1}`}>Next</Link></li>
        <li><Link to="/my-page">Back</Link></li>
      </ul>
    </>
  );
};

export default Point;
```

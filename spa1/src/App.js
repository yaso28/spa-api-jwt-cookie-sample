import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Point from './pages/Point';
import NotFound from './pages/NotFound';
import AuthRoute from './components/AuthRoute';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <AuthRoute path="/my-page" exact component={MyPage} />
            <AuthRoute path="/point/:id" exact component={Point} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;

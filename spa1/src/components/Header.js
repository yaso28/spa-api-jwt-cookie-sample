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

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
          <li><NavLink exact to="/point">Point</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

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

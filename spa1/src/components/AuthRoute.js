import { useCookies } from 'react-cookie';
import { Redirect, Route } from 'react-router-dom';

const AuthRoute = (props) => {
  const [cookies] = useCookies();

  if (cookies.username) {
    return <Route {...props} />
  } else {
    return <Redirect from={props.path} to="/login" />
  }
};

export default AuthRoute;

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//import { fakeAuth } from '../Components/UserAuthentication';
import { useAuth } from '../Provider/authProvider';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/auth', {
        state: { from: location },
        replace: true,
      });
    }
  }, [navigate, location, token]);

  return token ? children : null;

  /*
  useEffect(() => {
    if (!fakeAuth.isAuthenticated) {
      navigate('/auth', {
        state: { from: location },
        replace: true,
      });
    }
  }, [navigate, location]);

  return fakeAuth.isAuthenticated ? children : null;
  */
};

export default PrivateRoute;
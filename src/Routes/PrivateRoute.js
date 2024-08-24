import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';

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
};

export default PrivateRoute;
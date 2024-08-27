import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      navigate('/auth', {
        state: { from: location },
        replace: true,
      });
    }
  }, [navigate, location, accessToken]);

  return accessToken ? children : null;
};

export default PrivateRoute;
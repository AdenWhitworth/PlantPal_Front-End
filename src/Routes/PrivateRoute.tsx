import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ 
  children
}: PrivateRouteProps) => {
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
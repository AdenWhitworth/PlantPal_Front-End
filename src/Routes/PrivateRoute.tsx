import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider/AuthProvider';
import { PrivateRouteProps } from './PrivateRouteTypes';

/**
 * A component that protects its children by checking for an authentication token.
 * If the user is not authenticated, they are redirected to the authentication page.
 *
 * @param {PrivateRouteProps} props - The properties for the PrivateRoute component.
 * @returns {JSX.Element|null} - Returns the children if authenticated; otherwise, null.
 */
const PrivateRoute = ({ 
  children
}: PrivateRouteProps): JSX.Element | null => {
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
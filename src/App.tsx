import './App.css';
import Landing from  './Containers/Landing/Landing';
import Authentication from  './Containers/Authentication/Authentication';
import Dashboard from './Containers/Dashboard/Dashboard';
import ForgotPassword from './Containers/Authentication/ForgotPassword/ForgotPassword';
import ResetPassword from './Containers/Authentication/ResetPassword/ResetPassword';
import React from 'react';
import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Provider/AuthProvider/AuthProvider';
import { SocketProvider } from './Provider/SocketProvider/SocketProvider';
import { DeviceProvider } from './Provider/DeviceProvider/DeviceProvider';

/**
 * The main App component that defines the routing and providers for the application.
 *
 * @component
 * @returns {JSX.Element} The JSX element containing the routes and providers for the app.
 *
 * @description
 * This component wraps the app's main routes with context providers:
 * - `DeviceProvider`: Provides device-related state and functionality.
 * - `AuthProvider`: Manages authentication state and processes.
 * - `SocketProvider`: Establishes and manages socket connections.
 *
 * The app uses `react-router-dom`'s `Routes` to define the following paths:
 * - `/`: The landing page (`Landing` component).
 * - `/auth`: The authentication page (`Authentication` component).
 * - `/dashboard`: A private route (`PrivateRoute`) that renders the dashboard (`Dashboard` component).
 * - `/forgotPassword`: The forgot password page (`ForgotPassword` component).
 * - `/resetPassword`: The reset password page (`ResetPassword` component).
 */
function App(): JSX.Element {
  
  return (
    <div className="App">
      <DeviceProvider>
        <AuthProvider>
          <SocketProvider url={process.env.REACT_APP_BASE_URL as string}>
            <Routes>
              <Route path='/' element={<Landing></Landing>}></Route>
              <Route path='/auth' element={<Authentication></Authentication>}></Route>
              <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
              <Route path='/forgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
              <Route path='/resetPassword' element={<ResetPassword></ResetPassword>}></Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </DeviceProvider>
    </div>
  );
}

export default App;

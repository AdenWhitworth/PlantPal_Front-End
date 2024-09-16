import './App.css';
import Landing from  './Containers/Landing/Landing';
import Authentication from  './Containers/Authentication/Authentication';
import Dashboard from './Containers/Dashboard/Dashboard';
import ForgotPassword from './Containers/Authentication/ForgotPassword/ForgotPassword';
import ResetPassword from './Containers/Authentication/ResetPassword/ResetPassword';
import React from 'react';
import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Provider/AuthProvider';
import { SocketProvider } from './Provider/SocketProvider';
import { DeviceProvider } from './Provider/DeviceProvider';

function App() {
  
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

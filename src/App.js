import './App.css';
import Landing from  './Containers/Landing/Landing';
import UserAuthentication from  './Containers/Authentication/UserAuthentication';
import Dashboard from './Containers/Dashboard/Dashboard';
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
          <SocketProvider url={process.env.REACT_APP_BASE_URL}>
            <Routes>
              <Route path='/' element={<Landing></Landing>}></Route>
              <Route path='/auth' element={<UserAuthentication></UserAuthentication>}></Route>
              <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </DeviceProvider>
    </div>

  );
}

export default App;

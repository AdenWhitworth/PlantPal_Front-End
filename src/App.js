import './App.css';
import Landing from  './Containers/Landing';
import UserAuthentication from  './Containers/UserAuthentication';
import Dashboard from  './Containers/Dashboard';
import React from 'react';
import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Provider/authProvider';
import { SocketProvider } from './Provider/SocketProvider';

function App() {
  
  return (

    <div className="App">
      <AuthProvider>
        <SocketProvider url={process.env.REACT_APP_BASE_URL}>
          <Routes>
            <Route path='/' element={<Landing></Landing>}></Route>
            <Route path='/auth' element={<UserAuthentication></UserAuthentication>}></Route>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </div>

  );
}

export default App;

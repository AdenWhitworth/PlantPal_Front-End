import './App.css';
import Landing from  './Components/Landing';
import UserAuthentication from  './Components/UserAuthentication';
import Dashboard from  './Components/Dashboard';
import React from 'react';

import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import AuthProvider from './Provider/authProvider';

function App() {

  return (

    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/auth' element={<UserAuthentication></UserAuthentication>}></Route>
          <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
        </Routes>
      </AuthProvider>
    </div>

  );
}

export default App;

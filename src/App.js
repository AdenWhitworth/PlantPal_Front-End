import './App.css';
import Landing from  './Containers/Landing';
import UserAuthentication from  './Containers/UserAuthentication';
import Dashboard from  './Containers/Dashboard';
import React, {useState, useEffect} from 'react';
import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import AuthProvider from './Provider/authProvider';
import { SocketProvider } from './Hooks/SocketProvider';
import { io } from "socket.io-client";

function App() {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    user_id: null
  });
  
  return (

    <div className="App">
      <SocketProvider url={process.env.REACT_APP_BASE_URL}>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Landing></Landing>}></Route>
            <Route path='/auth' element={<UserAuthentication setUser={setUser} user={user}></UserAuthentication>}></Route>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard setUser={setUser} user={user}></Dashboard></PrivateRoute>}></Route>
          </Routes>
        </AuthProvider>
      </SocketProvider>
    </div>

  );
}

export default App;

import './App.css';
import Landing from  './Containers/Landing';
import UserAuthentication from  './Containers/UserAuthentication';
import Dashboard from  './Containers/Dashboard';
import React, {useState} from 'react';
import PrivateRoute from './Routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import AuthProvider from './Provider/authProvider';

function App() {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  return (

    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/auth' element={<UserAuthentication setUser={setUser}></UserAuthentication>}></Route>
          <Route path='/dashboard' element={<PrivateRoute><Dashboard setUser={setUser} user={user}></Dashboard></PrivateRoute>}></Route>
        </Routes>
      </AuthProvider>
    </div>

  );
}

export default App;

import './App.css';
import Landing from  './Components/Landing';
import UserAuthentication from  './Components/UserAuthentication';
import Dashboard from  './Components/Dashboard';
import React, { useState } from 'react';

function App() {

  const [manageDevices, setManageDevices] = useState(false);

  const [user, setUser] = useState(false);

  return (
    <div className="App">
      
      {user? <Dashboard setUser={setUser}></Dashboard> : <></>}

      {manageDevices? <UserAuthentication setManageDevices={setManageDevices} setUser={setUser}></UserAuthentication> : <Landing setManageDevices={setManageDevices}></Landing>}

    </div>
  );
}

export default App;

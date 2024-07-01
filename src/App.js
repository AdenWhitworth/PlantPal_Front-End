import './App.css';
//import Landing from  './Components/Landing';
//import UserAuthentication from  './Components/UserAuthentication';
import Dashboard from  './Components/Dashboard';
import React, { useState } from 'react';

function App() {

  const [manageDevices, setManageDevices] = useState(false);

  return (
    <div className="App">
      
      <Dashboard></Dashboard>
      
      {/*}
      {manageDevices? <UserAuthentication setManageDevices={setManageDevices}></UserAuthentication> : <Landing setManageDevices={setManageDevices}></Landing>}
      */}
    </div>
  );
}

export default App;

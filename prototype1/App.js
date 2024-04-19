import * as React from 'react';
import Layout from './components/Layout';
import LoginScreen from './screens/Login';
import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return (
      isLoggedIn? <Layout /> : <LoginScreen OnLogin={handleLogin}/>
  );
}

export default App;
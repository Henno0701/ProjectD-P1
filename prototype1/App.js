import * as React from 'react';
import Layout from './components/Layout';
import LoginScreen from './screens/Login';


function App() {
  isLoggedIn = false;
  return (
      isLoggedIn? <Layout /> : <LoginScreen/>
  );
}

export default App;
import * as React from 'react';
import { useState, useEffect } from 'react'
import { Text } from 'react-native';
import Layout from './components/Layout';
import { Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import LoginScreen from './screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getData('LoggedIn');
  }, []);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error)
      setIsLoggedIn(false);
    }
  };
  const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Data removed successfully!');
    } catch (error) {
      console.log('Error removing data:', error);
    }
  };

  let [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // removeData('LoggedIn')
  //getData('LoggedIn')
  
  //Henk@gmail.com, HenkPassword
  return isLoggedIn ? (
    <Layout onLogout={() => {
      removeData('LoggedIn');
      setIsLoggedIn(false);
    }} />
    ) : (
      <LoginScreen onLogin={() => getData('LoggedIn')} />
    );
}

export default App;
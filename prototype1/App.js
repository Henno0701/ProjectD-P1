import * as React from 'react';
import { Text } from 'react-native';
import Layout from './components/Layout';
import {  Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';

function App() {
  let [fontsLoaded] = useFonts ({
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <Layout />
  );
}

export default App;
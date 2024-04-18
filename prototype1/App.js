import * as React from 'react';
import { Text } from 'react-native';
import Layout from './components/Layout';
import {  Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';

function App() {
  let [fontsLoaded] = useFonts ({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <Layout />
  );
}

export default App;
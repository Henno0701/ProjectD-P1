import {View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Logo from '../images/SchubergPhilis_White.png';
import Pant from '../images/Brandpage-Schuberg-Philis.png';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({OnLogin}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setError] = useState('');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (email, password) => {
    //handle login
    correct = false;
    const accounts = await fetchAccounts();
    accounts.forEach(account => {
      if (account.email == email && account.password == password) {
        correct = true;
      }
    });
    if (correct) {
      OnLogin();
    }
    else
    {
      setError("Email or Password is invalid.");
    }
    
  };

  const fetchAccounts = async() => {
    try {
      const response = await fetch('http://192.168.2.22:8080/readAccounts'); //IP moet misschien verandert worden op andere apparaten
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return null;
    }
  };

  const handleMakeAccount = () => {
    //handle Make Account
    console.log('Make Account');
  };

  const handleForgotPassword = () => {
    //handle Forgot Password
    console.log('Forgot Password');
  };

  return (
    <View className="flex-1 bg-main_bg_color">
      <ImageBackground
      className="flex-1"
      source={Pant}
      imageStyle={{opacity:0.3, width: '200%', height: Dimensions.get('window').height,}}
      >
        <View className="items-center mb-14 mt-44">
        <Image
          source={Logo}
          style={{width: 225, height: 61}}
        />
        </View>
        <View className="p-5 ml-5 mr-5 w-auto h-auto justify-between flex flex-col bg-secondary_bg_color rounded-xl">
          <View className="items-center">{errorMessage != '' ? <Text className="text-[#fc0303] mb-1">{errorMessage}</Text>: null}</View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="grey"
            className="h-14 w-auto text-base text-wit bg-main_bg_color rounded-md"
            style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}
          />

          <View className="mt-5" >
            <View className="mb-1 h-14 w-auto bg-main_bg_color rounded-md flex flex-row align-middle relative">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="grey"
                secureTextEntry={!showPassword}
                className="flex-grow text-wit mr-14"
                style={{ paddingLeft: 10 }}
              />
              <TouchableOpacity onPress={toggleShowPassword} className="absolute right-0 top-0 bottom-0 flex items-center justify-center mr-5">
                <FontAwesome5
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={24}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleForgotPassword} >
              <Text className="text-[#808080]">Forgot password</Text>
            </TouchableOpacity>
          </View>
        </View>


        <LinearGradient
            colors={['#1E80ED', '#5FA6F4']}
            start={{ x: 0, y: 0 }} // Gradient start point (left)
            end={{ x: 1, y: 0 }}   // Gradient end point (right)
          className="p-3 m-5 rounded-md"
        >
          <TouchableOpacity onPress={() => handleLogin(email, password)} className="align-middle">
            <Text className="text-wit text-center font-bold text-lg">Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View className="flex-row items-center ml-5 mr-5 mb-5">
          <View className="flex-1 h-0.5 bg-wit" />
          <View>
            <Text className="w-10 text-center text-wit" >Or</Text>
          </View>
          <View className="flex-1 h-0.5 bg-wit" />
        </View>
        <View className="flex-row justify-center" >
          <TouchableOpacity onPress={handleMakeAccount}>
            <Text className="text-wit font-bold text-lg underline">Create Account</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  );
}

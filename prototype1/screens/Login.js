import {View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Logo from '../images/SchubergPhilis_White.png';
import Pant from '../images/Brandpage-Schuberg-Philis.png';
import { LinearGradient } from 'expo-linear-gradient';





export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    //handle login
    console.log('Login');
  };

  return (
    <View className="flex-1 bg-main_bg_color">
      <ImageBackground
      className="flex-1"
      source={Pant}
      imageStyle={{opacity:0.3, width: '200%', }}
      >
        <View className="items-center mb-14 mt-44">
        <Image
          source={Logo}
          style={{width: 225, height: 61}}
        />
        </View>
        <View className="mr-5 ml-5 w-auto h-48 justify-between flex flex-col bg-secondary_bg_color rounded-xl">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="grey"
            className="mt-5 mr-5 ml-5 h-14 w-auto text-base text-wit bg-main_bg_color rounded-md"
            style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}
          />

          <View className="mr-5 ml-5 mb-5" >
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
            <TouchableOpacity onPress={handleLogin} >
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
          <TouchableOpacity onPress={handleLogin} className="align-middle">
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
          <TouchableOpacity >
            <Text className="text-wit font-bold text-lg underline">Create Account</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  );
}

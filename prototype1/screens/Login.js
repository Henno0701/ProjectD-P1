import { text } from '@fortawesome/fontawesome-svg-core';
import { Button, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';




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
      <View className="mt-28 items-center mb-5">
        <View className="bg-third_bg_color rounded-full mr-2 p-5">
          <FontAwesome5 name="user" size={50} color="white"/>
        </View>
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

      <TouchableOpacity onPress={handleLogin} className="bg-schuberg_blue p-3 align-middle mt-10 ml-16 mr-16 rounded-md">
          <Text className="text-wit text-center font-bold text-lg">Login</Text>
      </TouchableOpacity>

    </View>
  );
}

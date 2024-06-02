import {View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import Logo from '../images/SchubergPhilis_White.png';
import Pant from '../images/Brandpage-Schuberg-Philis.jpg';
import { LinearGradient } from 'expo-linear-gradient';
import CryptoJS from 'crypto-js';
import axios from 'axios';
// import {
//   createConfig,
//   signInWithBrowser,
//   signOut,
//   getAccessToken,
//   isAuthenticated,
//   getUser,
//   getUserFromIdToken,
//   refreshTokens,
//   EventEmitter,
// } from '@okta/okta-react-native';

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const oktaConfig = {
    //ypur application id from okta
    clientId: "0oahdzst51ganDQP05d7",
    //yout domain from okta
    domain: "https://dev-50508157.okta.com",
    // yout domain + /oauth2/default
    issuerUrl: "https://dev-50508157.okta.com/oauth2/default",
    //callback configured in okta signin url
    callbackUrl: "com.dev-50508157.okta.ProjectTest2:/callback",
};

//import {oktaConfig}  from '../oktaConfig';


export default function LoginScreen({onLogin}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setError] = useState('');

  const [authState, setAuthState] = useState(null);

  const discovery = AuthSession.useAutoDiscovery(oktaConfig.issuerUrl);

  const loginWithOkta = async () => {
    try {
      setAuthState(null);
      const request = new AuthSession.AuthRequest({
        clientId: oktaConfig.clientId,
        redirectUri: oktaConfig.callbackUrl,
        prompt: AuthSession.Prompt.SelectAccount,
        scopes: ["openid", "profile", "email"],
        usePKCE: true,
        extraParams: {},
      });

      const result = await request.promptAsync(discovery);

      const code = JSON.parse(JSON.stringify(result)).params.code;
      setAuthState(result);

      const tokenRequestParams = {
        code,
        clientId: oktaConfig.clientId,
        redirectUri: oktaConfig.callbackUrl,
        extraParams: {
          code_verifier: String(request?.codeVerifier),
        },
      };
      const tokenResult = await AuthSession.exchangeCodeAsync(
        tokenRequestParams,
        discovery
      );

      const accessToken = tokenResult.accessToken;

      const usersRequest = `${oktaConfig.issuerUrl}/v1/userinfo`;
      const userPromise = await axios.get(usersRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = userPromise.data;
      // console.log("\n\nUser data:", userPromise.data);
      // console.log("\n\nOkta Token: ", accessToken);

      if (userData.email != null) {
        // Save the email of the logged-in user
        saveData("LoggedIn", userData.email);
        onLogin()
      }
    } catch (error) {
      console.log("Error:", error);
    }
    
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('Data retrieved successfully:', value);
        return value;
      } else {
        console.log('No data found for the given key');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
      return null;
    }
  };

  const handleLogin = async (email, password) => {
    setAuthState(null)
    //handle login
    correct = false;

    correct = await handleSubmit(email, ConvertPassword(password))
    
    if (correct) 
    {
        setError("")
        await saveData("LoggedIn", email);
        onLogin()
    }

    setError("Email or Password is invalid.");
    
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
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} 
          className="p-3 m-5 rounded-md"
        >
          <TouchableOpacity onPress={() => handleLogin(email, password)} className="align-middle">
            <Text className="text-wit text-center font-bold text-lg">Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View className="flex-row items-center ml-5 mr-5">
          <View className="flex-1 h-0.5 bg-wit" />
          <View>
            <Text className="w-10 text-center text-wit" >Or</Text>
          </View>
          <View className="flex-1 h-0.5 bg-wit" />
        </View>

        <View className="justify-center" >
        <LinearGradient
            colors={['#6f39db', '#5FA6F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} 
          className="p-3 m-5 rounded-md"
        >
            <TouchableOpacity onPress={loginWithOkta} className="align-middle">
            <Text className="text-wit text-center font-bold text-lg">Okta Login</Text>
            </TouchableOpacity>
        </LinearGradient>
        </View>

      </ImageBackground>
    </View>
  );
}

const handleSubmit = async (email, password)  => {
  const Email = email;
  const Password = password; 

  try {
    const response = await fetch('http://192.168.2.22:8080/checkAccounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(Email)}&password=${encodeURIComponent(Password)}`,
    });

    if (!response.ok) {
      return false
    }

    // const data = await response.text();
    // console.log('Account exists:', data); // Will log "true" or "false" depending on server response
    return true
  } catch (error) {
    // console.error('Error:', error);
    return false
  }
};

const ConvertPassword = (password) =>
  {
    const hash = CryptoJS.SHA1(password).toString();
    return hash
  }

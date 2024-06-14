import { Image, Text, View, Pressable, Modal, TextInput, Button, TouchableOpacity, ScrollView, Switch, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import { IP } from '@env';

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from 'axios';
import { Alert } from 'react-native';


import ButtonList from '../components/Button-List';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressBook, faCar, faChevronRight, faCircle, faMinusCircle, faShieldHalved, faUser, faUserCircle, faAddressCard, faCircleHalfStroke, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

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

export default function ProfileOverviewScreen({ navigation , route}) {
    const insets = useSafeAreaInsets();
    const [accountName, setAccountName] = useState("Henno Passchier");
    const [isAccountModalVisible, setAccountModalVisible] = useState(false);
    const [editedAccountName, setEditedAccountName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image
    const { onLogout } = route.params || {};
    const [authState, setAuthState] = useState(null);
    const discovery = AuthSession.useAutoDiscovery(oktaConfig.issuerUrl);
    const [response, setResponse] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
  
    // Fetch account name from server when component mounts
    useEffect(() => {
      fetchAccountName();
    }, []);

    // Function to fetch account name from server
    const fetchAccountName = async () => {
      try {
        const response = await fetch(`http://${IP}:8080/getName`); // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
        const data = await response.json();
        // Update the account name state
        setAccountName(data.name);
      } catch (error) {
        console.error('Error fetching account name:', error);
      }
    };

    const selectUser = async (userID) => {

      try {
        const response = await fetch(`http://${IP}:8080/selectUser?ID=${userID}`);
        
        console.log(response)
        if (!response.ok) {
          return null;
        }
    
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    };
    

    const linkOktaAccount = async () =>
      {
        const userIdString = await AsyncStorage.getItem('LoggedIn');
        const userId = parseInt(userIdString);

        const result = await selectUser(userId);

        console.log(result)
        if (result.oktaID != null){
          createAlreadyLinked()
          return
        }

        WebBrowser.maybeCompleteAuthSession();

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
      
            if (userData.sub != null) {
              // Save the email of the logged-in user
              handleLinkOktaId(userData.sub, userId)
              console.log(userData.sub)

            }
          } catch (error) {
            console.log("Error:", error);
          }
          
        };

        loginWithOkta()
      }
          
      const handleLinkOktaId = async (oktaId, userId) => {

        try {
          const response = await fetch(`http://${IP}:8080/updateUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${encodeURIComponent(userId)}&oktaId=${encodeURIComponent(oktaId)}`,
          });
    
          if (!response.ok) {
            throw new Error('Failed to link Okta ID');
          }
    
          // Handle success response
          Alert.alert('Success', 'Okta ID linked successfully');
        } catch (error) {
          // Handle errors
          Alert.alert('Error', error.message);
        }
      };



    const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
    }

    const createAlreadyLinked = () =>
      Alert.alert('Your account is already linked.', '', [{
          text: 'Dismiss',
          // onPress: () => console.log('Ask me later pressed'),
        }]);

    return (
        <View className="flex-1 bg-main_bg_color items-center" style={{ paddingTop: insets.top }}>
          <ScrollView>
            <View className="p-3">
              <View className="items-center mt-10">
                <Text className="text-wit mx-5 text-3xl" style={styles.font_medium}>Profile</Text>
              </View>
              <View className="w-full bg-main_box_color flex flex-row h-28 items-center rounded-xl mt-5">
                <View className="relative">
                  <Image
                    source={selectedImage ? { uri: selectedImage } : require('../images/Profile.jpg')}
                    className="m-3 w-20 h-20 rounded-full"
                  />
                  <View className="absolute right-2 bottom-2 items-center justify-center border-[#fff] border-[1px] rounded-full">
                    <FontAwesomeIcon icon={faCircle} size={30} color='#db2525' />
                  </View>
                </View>
                <View className="flex-col ml-2">
                  <Text className="text-wit text-base" style={styles.font_semibold}>{accountName}</Text>
                  <Text className="text-wit text-sm -mt-1" style={styles.font_thin}>Don't disturb</Text>
                </View>
                
              </View>


              <Text className="text-profile-grijs text-base mt-5" style={styles.font_thin}>Account settings</Text>
              <ButtonList>
                {/*!--- Button voor Account Modal ---!*/}
                <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Account')}>
                    <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faUser} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Account</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFF" />
                </TouchableOpacity>
              
                {/*!--- Button voor Contact Details Modal ---!*/}
                <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Contact Details')}>
                    <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faAddressCard} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Contact Details</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFF" />
                </TouchableOpacity>

                {/*!--- Button voor Security Modal ---!*/}
                <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Security')}>
                    <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faShieldHalved} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Security</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFF" />
                </TouchableOpacity>
              </ButtonList>

              <Text className="text-profile-grijs text-base mt-5" style={styles.font_thin}>App settings</Text>
              <ButtonList>
                {/*!--- Button voor Notifications Modal ---!*/}
                <View className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Notifications')}>
                    <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faBell} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Notifications</Text>
                    </View>
                    <Switch
                      trackColor={{false: '#767577', true: '#1E80ED'}}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                </View>

                {/*!--- Button voor Notifications Modal ---!*/}
                <View className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Notifications')}>
                    <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faCircleHalfStroke} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Dark Mode</Text>
                    </View>
                    <Switch
                      trackColor={{false: '#767577', true: '#1E80ED'}}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={true}
                    />
                </View>
              </ButtonList>

              <Text className="text-profile-grijs text-base mt-5" style={styles.font_thin}>Extra</Text>
              <ButtonList>
                <TouchableOpacity onPress={() => linkOktaAccount()} className="flex flex-row justify-between items-center w-full py-4">
                  <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faUser} size={20} color="#FFF"/>
                        <Text className="ml-2 text-base text-[#fff]" style={styles.font_regular}>Link Okta Account</Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onLogout && onLogout()} className="flex flex-row justify-between items-center w-full py-4">
                <View className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faRightFromBracket} size={20} color="#db2525"/>
                        <Text className="ml-2 text-base text-[#db2525]" style={styles.font_regular}>Logout</Text>
                    </View>
                </TouchableOpacity>
              </ButtonList>
              

              

            </View>
          </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    font_regular: {
        fontFamily: 'Montserrat_400Regular',
    },
    font_thin: {
        fontFamily: 'Montserrat_300Light',
    },
    font_medium: {
        fontFamily: 'Montserrat_500Medium',
    },
    font_semibold: {
        fontFamily: 'Montserrat_600SemiBold',
    },
    font_bold: {
        fontFamily: 'Montserrat_700Bold',
    }
});

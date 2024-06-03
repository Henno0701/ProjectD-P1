import { Image, Text, View, Pressable, Modal, TextInput, Button, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { IP } from '@env';

import ButtonList from '../components/Button-List';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressBook, faCar, faChevronRight, faCircle, faMinusCircle, faShieldHalved, faUser, faUserCircle, faAddressCard, faCircleHalfStroke, faBell } from '@fortawesome/free-solid-svg-icons';

export default function ProfileOverviewScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [accountName, setAccountName] = useState("Henno Passchier");
    const [isAccountModalVisible, setAccountModalVisible] = useState(false);
    const [editedAccountName, setEditedAccountName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image

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



    const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
    }

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
                      value={isEnabled}
                    />
                </View>
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

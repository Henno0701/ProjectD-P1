import React from 'react';
import { Button, View, Text, Pressable, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { faBarChart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CryptoJS from "crypto-js";

import Modal from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';


function AddUserModal({ navigation }) {
    const insets = useSafeAreaInsets();
    const [ Email, setEmail ] = useState('');
    const [ Firstname, setFirstname ] = useState('');
    const [ Lastname, setLastname ] = useState('');

    const ConvertPassword = (password) =>
      {
        const hash = CryptoJS.SHA1(password).toString();
        return hash
      }

    const AddUser = async () => {
      try {
          console.log(Firstname, Lastname, Email);
          // console.log(Firstname, Lastname, Email);
          const response = await fetch(`http://${IP}:8080/AddUser`, {
              method: "POST",
              body: JSON.stringify({ 
                  voornaam: Firstname,
                  achternaam: Lastname,
                  adress: null,
                  telefoonnummer: null,
                  postCode: null,
                  provincie: null,
                  autoModel: null,
                  autoCapaciteit: null,
                  email: Email,
                  wachtwoord: ConvertPassword("TempWW123!@#")
               }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          });

          if (!response.ok) {
              return false;
          }

          return true;
      } catch (error) {
          // console.error('Error:', error);
          return false;
      }
    };


  const handleSubmit = async () => {
    const success = await AddUser();
    if (success) {
      Alert.alert('User Added', 'The user has been added successfully', [
          {
              text: 'OK',
              style: 'cancel',
          }
      ]);
    } else {
        Alert.alert('Error', 'An error occurred while adding the user', [
            {
                text: 'OK',
                style: 'cancel',
            }
        ]);
    }

    returnToAdminScreen();
  }


    const returnToAdminScreen = () => {
        navigation.navigate('AdminPanelScreen');
    }
    return (
        <Modal>
            <View className="flex-1 bg-main_bg_color items-center p-3 w-full" style={{ paddingTop: insets.top }}>
                <Text className="text-wit text-2xl" style={styles.font_semibold}>Add User</Text>
                <ScrollView className="w-full">

                   <View className="w-full mb-3">
                    <Text className="text-wit text-sm" style={styles.font_semibold}>Mail</Text>
                    <TextInput
                      className="w-full h-10 bg-main_box_color rounded-lg justify-center items-center text-wit p-2"
                      onChangeText={text => setEmail(text)}
                      style={styles.font_regular}
                    />
                   </View>

                   <View className="w-full mb-3">
                    <Text className="text-wit text-sm" style={styles.font_semibold}>Firstname</Text>
                    <TextInput
                      className="w-full h-10 bg-main_box_color rounded-lg justify-center items-center text-wit p-2"
                      onChangeText={text => setFirstname(text)}
                      style={styles.font_regular}
                    />
                   </View>

                   <View className="w-full mb-3">
                    <Text className="text-wit text-sm" style={styles.font_semibold}>Lastname</Text>
                    <TextInput
                      className="w-full h-10 bg-main_box_color rounded-lg justify-center items-center text-wit p-2"
                      onChangeText={text => setLastname(text)}
                      style={styles.font_regular}
                    />
                   </View>
                   
                </ScrollView>
                <View className='w-full flex-row'>
                    <View className='w-1/5 basis-[19%]'>
                        <Pressable className="h-14 bg-secondary_box_color rounded-lg justify-center items-center" onPress={returnToAdminScreen}>
                            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#fff" />
                            {/* <Text className="text-wit text-xl" style={styles.font_semibold}></Text> */}
                        </Pressable>
                    </View>
                    <View className="basis-[2%]"></View>
                    <View className='w-4/5 basis-[79%]'>
                        <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={handleSubmit}>
                            <Text className="text-wit text-xl" style={styles.font_semibold}>Send</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
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

export default AddUserModal;
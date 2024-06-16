import React from 'react';
import { Button, View, Text, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { faBarChart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP } from '@env';

import Modal from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';

function QuickReserveModal({ route, navigation }) {
    const [PressedTimeSlot, setPressedTimeSlot] = useState(route.params?.PressedTimeSlot); // The selected 
    const [selectedItemSelect, setSelectedItemSelect] = useState(0); // The selected item of the urgency dropdown
    const [ UserID, setUserID ] = useState(null); // The ID of the user that is currently logged in

    const returnToStations = (value = PressedTimeSlot) => 
        navigation.navigate('QuickReserve', {
            PressedTimeSlot: value
        });

    const getData = async (key) => {
      try {
          const value = await AsyncStorage.getItem(key);
          if (value !== null) return value;
          else return null;
        
      } catch (error) {
          console.log('Error retrieving data:', error);
          return null;
      }
    };

    useEffect(() => {
      getData('ID').then((user) => {
          setUserID(parseInt(user));
        });
    }, []);

    const AddQuickReservation = async (date, priority) => {
        try {
          const response = await fetch(`http://${IP}:8080/addQuickReservation`, {
            method: "POST",
            body: JSON.stringify({
              UserID: UserID,
              Date: date,
              Priority: priority
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          });
    
          if (!response.ok) {
            // throw new Error('Network response was not ok');
            return false;
          }
    
          return true;
        } catch (error) {
        //   console.error('Error:', error);
            createBadRequestAlert();
            return false;
        }
      };
    
      const handleSubmit = async () => {
        if (PressedTimeSlot !== null) {
            const date = new Date();
            date.setHours(PressedTimeSlot, 0, 0, 0);
        
            const result = AddQuickReservation(date, selectedItemSelect);

            if (result) {
                createConfirmationAlert();
                resetForm();
            } else {
                createBadRequestAlert();
                resetForm();
            }
        }
      };
    
      const resetForm = () => {
        setSelectedItemSelect(0); // Reset the urgency dropdown

        returnToStations(null); // Return to the Quick Reserve Screen and reset the selected timeslot
      };

    const createConfirmationAlert = () =>
        Alert.alert('Reservation Confirmed', 'Your request has been submitted. You will get a notification when your request has been accepted.', [{
            text: 'Dismiss',
            // onPress: () => console.log('Ask me later pressed'),
        }]);

    const createBadRequestAlert = () =>
        Alert.alert('Reservation Canceled', 'There seems to be a mixup. Try it again.', [{
            text: 'Dismiss',
            // onPress: () => console.log('Ask me later pressed'),
        }]);

    return (
        <Modal>
            <View className="flex-1 bg-main_bg_color items-center p-3 w-full">
                <ScrollView>
                    <View className="flex-row w-full items-center mb-10">
                    <View className="bg-main_box_color w-full rounded-lg p-2.5">
                        <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Urgency</Text>
                        <FontAwesomeIcon icon={faBarChart} size={20} color="#fff" />
                        </View>
                        <View className="flex-row w-full items-center justify-between mt-2">
                        <SelectDropdown
                            style={{
                            inputIOS: {
                                width: 350,
                                height: 50,
                                fontSize: 16,
                                color: "white",
                                backgroundColor: "#121212",
                                borderRadius: 8,
                                padding: 10,
                                fontFamily: 'Montserrat_400Regular',
                            },
                            inputAndroid: {
                                width: 350,
                                height: 50,
                                fontSize: 16,
                                color: "white",
                                backgroundColor: "#121212",
                                borderRadius: 8,
                                padding: 10,
                                fontFamily: 'Montserrat_400Regular',
                            },
                            }}
                            value={selectedItemSelect}
                            onValueChange={(value) => setSelectedItemSelect(value)}
                            items={[
                            { label: 'None', value: 0 },
                            { label: 'I need it but someone can go first.', value: 1 },
                            { label: 'I need it.', value: 2 },
                            { label: 'I really need it.', value: 3 },
                            { label: "I need it or I’m not able to go.", value: 4 },
                            ]}
                        />
                        </View>
                    </View>
                    </View>
                </ScrollView>
                <View className='w-full flex-row'>
                    <View className='w-1/5 basis-[19%]'>
                        <Pressable className="h-14 bg-secondary_box_color rounded-lg justify-center items-center" onPress={returnToStations}>
                            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#fff" />
                            {/* <Text className="text-wit text-xl" style={styles.font_semibold}></Text> */}
                        </Pressable>
                    </View>
                    <View className="basis-[2%]"></View>
                    <View className='w-4/5 basis-[79%]'>
                        <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={() => handleSubmit()}>
                            <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
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

export default QuickReserveModal;
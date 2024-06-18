import React, { useState, useEffect } from 'react';
import { Button, View, Text, Pressable, Alert } from 'react-native';
import { faBarChart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';

function ReportModal({ navigation }) {
    const [ issue, setIssue ] = useState(null);
    const [ user, setUser ] = useState(1);

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

    const handleSubmit = () => {
        if (issue === null) {
            Alert.alert('Please select an issue.');
            return;
        }

        if (SendReport(user)) {
            Alert.alert('Issue reported.');
            returnToStations();
        } else {
            Alert.alert('Something went wrong. Please try again.');
        }
        
    }

    const SendReport = async (id) => {
        id = parseInt(id);
        try {
            fetch(`http://${IP}:8080/AddMelding`, { // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
                method: "POST",
                body: JSON.stringify({
                    UserID: id,
                    Melding: issue
                }),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => {
                if (!response.ok) {
                    // when the response is not ok return an not ok status
                    return false;
                }
                
                return true;
                })
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const returnToStations = () => {
        navigation.navigate('StationsOverview');
    }

    useEffect(() => {
        getData('ID').then((user) => {
          setUser(user);
        });
      }, []);

    return (
        <Modal>
            <View className="flex-1 bg-main_bg_color items-center p-3 w-full">
                <ScrollView>
                    <View className="flex-row w-full items-center mb-10">
                    <View className="bg-main_box_color w-full rounded-lg p-2.5">
                        <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Report issue</Text>
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
                            onValueChange={(value) => setIssue(value)}
                            items={[
                            { label: 'Somebody is on my charging station.', value: 'Somebody is on my charging station.' },
                            { label: 'Charging station is defect.', value: 'Charging station is defect.' },
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

export default ReportModal;
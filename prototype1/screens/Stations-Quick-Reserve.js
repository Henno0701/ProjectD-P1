import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import QuickReserveItem from '../components/Quick-Reserve-Item';
import { IP } from '@env';




export default function StationsQuickReserveScreen() {
    const [NumberAvailableStations, setNumberAvailableStations] = useState([]);
    const GetAllReservationsOfDate = async (date) => {
        try {
            const response = await fetch(`http://${IP}:8080/getAllReservationsOfDate`, {
                method: "POST",
                body: JSON.stringify({
                    Date: date,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const json = await response.json(); // Assuming response is JSON, use appropriate method accordingly
            console.log(json);
            setNumberAvailableStations(json);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        (async () => {
            await GetAllReservationsOfDate(new Date("2024-06-03")); // Convert the response to a number
        })();
    }, []);


    return (
      <View className="flex-1 bg-main_bg_color items-center">
        <ScrollView>
            <View className="p-3">
                <QuickReserveItem timeSlots={NumberAvailableStations} />
            </View>
        </ScrollView>

        <View className='w-full p-3'>
            <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center">
                <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
            </Pressable>
        </View>
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
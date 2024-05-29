import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import QuickReserveItem from '../components/Quick-Reserve-Item';


export default function StationsQuickReserveScreen() {
    const GetAllReservationsOfDate = async (date) => {
        try {
            const response = await fetch('http://192.168.1.30:8080/getAllReservationsOfDate', {
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
            // console.log(json);
            return json;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        (async () => {
            const NumberAvailable = await GetAllReservationsOfDate(new Date("2024-05-21")); // Convert the response to a number
            console.log(NumberAvailable + " stations are available");
        })();
    }, []);


    return (
      <View className="flex-1 bg-main_bg_color items-center">
        <ScrollView>
            <View className="p-3">
                <QuickReserveItem timeSlots={[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]} />
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
import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import QuickReserveItem from '../components/Quick-Reserve-Item';
import { IP } from '@env';

export default function StationsQuickReserveScreen() {
    const [ReservedStations, setReservedStations] = useState([]);
    const [StandardTimeslots, setStandardTimeslots] = useState({});
    const [NumberAvailableStations, setNumberAvailableStations] = useState([]);

    const generateTimeslots = (AmountOfChargingStations = 1, CurrentDate = new Date("2024-06-03")) => {
        const MinTimeHour = 6; // Minimum time slot hour
        const MaxTimeHour = 20; // Maximum time slot hour

        const AllChargingStationsHoursList = {};

        for (let i = 0; i < AmountOfChargingStations; i++) {
            const tempHourslist = [];

            // Looping through the hours
            for (let j = MinTimeHour; j <= MaxTimeHour; j++) {
                const date = new Date(CurrentDate); // Creating a timeslot date
                date.setHours(j, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds
                tempHourslist.push(date); // Pushing it to a temp list that will be sent to the Upper Array
            }

            AllChargingStationsHoursList[i] = tempHourslist; // Pushing the list to an array with key and value pair
        }

        return AllChargingStationsHoursList; // Return the generated timeslots
    };

    const filterUnavailableReservation = (timeslots, reservedStations) => {
        const filteredTimeslots = {};

        for (let station in timeslots) { // Loop through every hour
            filteredTimeslots[station] = timeslots[station].filter(timeslot => {
                return !reservedStations.some(unavailable => 
                    new Date(unavailable.date).getTime() === timeslot.getTime() // Filter out every date that is equal
                );
            });
        }

        return filteredTimeslots;
    };

    const getAllReservationsOfDate = async (date) => {
        try {
            const response = await fetch(`http://${IP}:8080/getAllReservationsOfDate`, {
                method: "POST",
                body: JSON.stringify({ Date: date }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const json = await response.json(); // Assuming response is JSON, use appropriate method accordingly
            return json;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date("2024-06-03");
            const Reservations = await getAllReservationsOfDate(date); // Await the promise resolution
            setReservedStations(Reservations);

            const timeslots = generateTimeslots();
            setStandardTimeslots(timeslots);

            const filteredTimeslots = filterUnavailableReservation(timeslots, Reservations);
            setNumberAvailableStations(filteredTimeslots);
        };

        fetchData();
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
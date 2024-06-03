import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { faCalendarDays, faBarChart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import QuickReserveItem from '../components/Quick-Reserve-Item';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';

export default function StationsQuickReserveScreen() {
    const [PressedTimeSlot, setPressedTimeSlot] = useState(null); // The selected timeslot
    const [selectedItemSelect, setSelectedItemSelect] = useState(0); // The selected item of the urgency dropdown

    const [ReservedStations, setReservedStations] = useState([]);
    const [StandardTimeslots, setStandardTimeslots] = useState({});
    const [NumberAvailableStations, setNumberAvailableStations] = useState([]);

    const getLaadpalen = async () => {
        try {
            const response = await fetch(`http://${IP}:8080/getLaadpalen`, {
                method: "GET",
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
    }

    const generateTimeslots = (AmountOfChargingStations = 1, CurrentDate = new Date()) => {
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

    const AddQuickReservation = async (date, priority) => {
        try {
            const response = await fetch(`http://${IP}:8080/addQuickReservation`, {
                method: "POST",
                body: JSON.stringify({
                    UserID: 1,
                    Date: date,
                    Priority: priority
                }),
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
    }

    const handleSubmit = async () => {
        if (PressedTimeSlot !== null) {
            // console.log(PressedTimeSlot, selectedItemSelect)
            await AddQuickReservation(PressedTimeSlot, selectedItemSelect);
        }
    };

    const resetForm = () => {
        setPressedTimeSlot(null);
        setSelectedItemSelect(0);
    };


    return (
        <View className="flex-1 bg-main_bg_color items-center">
            <ScrollView>
                <View className="p-3">
                    <QuickReserveItem timeSlots={NumberAvailableStations} setPressedTimeSlot={setPressedTimeSlot} />
                    
                    {PressedTimeSlot && (
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
                                            { label: 'I realy need it.', value: 3 },
                                            { label: "I need it or i’m not be able to go.", value: 4 },
                                        ]}
                                    />
                                    </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {PressedTimeSlot && (
                <View className='w-full p-3'>
                    <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={() => handleSubmit() + resetForm()}>
                        <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
                    </Pressable>
                </View>
            )}
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
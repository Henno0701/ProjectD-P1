import { Button, Text, TouchableHighlight, TouchableOpacity, View, Pressable, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useRef, useState } from 'react';
import SelectDropdown from 'react-native-picker-select';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GenerateDateButtons from '../components/Buttons-Date';

import { faBarChart, faCalendar, faCalendarDays, faCircleCheck, faClock, faList, faRectangleList } from '@fortawesome/free-regular-svg-icons';
import GenerateTimeSlotsButtons from '../components/Buttons-Time';

// Returning the correct form of the dates in a string
const FormatDate = (date, short=true) => {
    var month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
    var monthS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!short) return month[date.getMonth()] + " " + date.getDate();
    else return monthS[date.getMonth()] + " " + date.getDate();
}

function dates(date) {
    var week= new Array(); 

    // Looping through the week and adding the dates to the array
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(date)
        ); 
        // Incrementing the date by 1
        date.setDate(date.getDate() +1);
    }
    return week; 
}

function timesSlots(date) {
    var times = [];

    if (!date) return times; // Return empty array if date is null or undefined

    var current = new Date(date);
    var nowHour = current.getHours(); // Get current hour of the given day

    // Start from the beginning of the day
    current.setHours(0, 0, 0, 0);

    // Loop from 0 to 23
    for (var hour = 0; hour <= 23; hour++) {
        // If it's the current day, add only upcoming hours
        if (current.getDate() === new Date().getDate() && hour < nowHour) {
            continue;
        }
        times.push(hour); // Add hour to times array
    }

    return times;
}

export default function StationsReserveScreen() {
    const insets = useSafeAreaInsets();
    const [data, setData] = useState(
        {
            "station_id": null,
            "date": null,
            "time": null,
            "urgency": null
        }
    );

    // The selected date & time
    const [ selectedDate, setSelectedDate ] = useState(null);
    const [ selectedTime, setSelectedTime ] = useState(null);

    // The timeslots of the day
    const [times, setTimes] = useState([]);

    // The selected item of the urgency dropdown
    const [selectedItemSelect, setSelectedItemSelect] = useState(0);

    // The modal visibility
    const [indicator, setIndicator] = useState(false);

    var curr = new Date; // get current date
    var first = curr.getDate(); // First day is the day of the month - the day of the week + 1
    var last = first + 6; // last day is the first day + 6
    var week = dates(new Date(curr.setDate(first))); // get the dates of the week

    var firstday = FormatDate(new Date(curr.setDate(first)));
    var lastday = FormatDate(new Date(curr.setDate(last)));


    // In the code below we are getting the timeslots of the day by every date change
    useEffect(() => {
        // first reset the time state to null
        setSelectedTime(null);

        // generate every upcoming hour of the given day
        var EveryHour = timesSlots(selectedDate);
        setTimes(EveryHour);
    }, [selectedDate]);

    // Function to  account name from server
    const AddToDatabase = async (date) => {
        try {
            fetch('http://192.168.1.40:8080/addReservation', { // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
                method: "POST",
                body: JSON.stringify({
                    userID: 1,
                    LaadpaalID: 1,
                    Date: date,
                    Priority: selectedItemSelect,
                    Opgeladen: false,
                    Opgehaald: false,
                }),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming response is JSON, use appropriate method accordingly
              })
            .then((json) => console.log(json)); 
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const addReservation = async (date, time, urgency) => {
        // Save the reservation to the database
        console.log("date: " + date + ", time: " + time + ", urgency: " + urgency);
        
        // Create a new date object with the selected date and time 
        date.setHours(time);
        // console.log(typeof time);

        // Add the reservation to the database
        AddToDatabase(date);

        setIndicator(true);

        setInterval(() => {
            setIndicator(false);
        }, 5000);
    }

    return (
      <View className="flex-1 relative bg-main_bg_color items-center">
        
        <View className='flex-col w-full h-full items-center justify-between'>
            <ScrollView>
                <View className="flex p-3">
                    <View className="flex-row w-full items-center mb-3">
                        <View className="bg-main_box_color w-full rounded-lg p-2.5">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="text-lg text-[#fff]" style={styles.font_semibold}>{firstday} - {lastday}</Text>
                                <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                            </View>
                            <View className="flex-row w-full items-center justify-between mt-2">
                                <GenerateDateButtons week={week} setSelectedDate={setSelectedDate} />
                            </View>
                        </View>
                    </View>

                    {/* If the date is selected, show the time slots */}
                    {selectedDate && (
                        <View className="flex-row w-full items-center mb-3">
                            <View className="bg-main_box_color w-full rounded-lg p-2.5">
                                <View className="flex flex-row items-center justify-between">
                                    <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Select Time slot</Text>
                                    <FontAwesomeIcon icon={faClock} size={20} color="#fff" />
                                </View>
                                <GenerateTimeSlotsButtons times={times} selectedDate={selectedDate} setSelectedTime={setSelectedTime} />
                            </View>
                        </View>
                    )}

                    {selectedTime && (
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
            
        
            {selectedTime && (
            <View className='w-full p-3'>
                <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center flex-row" onPress={() => addReservation(selectedDate, selectedTime, selectedItemSelect)}>
                    <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
                    {/* <ActivityIndicator color="#fff" className="ml-2" /> */}
                </Pressable>
            </View>
            )}

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
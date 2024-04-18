import { Button, Text, TouchableHighlight, TouchableOpacity, View, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useRef, useState } from 'react';
import SelectDropdown from 'react-native-picker-select';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { faBarChart, faCalendar, faCalendarDays, faClock, faList, faRectangleList } from '@fortawesome/free-regular-svg-icons';

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

    if (date === null) return times;

    var current = date;
    var nowHour = current.getHours();  // Get current hour of the day

    // If it's not the current day, start from the beginning of the day
    if (current.getHours() !== 0 || current.getMinutes() !== 0 || current.getSeconds() !== 0) {
        current.setHours(0, 0, 0, 0); // Set time to beginning of the day
    }

    // Loop from current hour number to 23 if it's the current day,
    // otherwise loop from 0 to 23
    for (var hour = nowHour == 0 ? nowHour : nowHour + 1 ; hour <= 23; hour++) {
        if (current.getHours() === nowHour) {
            // If it's the current day, add only upcoming hours
            if (hour >= nowHour) {
                times.push(hour);
            }
        } else {
            // If it's not the current day, add all hours
            times.push(hour);
        }
    }

    return times;

}

// Generate the buttons of the week
const GenerateDateButtons = (date, selectedButton, handleButtonPress) => {
    const isPressed = () => {
        handleButtonPress(date);
    }

    return (
        <Pressable 
            key={date} // Every button has a unique key
            style={{
                backgroundColor: '#2E2E2E',
            }}             
            className={`w-10 h-10 justify-center items-center rounded-lg`} 
            onPress={isPressed} 
            underlayColor="transparent" 
            >
            <Text className="text-lg text-[#fff]" style={styles.font_regular}>{date.getDate()}</Text>
        </Pressable>
    );
}

const GenerateTimeSlotsButtons = (time, selectedTime, setSelectedTime) => {
    const isPressed = () => {
        setSelectedTime(time);
    }

    return (
        <Pressable key={time} className={`bg-secondary_box_color w-[30%] mb-2.5 h-10 justify-center items-center rounded-lg`} onPress={isPressed}>
            <Text className="text-lg text-[#fff]" style={styles.font_regular}>{time}:00</Text>
        </Pressable>
    );
}



export default function StationsReserveScreen() {
    const [data, setData] = useState([]);

    // The selected date & time
    const [ selectedDate, setSelectedDate ] = useState(null);
    const [ selectedTime, setSelectedTime ] = useState(null);

    // The timeslots of the day
    const [times, setTimes] = useState([]);
    const [selectedButton, setSelectedButton] = useState(null);

    // The selected item of the urgency dropdown
    const [selectedItemSelect, setSelectedItemSelect] = useState("0");

    var curr = new Date; // get current date
    var first = curr.getDate(); // First day is the day of the month - the day of the week + 1
    var last = first + 6; // last day is the first day + 6
    var week = dates(new Date(curr.setDate(first))); // get the dates of the week

    var firstday = FormatDate(new Date(curr.setDate(first)));
    var lastday = FormatDate(new Date(curr.setDate(last)));

    const handleDateSelectorButton = async (buttonIndex) => {
        await setSelectedButton(buttonIndex);
        await setSelectedDate(buttonIndex);
    };

    const handleTimeSelectorButton = async (buttonIndex) => {
        await setSelectedTime(buttonIndex);
    };

    //In the code below we are getting the timeslots of the day by every date change
    useEffect(() => {
        setTimes(timesSlots(selectedDate));
    }, [selectedDate]);

    return (
      <View className="flex-1 bg-main_bg_color items-center">

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
                                {week.map((date) => GenerateDateButtons(date, selectedButton, handleDateSelectorButton))}
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
                                <View className="flex-row flex-wrap w-full items-center justify-between mt-2">
                                    {times.map((time) => GenerateTimeSlotsButtons(time, selectedTime, handleTimeSelectorButton))}
                                </View>
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
                                            { label: 'None', value: '0' },
                                            { label: 'I need it but someone can go first.', value: '1' },
                                            { label: 'I need it.', value: '2' },
                                            { label: 'I realy need it.', value: '3' },
                                            { label: "I need it or i’m not be able to go.", value: '4' },
                                        ]}
                                    />
                                    </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
            
        

            <View className='w-full p-3'>
                <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={() => addReservation(selectedDate, selectedTime, selectedItemSelect)}>
                    <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
                </Pressable>
            </View>

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
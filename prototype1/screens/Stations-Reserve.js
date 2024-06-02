import { Button, Text, TouchableHighlight, TouchableOpacity, View, Pressable, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP } from '@env';

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

        // If the current hour is between 6 and 22, add the hour to the times array
        if (hour >= 6 && hour <= 20) times.push(hour); // Add hour to times array
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

    // The modal visibility
    const [indicator, setIndicator] = useState(false);

    var curr = new Date; // get current date
    var first = curr.getDate() + 2; // First day is the day of the month - the day of the week + 1, Add 2 days to the current date
    var last = first + 6; // last day is the first day + 6
    var week = dates(new Date(curr.setDate(first))); // get the dates of the week

    var firstday = FormatDate(new Date(curr.setDate(first)));
    var lastday = FormatDate(new Date(curr.setDate(last)));

    const getAllChargingStations = async () => {
        try {
            const response = await fetch(`http://${IP}:8080/getAllLaadpalen`, {
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

    const getAllReservationsOfDate = async (date) => {
        if (!date) return []; // Return empty array if date is null or undefined
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
            return json || [];
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    };

    const filterUnavailableReservation = (timeslots, reservedStations, AllLaadpalen) => {
        const filteredTimeslots = {};
    
        // First initialize the filteredTimeslots object with empty arrays
        timeslots.forEach(hour => {
            filteredTimeslots[hour] = [];
        });
    
        // Iterate over each station in AllLaadpalen
        AllLaadpalen.forEach(station => {
            const stationID = station.id;
    
            // Iterate over each hour in timeslots
            timeslots.forEach(hour => {
                // Check if this station is reserved at this hour
                const isReserved = reservedStations.some(reservation => {
                    return new Date(reservation.date).getHours() === hour && reservation.laadpaalID === stationID;
                });
    
                // If the station is not reserved at this hour, add it to the filteredTimeslots
                if (!isReserved) {
                    filteredTimeslots[hour].push(stationID);
                }
            });
        });
    
        return filteredTimeslots;
    };

    useEffect(() => {
        const fetchReservations = async () => {
            // first reset the time state to null
            setSelectedTime(null);

            // generate every upcoming hour of the given day
            var EveryHour = timesSlots(selectedDate);
            const Reservations = await getAllReservationsOfDate(selectedDate); // Await every reservation of the selected date
            const AllChargingStations = await getAllChargingStations(); // Get all charging stations
            const FilteredTimes = filterUnavailableReservation(EveryHour, Reservations, AllChargingStations);
            console.log(FilteredTimes);
            

            setTimes(FilteredTimes); // Set the timeslots of the day
        };

        fetchReservations();

    }, [selectedDate]); // Run the effect when the selected date changes

    // Function to  account name from server
    const AddToDatabase = async (date, laadpaalID) => {
        try {
            fetch(`http://${IP}:8080/addReservation`, { // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
                method: "POST",
                body: JSON.stringify({
                    UserID: 1,
                    LaadpaalID: laadpaalID,
                    Date: date,
                    Opgeladen: false,
                    Opgehaald: false,
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
    };

    const getChargingStationID = async (date) => {
        const hour = date.getHours(); // Get the hour of the given date
        const foundTime = Object.entries(times).find(([time, value]) => parseInt(time, 10) === hour); // Find the time slot in the times array
        return foundTime ? foundTime[1][0] : null; // Return the first ID in the list for the found time slot
    };
            
        

    const addReservation = async (date, time) => {
        // Save the reservation to the database
        // Create a new date object with the selected date and time 
        date.setHours(time);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        // Get the first stationID of a given date time
        const stationID = await getChargingStationID(date)

        // Add to the database
        const result = AddToDatabase(date, stationID);

        if (result) {
            createConfirmationAlert();
        } else {
            createBadRequestAlert();
        }
        
    }

    const resetForm = () => {
        setSelectedDate(null);
        setSelectedTime(null);
    }

    const createConfirmationAlert = () =>
        Alert.alert('Reservation Confirmed', 'Your reservation has been placed in the system.', [{
            text: 'Dismiss',
            // onPress: () => console.log('Ask me later pressed'),
          }]);

    const createBadRequestAlert = () =>
        Alert.alert('Reservation Canceled', 'There seems to be a mixup. Try it again.', [{
            text: 'Dismiss',
            // onPress: () => console.log('Ask me later pressed'),
            }]);

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
                </View>
            </ScrollView>
            
        
            {selectedTime && (
            <View className='w-full p-3'>
                <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center flex-row" onPress={() => addReservation(selectedDate, selectedTime) + resetForm()}>
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
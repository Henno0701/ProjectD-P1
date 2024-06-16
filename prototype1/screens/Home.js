import React, { useState, useEffect } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CountDown } from 'react-native-countdown-component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBattery2, faChargingStation, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import ProgressBar from '../data/ProgressBar';
import axios from 'axios';
import { IP } from '@env';
import ButtonList from '../components/Button-List';

export default function HomeScreen({ navigation }) {
  const date = new Date();
  const [ Name, setName ] = useState("");

  const insets = useSafeAreaInsets();
  const [TimeLeft, setTimeLeft] = useState(null);
  const [ReservationActive, setReservationActive] = useState(false);
  const [StationID, setStationID] = useState(0);
  const [TimeSlot, setTimeSlot] = useState("");

  const CreateTimeSlot = (time) => {
    var date = new Date(time);
    var hours = date.getHours();
    var timeSlot = hours + ":00" + " - " + (hours + 1) + ":00";

    return timeSlot;
  };

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

  const getCurrentReservation = (reservations) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();

    const currentReservation = reservations.find(reservation => {
        const reservationDate = new Date(reservation.date);
        const reservationYear = reservationDate.getFullYear();
        const reservationMonth = reservationDate.getMonth();
        const reservationDay = reservationDate.getDate();
        const reservationHour = reservationDate.getHours();

        if (currentYear === reservationYear && currentMonth === reservationMonth && currentDay === reservationDay && currentHour === reservationHour) {
            return reservation;
        }
    });

    if (!currentReservation) return false;

    return currentReservation;
};

const getTimeLeft = (reservation) => {
    const reservationDate = new Date(reservation.date);
    const reservationEndTime = reservationDate.getTime() + 3600000; // 1 hour in milliseconds

    const timeLeft = reservationEndTime - Date.now();

    return Math.round(timeLeft / 1000); // Convert to seconds
};

const getUserReservations = async () => {
    try {
        const response = await fetch(`http://${IP}:8080/getAllReservationsOfUser`, {
            method: "POST",
            body: JSON.stringify({ UserID: 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        // console.error('Error fetching data:', error);
        return []; // Return an empty array if the fetch fails
    }
};

useEffect(() => {
    const fetchReservations = async () => {
        const data = await getUserReservations();
        var currentReservation = getCurrentReservation(data);

        if (!currentReservation) {
          setReservationActive(false);
        } else {
          setReservationActive(true);
          setStationID(currentReservation.laadpaalID);
          setTimeSlot(CreateTimeSlot(currentReservation.date));
          const time = getTimeLeft(currentReservation);

          setTimeLeft(time);
        }
    };

    getData('Username').then((user) => {
      setName(user);
    });
    
    fetchReservations();
}, []);

  return (
    <View className="flex-1 bg-main_bg_color p-3" style={{ paddingTop: insets.top }}>
      <Text className="text-schuberg_blue text-4xl mt-10" style={styles.font_thin}>Welcome</Text>
      <Text className="text-[#ffffff] text-2xl -mt-2" style={styles.font_thin}>{Name}</Text>
      {ReservationActive ?
        <View>
          <Text className="text-[#686868] text-sm mt-5" style={styles.font_thin}>Car Status</Text>
          <View className="w-full h-20 flex flex-row mt-1">
            <View className="w-1/2 bg-main_box_color justify-center rounded-xl">
              <View className="justify-evenly items-center flex flex-row ">
                <View className="w-12 h-12 bg-main_bg_color justify-center items-center rounded-full">
                  <FontAwesomeIcon size={32} color="#1E80ED" icon={faClock} />
                </View>
                {TimeLeft !== null && (
                  <CountDown
                    key={TimeLeft} // Force re-render when TimeLeft changes
                    until={TimeLeft}
                    size={16}
                    digitStyle={{ backgroundColor: null, marginHorizontal: -2 }}
                    digitTxtStyle={{ color: '#FFF', fontFamily: 'Montserrat_400Regular' }}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{ h: null, m: null, s: null }}
                    showSeparator
                    separatorStyle={{ color: '#FFF', marginHorizontal: -4 }}
                  />
                )}
              </View>
            </View>
          </View>

          <View className="w-full h-auto mt-3 bg-main_box_color rounded-xl p-3">
            <Text className="mx-2 text-box-information-text" style={styles.font_thin}>info:</Text>
            <View className="mx-2 flex flex-row ">
              <View className="mr-10">
                <Text className="text-box-information-text" style={styles.font_thin}>Charging Station ID:</Text>
                <Text className="text-box-information-text" style={styles.font_thin}>Session Time:</Text>
                <Text className="text-box-information-text" style={styles.font_thin}>License Plate:</Text>
              </View>

              <View className="mr-5">
                <Text className="text-[#ffffff]" style={styles.font_regular}>{StationID}</Text>
                <Text className="text-[#ffffff]" style={styles.font_regular}>{TimeSlot}</Text>
                <Text className="text-[#ffffff]" style={styles.font_regular}>Unknown</Text>
              </View>
            </View>
          </View>
        </View>
        : null}

      <Text className="text-box-information-text text-sm mt-3 mb-1" style={styles.font_thin}>Quick Access</Text>
      <ButtonList>
        <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Stations')}>
          <View className="flex flex-row items-center">
              <FontAwesomeIcon icon={faChargingStation} size={20} color="#FFFFFF" />
              <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>Make Reservation</Text>
          </View>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => navigation.navigate('Stations')}>
          <View className="flex flex-row items-center">
              <FontAwesomeIcon icon={faChargingStation} size={20} color="#FFFFFF" />
              <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>Example</Text>
          </View>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ButtonList>
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

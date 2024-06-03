import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { faCalendarDays, faBarChart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import QuickReserveItem from '../components/Quick-Reserve-Item';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';
import { createStackNavigator } from '@react-navigation/stack';
import QuickReserveModal from '../components/Modals/Quick-Reserve-Modal';

const Stack = createStackNavigator();

const QuickReserveMainScreen = ({ navigation }) => {
  const [PressedTimeSlot, setPressedTimeSlot] = useState(null); // The selected timeslot
  const [selectedItemSelect, setSelectedItemSelect] = useState(0); // The selected item of the urgency dropdown

  const [ReservedStations, setReservedStations] = useState([]);
  const [StandardTimeslots, setStandardTimeslots] = useState({});
  const [NumberAvailableStations, setNumberAvailableStations] = useState([]);

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
  };

  function timesSlots(date = new Date()) {
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

  const filterUnavailableReservation = (timeslots, reservedStations, AllLaadpalen) => {
    const filteredTimeslots = {};
    
    // First initialize the filteredTimeslots object with empty arrays for all valid timeslots
    timeslots.forEach(hour => {
      if (hour > new Date().getHours()) filteredTimeslots[hour] = [];
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
        if (!isReserved && filteredTimeslots[hour]) {
          filteredTimeslots[hour].push(stationID);
        }
      });
    });
    
    return filteredTimeslots;
  };

  const getAllReservationsOfDate = async (date = new Date()) => {
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

  useEffect(() => {
    const fetchData = async () => {
      var timeslots = timesSlots(); // Generate timeslots
      setStandardTimeslots(timeslots);

      const Reservations = await getAllReservationsOfDate(); // Await the promise resolution
      setReservedStations(Reservations);

      const AllChargingStations = await getAllChargingStations(); // Get all charging stations

      const filteredTimeslots = await filterUnavailableReservation(timeslots, Reservations, AllChargingStations);
      console.log(filteredTimeslots);
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
  };

  const handleSubmit = async () => {
    if (PressedTimeSlot !== null) {
      const date = new Date();
      date.setHours(PressedTimeSlot, 0, 0, 0);

      await AddQuickReservation(date, selectedItemSelect);
    }
  };

  const resetForm = () => {
    setPressedTimeSlot(null);
    setSelectedItemSelect(0);
  };

  const handleModalOpen = () => {
    navigation.navigate('QuickReserveModal');
  };

  return (
    <View className="flex-1 bg-main_bg_color items-center">
      <ScrollView>
        <View className="p-3">
          <QuickReserveItem timeSlots={NumberAvailableStations} setPressedTimeSlot={setPressedTimeSlot} />
        </View>
      </ScrollView>

      {!PressedTimeSlot && (
        <View className='w-full p-3'>
          <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={handleModalOpen}>
            <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const QuickReserveScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="QuickReserve" 
        component={QuickReserveMainScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="QuickReserveModal" 
        component={QuickReserveModal} 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack.Navigator>
  );
};

export default QuickReserveScreen;

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

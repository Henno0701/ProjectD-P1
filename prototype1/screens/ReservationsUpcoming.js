import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  const getData = async () => {
    try {
        const response = await fetch('http://192.168.1.8:8080/items');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setReservations(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
    console.log(reservations);
  }, []);

const CalculateTime = (date) => {
  var hours = date.getHours();
  return hours + ":00 - " + (hours + 1) + ":00";
}

  const formatDate = (date, short = true) => {
    const nth = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthS = ["Jan", "Feb", "Mrt", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!short) return month[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
    else return monthS[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
  }

  // Function to filter upcoming reservations
  const filterUpcomingReservations = () => {
    const upcomingReservations = reservations.filter((reservation) => {
      return new Date(reservation.Date) >= new Date();
    });
    return upcomingReservations;
  };

  const renderReservationItem = ({ item }) => (
    <View className={`${item.Date == new Date() ? "bg-schuberg_blue" : "bg-main_box_color"} w-full rounded-lg p-2.5 mb-3`}>
            <View className="flex-row items-center justify-between mb-1">
                <Text className="text-lg text-wit font-light" style={styles.font_semibold}>{formatDate(new Date(item.Date))}</Text>
                <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
            </View>

            <View className="flex-row items-center mb-0.5">
                <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faClock} size={20} color="#fff" />  
                </View>  
                <Text className="text-lg text-wit" style={styles.font_regular}>{CalculateTime(new Date(item.Date))}</Text>
            </View>

            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faLocationDot} size={20} color="#1E80ED" />  
                </View> 
                <View className="flex-row items-center"> 
                  <Text className="text-lg text-schuberg_blue font-bold mr-2" style={styles.font_thin}>{item.chargingstation}</Text>
                  <Text className="text-md font-normal text-profile-grijs" style={styles.font_thin}>{item.location}</Text>
                </View>
            </View>
        </View>
  );

  return (
    <View className="flex-1 bg-main_bg_color p-3">
      <FlatList
        data={filterUpcomingReservations()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
      />
    </View>
  );
};

const stylesbox = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  reservationContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
});

export default Reservations;

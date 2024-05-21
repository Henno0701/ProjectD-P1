import React, { useState, useEffect } from 'react';
import { View, FlatList, Button } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { faCalendarDays, faClock, faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet } from 'react-native';


const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  const getData = async () => {
    try {
        const response = await fetch('http://145.137.52.189:8080/items');
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
    <View style={stylesbox.reservationContainer}>
      <View style={stylesbox.row}>
        <Text style={stylesbox.text}>{item.id}</Text>
        <Text style={stylesbox.text}>{item.UserID}</Text>
        <Text style={stylesbox.text}>{item.LaadpaalID}</Text>
        <Text style={stylesbox.text}>{formatDate(new Date(item.Date))}</Text>
        <Text style={stylesbox.text}>{item.Priority}</Text>
        <Text style={stylesbox.text}>{item.Opgeladen ? 'Yes' : 'No'}</Text>
        <Text style={stylesbox.text}>{item.Opgehaald ? 'Yes' : 'No'}</Text>
      </View>
    </View>
  );

  return (
    <View style={stylesbox.container}>
      <Text style={stylesbox.header}>Upcoming Reservations</Text>
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
  },
});

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

export default Reservations;
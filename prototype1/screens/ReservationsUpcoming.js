import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { faCalendarDays, faClock, faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const StyledView = styled(View);
const StyledText = styled(Text);



const Reservations = () => {
  // Sample data for the list of reservations
  const reservationsData = [
    { id: 1, date: '2024-02-26', timeSlot: '10:00 AM - 12:00 PM', location: 'New York' },
    { id: 2, date: '2024-02-27', timeSlot: '2:00 PM - 4:00 PM', location: 'Los Angeles' },
    { id: 3, date: '2024-02-28', timeSlot: '9:00 AM - 11:00 AM', location: 'Chicago' },
    // Add more reservations as needed
  ];


  // Function to render each reservation item
  const renderReservationItem = ({ item }) => (
    <Card containerStyle={{ backgroundColor: '#1e51de', borderRadius: 20, width: 390, height: 220 }}>
      <FontAwesomeIcon icon={faCalendarDays} /><Card.Title style={{
        color: 'white', paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>Date: {item.date}</Card.Title>
      <FontAwesomeIcon icon={faClock} /><Text style={{ color: 'white', padding: 12 }}>Time Slot: {item.timeSlot}</Text>
      <FontAwesomeIcon icon={faFlag} /><Text style={{ color: 'white', padding: 8 }}>Location: {item.location}</Text>
    </Card>
  );

  const navigation = useNavigation();

  const handleExpiredPress = () => {
    // Navigate to the "Expired" screen
    navigation.navigate('ReservationsExpired');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#000', alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      </View>
      {/* FlatList of Reservation Cards */}
      <FlatList
        data={reservationsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
      />
    </View>
  );
};

export default Reservations;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View, FlatList } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';



const ReservationsScreen = () => {
  // Sample data for the list of reservations
  const reservationsData = [
    { id: 1, date: '2024-02-26', timeSlot: '10:00 AM - 12:00 PM', location: 'New York' },
    { id: 2, date: '2024-02-27', timeSlot: '2:00 PM - 4:00 PM', location: 'Los Angeles' },
    { id: 3, date: '2024-02-28', timeSlot: '9:00 AM - 11:00 AM', location: 'Chicago' },
    // Add more reservations as needed
  ];

  const renderReservationItem = ({ item }) => (
    <Card containerStyle={{ backgroundColor: 'blue' }}>
      <Card.Title style={{ color: 'white' }}>Date: {item.date}</Card.Title>
      <Card.Divider />
      <Text style={{ color: 'white' }}>Time Slot: {item.timeSlot}</Text>
      <Text style={{ color: 'white' }}>Location: {item.location}</Text>
    </Card>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#000', alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 20, color: '#00ffff' }}>Reservations Screen</Text>
      <Text style={{ fontSize: 15, color: '#00ffff' }}>Upcoming Reservations</Text>

      {/* FlatList of Reservation Cards */}
      <FlatList
        data={reservationsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
      />
    </View>
  );
};

export default ReservationsScreen;
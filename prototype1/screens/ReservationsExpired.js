import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


const ReservationsScreen = () => {
    // Sample data for the list of reservations
    const reservationsData = [
        { id: 1, date: '2024-02-26', timeSlot: '10:00 AM - 12:00 PM', location: 'Amsterdam' },
        { id: 2, date: '2024-02-27', timeSlot: '2:00 PM - 4:00 PM', location: 'Rotterdam' },
        { id: 3, date: '2024-02-28', timeSlot: '9:00 AM - 11:00 AM', location: 'Eindhoven' },
        // Add more reservations as needed
    ];


    // Function to render each reservation item
    const renderReservationItem = ({ item }) => (
        <Card containerStyle={{ backgroundColor: 'cyan', borderRadius: 20, width: 390, height: 120 }}>
            <Card.Title style={{ color: 'white' }}>Date: {item.date}</Card.Title>
            <Card.Divider />
            <Text style={{ color: 'white' }}>Time Slot: {item.timeSlot}</Text>
            <Text style={{ color: 'white' }}>Location: {item.location}</Text>
        </Card>
    );
    const navigation = useNavigation();

    const handleExpiredPress = () => {
        // Navigate to the "Expired" screen
        navigation.navigate('Reservations');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#000', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20, color: '#00ffff' }}>Reservations Screen</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleExpiredPress}>
                    <Text style={{ fontSize: 15, color: '#00ffff', textDecorationLine: 'underline' }}>Upcoming Reservations</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 15, color: '#00ffff', textDecorationLine: 'underline', marginLeft: 10 }}>Expired Reservations</Text>
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

export default ReservationsScreen;
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
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ReservationsExpired = () => {
    // Sample data for the list of reservations
    const ExpiredReservationsData = [
        { id: 1, date: new Date('2024-03-03'), timeSlot: '10:00 AM - 11:00 PM', location: 'Schiphol-Rijk' },
        { id: 2, date: new Date('2024-02-27'), timeSlot: '2:00 PM - 3:00 PM', location: 'Schiphol-Rijk' },
        { id: 3, date: new Date('2024-02-26'), timeSlot: '9:00 AM - 10:00 AM', location: 'Schiphol-Rijk' },
        // Add more reservations as needed
    ];

    const FormatDate = (date, short=true) => {
        const nth = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
              case 1:  return "st";
              case 2:  return "nd";
              case 3:  return "rd";
              default: return "th";
            }
          };

        var month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
        var monthS = ["Jan", "Feb", "Mrt", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    
        if (!short) return month[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
        else return monthS[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
    }

    // Function to render each reservation item
    const renderReservationItem = ({ item }) => (
        <View className="bg-main_box_color w-full rounded-lg p-2.5 mb-3 opacity-70">
            <View className="flex-row items-center justify-between mb-1">
                <Text className="text-lg text-wit" style={styles.font_semibold}>{FormatDate(item.date)}</Text>
                <FontAwesomeIcon icon={faCalendarDays} size={20} color="#7C7C7C" />
            </View>

            <View className="flex-row items-center mb-1">
                <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faClock} size={20} color="#7C7C7C" />  
                </View>  
                <Text className="text-lg text-wit" style={styles.font_regular}>{item.timeSlot}</Text>
            </View>

            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faLocationDot} size={20} color="#7C7C7C" />  
                </View>  
                <Text className="text-lg text-wit" style={styles.font_thin}>{item.location}</Text>
            </View>
        </View>
    );
    const navigation = useNavigation();

    const handleReservationPress = () => {
        // Navigate to the "Expired" screen
        navigation.navigate('Reservations');
    };

    return (
        <View className="flex-1 w-full justify-start bg-main_bg_color items-start p-3">
            {/* FlatList of Reservation Cards */}
            <FlatList className="w-full"
                data={ExpiredReservationsData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderReservationItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    font_regular: {
        fontFamily: 'Poppins_400Regular',
    },
    font_thin: {
        fontFamily: 'Poppins_300Light',
    },
    font_medium: {
        fontFamily: 'Poppins_500Medium',
    },
    font_semibold: {
        fontFamily: 'Poppins_600SemiBold',
    },
    font_bold: {
        fontFamily: 'Poppins_700Bold',
    },

});

export default ReservationsExpired;
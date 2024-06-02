import React, { useEffect, useState } from 'react';
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
    const [reservations, setReservations] = useState([]);

    const getData = async () => {
        try {
            const response = await fetch('http://192.168.1.8:8080/items');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
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

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthS = ["Jan", "Feb", "Mrt", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (!short) return month[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
        else return monthS[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
    };

    // Check if the reservation is expired and show only the expired ones
    const expiredReservations = reservations.filter((reservation) => {
        return new Date(reservation.Date) < new Date();
    });

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
                data={expiredReservations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderReservationItem}
            />
        </View>
    );
};

const stylesbox = StyleSheet.create({
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

export default ReservationsExpired;

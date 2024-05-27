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
            const response = await fetch('http://localhost:8080/items');
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
            <Text style={stylesbox.header}>Expired Reservations</Text>
            <View style={stylesbox.headerRow}>
                <Text style={stylesbox.headerText}>ID</Text>
                <Text style={stylesbox.headerText}>UserID</Text>
                <Text style={stylesbox.headerText}>LaadpaalID</Text>
                <Text style={stylesbox.headerText}>Date</Text>
                <Text style={stylesbox.headerText}>Priority</Text>
                <Text style={stylesbox.headerText}>Opgeladen</Text>
                <Text style={stylesbox.headerText}>Opgehaald</Text>
            </View>
            <FlatList
                data={expiredReservations}
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

export default ReservationsExpired;

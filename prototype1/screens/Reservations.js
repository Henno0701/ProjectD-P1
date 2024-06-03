import { Button, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IP } from '@env';
import React, { useState, useEffect } from 'react';

import HomeScreen from './Home';

import ReservationsUpcoming from './ReservationsUpcoming';
import ReservationsExpired from './ReservationsExpired';


const Tab = createMaterialTopTabNavigator();

export default function ReservationsScreen() {
    const insets = useSafeAreaInsets();
    const [ allReservations, setAllReservations ] = useState([]);
    const [ upcomingReservations, setUpcomingReservations ] = useState([]);
    const [ expiredReservations, setExpiredReservations ] = useState([]);

    const getData = async () => {
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
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reservations = await getData();
                setAllReservations(reservations);
                console.log('All Reservations:', reservations);
    
                const upcomingReservations = reservations.filter((reservation) => {
                    return new Date(reservation.date) > new Date();
                });

                const upcomingReservationsSorted = upcomingReservations.sort((a, b) => new Date(a.date) - new Date(b.date));
                setUpcomingReservations(upcomingReservationsSorted);
    
                const expiredReservations = reservations.filter((reservation) => {
                    return new Date(reservation.date) < new Date();
                });

                const expiredReservationsSorted = expiredReservations.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpiredReservations(expiredReservationsSorted);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData(); // Retrieve data
    }, []);
    

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#1E80ED',
                tabBarInactiveTintColor: '#686868',
                tabBarLabelStyle: {
                    fontSize: 14,
                    textTransform: 'none',
                    fontWeight: '500',
                    fontFamily: 'Montserrat_400Regular'
                },
                tabBarStyle: {
                    paddingTop: insets.top,
                    backgroundColor: '#121212',
                    color: '#fff',
                },

            })}>
            <Tab.Screen
                name="Upcoming"
                children={() => <ReservationsUpcoming reservations={upcomingReservations} />}
            />
            <Tab.Screen
                name="Expired"
                children={() => <ReservationsExpired reservations={expiredReservations} />}
            />
        </Tab.Navigator>
    );
}
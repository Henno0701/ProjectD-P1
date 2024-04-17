import { Button, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ReservationsUpcoming from './ReservationsUpcoming';
import ReservationsExpired from './ReservationsExpired';

const Tab = createMaterialTopTabNavigator();

export default function ReservationsScreen() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#1E80ED',
                tabBarInactiveTintColor: '#686868',
                tabBarLabelStyle: {
                    fontSize: 14,
                    textTransform: 'none',
                    fontWeight: '500',
                    fontFamily: 'Poppins_400Regular'
                },
                tabBarStyle: {
                    paddingTop: insets.top,
                    backgroundColor: '#121212',
                    color: '#fff',
                },

            })}>
            <Tab.Screen name="Upcoming" component={ReservationsUpcoming} />
            <Tab.Screen name="Expired" component={ReservationsExpired} />
        </Tab.Navigator>
    );
}
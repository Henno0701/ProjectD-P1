import { Image, Text, View, Pressable, Modal, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileOverviewScreen from './Profile-Overview';

import AccountModalScreen from '../components/Modals/Account-Modal';
import ContactModalScreen from '../components/Modals/Contact-Modal';
import SecurityModalScreen from '../components/Modals/Security-Modal';

const RootStack = createStackNavigator();

export default function ProfileScreen() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Group>
                <RootStack.Screen  name="Profile" component={ProfileOverviewScreen} />
            </RootStack.Group>
            <RootStack.Group 
            screenOptions={{ 
                presentation: 'modal', 
                headerShown: true, 
                headerStyle: {
                    backgroundColor: '#232323',
                    shadowColor: 'transparent',
                    elevation: 0,
                }, 
                headerTintColor: '#fff', headerTitleStyle: {
                    fontFamily: 'Montserrat_500Medium',
                    fontSize: 18,
                } 
            }}>
                <RootStack.Screen name="Account" component={AccountModalScreen} />
                <RootStack.Screen name="Contact Details" component={ContactModalScreen} />
                <RootStack.Screen name="Security" component={SecurityModalScreen} />
            </RootStack.Group>
        </RootStack.Navigator>
    );
}

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

import { Button, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StationsOverviewScreen from './Stations-Overview';
import StationsReserveScreen from './Stations-Reserve';

const Tab = createMaterialTopTabNavigator();

export default function StationsScreen() {
  const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#1E80ED',
            tabBarInactiveTintColor: '#686868',
            tabBarLabelStyle: { 
              fontSize: 14, 
              textTransform: 'none', 
              fontWeight: '500'
            },
            tabBarStyle: {
              paddingTop: insets.top, 
              backgroundColor: '#121212', 
              color: '#fff',
            },
          
          })}>
          <Tab.Screen name="Overview" component={StationsOverviewScreen} />
          <Tab.Screen name="Reserve" component={StationsReserveScreen} />
          <Tab.Screen name="Quick Reserve" component={StationsOverviewScreen} />
        </Tab.Navigator>
    );
  }
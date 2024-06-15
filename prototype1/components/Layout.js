import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faCalendarDays, faChargingStation, faClipboardList, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

// Screens
import HomeScreen from '../screens/Home';
import StationsScreen from '../screens/Stations';
import ReservationsScreen from '../screens/Reservations';
import ProfileScreen from '../screens/Profile';

//Screen names
const homeName = "Home";
const stationsName = "Stations";
const reservationsName = "Reservations";
const profileName = "Profile";


const Tab = createBottomTabNavigator();

function MainContainer({ onLogout }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        headerStyle={{ backgroundColor: '#232323' }}
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
            headerShown: false,
            activeTintColor: '#1E80ED',
            inactiveTintColor: '#686868',

            // styles for the label
            tabBarLabelStyle: { fontSize: 12, color: "#fff", fontWeight: "300", fontFamily: "Montserrat_300Light" },

            tabBarIcon: ({ color }) => {
                let iconName;
                let rn = route.name;

                if (rn === homeName) {
                iconName = faHome;

                } else if (rn === stationsName) {
                iconName = faChargingStation;
                
                } else if (rn === reservationsName) {
                iconName = faCalendarDays;
                
                } else if (rn === profileName) {
                iconName = faUser;
                }
        

                return <FontAwesomeIcon icon={iconName} size={28} color={color} />;
            },
          // styles for the whole tabbar
          tabBarStyle: {paddingVertical: 10, backgroundColor: '#232323', height: 90, borderTopWidth: 0 }
          
        })}
        >

        <Tab.Screen name={homeName} component={HomeScreen} initialParams={{ onLogout }}/>
        <Tab.Screen name={stationsName} component={StationsScreen} />
        <Tab.Screen name={reservationsName} component={ReservationsScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} initialParams={{ onLogout }}  />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
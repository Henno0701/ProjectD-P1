import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { faCalendarDays, faChevronRight, faCircleExclamation, faPersonCircleExclamation, faPlugCircleExclamation, faUser, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NotificationsButton from '../components/Notification-Button';
import { IP } from '@env';
import ButtonList from '../components/Button-List';
import { createStackNavigator } from '@react-navigation/stack';
import UsersModal from '../components/Modals/Admin-Users-Modal';
import AddUserModal from '../components/Modals/Admin-Add-User-Modal';

const Stack = createStackNavigator();

const AdminPanelMainScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState({});

    const getNotifications = async () => {
        try {
            const response = await fetch(`http://${IP}:8080/getAllMeldingen`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const json = await response.json(); // Assuming response is JSON, use appropriate method accordingly
            return json;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        // Fetch data
        getNotifications().then(notificationsList => {
            setNotifications(notificationsList);
        });
    }, []);

    const handleModalOpen = (screen) => {
        navigation.navigate(screen);
    };


    return (
        <View className="flex-1 bg-main_bg_color p-3" style={{ paddingTop: insets.top }}>
            <Text className="text-schuberg_blue text-4xl mt-10" style={styles.font_thin}>Welcome</Text>
            {/* !needs function that checks the name of the user. */}
            <Text className="text-[#ffffff] text-2xl -mt-2" style={styles.font_thin}>Admin</Text>
            <Text className="text-[#686868] text-sm mt-5" style={styles.font_thin}>Notifications</Text>
            <View>
                <NotificationsButton Notifications={notifications}/>
            </View>

            <View>
                <Text className="text-[#686868] text-sm mt-5" style={styles.font_thin}>Users</Text>
                <ButtonList>
                    <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => handleModalOpen("AdminPanelScreenUsers")}>
                        <View className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faUsers} size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>See all users</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4" onPress={() => handleModalOpen("AdminPanelScreenAddUser")}>
                        <View className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faUserPlus} size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>Add new user</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </ButtonList>
            </View>


        </View>
    );
};

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

  const AdminPanelScreen = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen 
          name="AdminPanelScreen" 
          component={AdminPanelMainScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AdminPanelScreenUsers" 
          component={UsersModal} 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="AdminPanelScreenAddUser" 
          component={AddUserModal} 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack.Navigator>
    );
  };

export default AdminPanelScreen;
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { faCalendarDays, faCircleExclamation, faPersonCircleExclamation, faPlugCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NotificationsButton from '../components/Notification-Button';
import { IP } from '@env';

const AdminPanelScreen = () => {
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


    return (
        <View className="flex-1 bg-main_bg_color p-3" style={{ paddingTop: insets.top }}>
            <Text className="text-schuberg_blue text-4xl mt-10" style={styles.font_thin}>Welcome</Text>
            {/* !needs function that checks the name of the user. */}
            <Text className="text-[#ffffff] text-2xl -mt-2" style={styles.font_thin}>Admin</Text>
            <Text className="text-[#686868] text-sm mt-5" style={styles.font_thin}>Notifications</Text>
            <View>
                <NotificationsButton Notifications={notifications}/>
            </View>


        </View>
    );
};

export default AdminPanelScreen;

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
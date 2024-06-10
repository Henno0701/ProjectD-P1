import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { faPersonCircleExclamation, faPlugCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';

const NotificationsButton = () => {
    return (
        <ScrollView>
            <TouchableOpacity className="w-full relative h-20 flex flex-row mt-1 p-3 bg-main_box_color rounded-xl items-center">
                <Text className="text-box-information-text absolute top-3 right-3 text-sm -mt-1" style={styles.font_regular}>10:23</Text>
                <View className="flex-row items-center">
                    <View className="flex-row p-3 bg-main_bg_color rounded-full">
                        <FontAwesomeIcon size={28} icon={faPlugCircleExclamation} color='#db2525'/>
                    </View>
                    <View className="ml-2">
                        <Text className="text-schuberg_blue text-lg" style={styles.font_medium}>Station Report</Text>
                        <Text className="text-box-information-text text-sm -mt-1" style={styles.font_thin}>Charger has been reported as defected.</Text>
                    </View>
                </View>       
            </TouchableOpacity>
            <TouchableOpacity className="w-full relative h-20 flex flex-row mt-1 p-3 bg-main_box_color rounded-xl items-center">
                <Text className="text-box-information-text absolute top-3 right-3 text-sm -mt-1" style={styles.font_regular}>10:23</Text>
                <View className="flex-row items-center">
                    <View className="flex-row p-3 bg-main_bg_color rounded-full">
                        <FontAwesomeIcon size={28} icon={faPersonCircleExclamation} color='#db2525'/>
                    </View>
                    <View className="ml-2">
                        <Text className="text-schuberg_blue text-lg" style={styles.font_medium}>Reservation Report</Text>
                        <Text className="text-box-information-text text-sm -mt-1" style={styles.font_thin}>Somebody is on my charging station.</Text>
                    </View>
                </View>       
            </TouchableOpacity>
        </ScrollView>
    );
};

export default NotificationsButton;

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

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { faPersonCircleExclamation, faPlugCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';

const NotificationsButton = ({ Notifications }) => {
    const FormatDate = (date) => {
        const d = new Date(date);
        // Prevent Minutes from being single digit
        return `${d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`;
    }
    return (
        <ScrollView>
            {Object.entries(Notifications).map(([value, melding], index) => (
                <TouchableOpacity key={index} className="w-full relative h-20 flex flex-row mt-1 p-3 bg-main_box_color rounded-xl items-center">
                    <Text className="text-box-information-text absolute top-3 right-3 text-sm -mt-1" style={styles.font_regular}>{FormatDate(melding.date)}</Text>
                    <View className="flex-row items-center">
                        <View className="flex-row p-3 bg-main_bg_color rounded-full">
                           <FontAwesomeIcon size={28} icon={melding.text === "Somebody is on my charging station." ? faPersonCircleExclamation : faPlugCircleExclamation} color='#db2525' />
                        </View>
                        <View className="ml-2">
                            <Text className="text-schuberg_blue text-lg" style={styles.font_medium}>{melding.text === "Somebody is on my charging station." ? "Reservation Report" : "Station Report"}</Text>
                            <Text className="text-box-information-text text-sm -mt-1" style={styles.font_thin}>{melding.text}</Text>
                        </View>
                    </View>       
                </TouchableOpacity>
            ))}
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

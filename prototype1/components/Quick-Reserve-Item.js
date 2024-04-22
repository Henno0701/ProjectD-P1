import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';

const QuickReserveItem = ({ timeSlots, setPressedTimeSlot }) => {
    const [clickedID, setClickedID] = useState(null);

    const FormatTime = (time) => {
        var timeString = time.toString() + ":00" + " - " + (time + 1).toString() + ":00";
        return timeString;
    }

    const handleClick = async (index, time) => {
        setClickedID(index);
        // await setPressedTimeSlot(date);
    };

    return (
        timeSlots.map((timeSlot, index) => (
            <TouchableOpacity className="flex-row w-full items-center mb-3" onPress={() => handleClick(index, timeSlot)}>
                <View className="bg-main_box_color w-full rounded-lg p-2.5" style={{backgroundColor: index === clickedID ? '#1E80ED' :  '#1E1E1E'}}>
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Available Slot</Text>
                        <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                    </View>
                    <View className="flex-row w-full items-center justify-between mt-2">
                        <View className="flex-row items-center justify-between w-3/5 rounded-lg">
                            <Text className={`text-lg ${index === clickedID ? "text-[#fff]" : "text-profile-grijs"}`} style={styles.font_thin}>Today</Text>
                            <Text className="text-lg text-[#fff]" style={styles.font_semibold}>{FormatTime(timeSlot)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ))
    );
};

export default QuickReserveItem;

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
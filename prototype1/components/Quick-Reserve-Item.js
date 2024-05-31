import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';

const QuickReserveItem = ({ timeSlots, setPressedTimeSlot }) => {
    const [clickedID, setClickedID] = useState(null);

    const FormatTime = (time) => {
        var date = new Date(time);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var timeString = hours.toString() + ":" + minutes.toString().padStart(2, '0') + " - " + (hours + 1).toString() + ":" + minutes.toString().padStart(2, '0');
        return timeString;
    }

    const handleClick = async (index, time) => {
        setClickedID(index);
        // await setPressedTimeSlot(date);
    };

    return (
        timeSlots.map((timeSlot) => (
            <TouchableOpacity key={timeSlot.laadpaalID} className="flex-row w-full items-center mb-3" onPress={() => handleClick(timeSlot.laadpaalID, timeSlot)}>
                <View className="bg-main_box_color w-full rounded-lg p-2.5" style={{backgroundColor: timeSlot.laadpaalID === clickedID ? '#1E80ED' :  '#1E1E1E'}}>
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Available Slot</Text>
                        <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                    </View>
                    <View className="flex-row w-full items-center justify-between mt-2">
                        <View className="flex-row items-center justify-between w-full rounded-lg">
                            <Text className={`text-lg basis-1/3 ${timeSlot.laadpaalID === clickedID ? "text-[#fff]" : "text-profile-grijs"}`} style={styles.font_thin}>Today</Text>
                            <Text className="text-lg basis-2/3 text-[#fff]" style={styles.font_semibold}>{FormatTime(timeSlot.date)}</Text>
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
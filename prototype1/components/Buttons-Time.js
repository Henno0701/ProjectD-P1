import React from 'react';
import { Pressable, Text, TouchableOpacity, Vibration } from 'react-native';
import { View } from 'react-native';
import { useState, useEffect } from 'react';

const GenerateTimeSlotsButtons = ({ times, setSelectedTime }) => {
    const [clickedID, setClickedID] = useState(null);

    useEffect(() => {
        // Reset clickedID when times or selectedDate changes
        setClickedID(null);
    }, [times]);

    const isPressed = async (time, index) => {
        setClickedID(index);
        await setSelectedTime(time);
    };

    return (
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
            {times.map((time, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={{
                        backgroundColor: index === clickedID ? '#1E80ED' :  '#2E2E2E',
                        width: '30%',
                        height: 40,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => isPressed(time, index)}>
                    <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28, fontFamily: 'Montserrat_400Regular'}} >{time}:00</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default GenerateTimeSlotsButtons;
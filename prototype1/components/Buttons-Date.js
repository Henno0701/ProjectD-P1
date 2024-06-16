import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const GenerateDateButtons = ({ week, setSelectedDate }) => {
    const [clickedID, setClickedID] = useState(null);

    const handleClick = async (index, date) => {
        setClickedID(index);
        await setSelectedDate(date);
    };

    return (
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {week.map((date, index) => (
                <TouchableOpacity 
                    key={index}
                    style={{
                        backgroundColor: index === clickedID ? '#1E80ED' :  '#2E2E2E',
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}         
                    onPress={() => handleClick(index, date)} 
                >
                     <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28, fontFamily: 'Montserrat_400Regular'}} >{date.getDate()}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default GenerateDateButtons;
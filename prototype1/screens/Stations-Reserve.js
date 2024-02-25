import { Button, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';

import { faCalendar, faCalendarDays } from '@fortawesome/free-regular-svg-icons';

const StyledView = styled(View)
const StyledText = styled(Text)

// Returning the correct form of the dates in a string
const FormatDate = (date, short=true) => {
    var month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
    var monthS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!short) return month[date.getMonth()] + " " + date.getDate();
    else return monthS[date.getMonth()] + " " + date.getDate();
}

function dates(date) {
    var week= new Array(); 
    date.setDate((date.getDate() - date.getDay() +1));

    // Looping through the week and adding the dates to the array
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(date)
        ); 
        // Incrementing the date by 1
        date.setDate(date.getDate() +1);
    }
    return week; 
}

// Generate the buttons of the week
const GenerateDateButtons = (date, selectedButton, handleButtonPress) => {
    return (
        <TouchableHighlight key={date} className={`${selectedButton === date ? "bg-schuberg_blue" : "bg-secondary_box_color"} w-10 h-10 justify-center items-center rounded-lg`} onPress={() => handleButtonPress(date)} underlayColor="transparent" >
            <Text className="text-lg text-[#fff]">{date.getDate()}</Text>
        </TouchableHighlight>
    );
}

const GenerateTimeSlots = (time) => {
    return (
        <TouchableHighlight key={time} className={`bg-secondary_box_color w-[30%] mb-2.5 h-10 justify-center items-center rounded-lg`} >
            <Text className="text-lg text-[#fff]">{time.getDate()}</Text>
        </TouchableHighlight>
    );
}


export default function StationsReserveScreen() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week + 1
    var last = first + 6; // last day is the first day + 6
    var week = dates(new Date(curr.setDate(first))); // get the dates of the week

    var firstday = FormatDate(new Date(curr.setDate(first)));
    var lastday = FormatDate(new Date(curr.setDate(last)));

    const [selectedButton, setSelectedButton] = useState(null);

    const handleDateSelectorButton = (buttonIndex) => {
        setSelectedButton(buttonIndex);
    };

    return (
      <StyledView className="flex-1 bg-main_bg_color items-center p-2.5">

        <StyledView className="flex-row w-full items-center mb-3">
            <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                <StyledView className="flex flex-row items-center justify-between">
                    <Text className="text-lg text-[#fff] font-semibold">{firstday} - {lastday}</Text>
                    <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                </StyledView>
                <StyledView className="flex-row w-full items-center justify-between mt-2">
                    {week.map((date) => GenerateDateButtons(date, selectedButton, handleDateSelectorButton))}
                </StyledView>
            </StyledView>
        </StyledView>

        <StyledView className="flex-row w-full items-center">
            <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                <StyledView className="flex flex-row items-center justify-between">
                    <Text className="text-lg text-[#fff] font-semibold">Select Time slot</Text>
                    <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                </StyledView>
                <StyledView className="flex-row flex-wrap w-full items-center justify-between mt-2">
                    {week.map((date) => GenerateTimeSlots(date))}
                </StyledView>
            </StyledView>
        </StyledView>
      </StyledView>
    );
  }
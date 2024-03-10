import React, { useState, useEffect } from 'react';
import { View, FlatList, Button } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { faCalendarDays, faClock, faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { styled } from 'nativewind';

const StyledView = styled(View);

const ReservationsExpired = ({ expiredReservations }) => {
  return (
    <View>
      <Text>Expired Reservations:</Text>
      <FlatList
        data={expiredReservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Card.Title>{item.date}</Card.Title>
            <Text>Time Slot: {item.timeSlot}</Text>
            <Text>Location: {item.location}</Text>
          </Card>
        )}
      />
    </View>
  );
};

const Reservations = () => {
  const [reservationsData, setReservationsData] = useState([
    { id: 1, date: new Date('2024-03-17'), timeSlot: '10:00 AM - 12:00 PM', location: 'Schiphol-Rijk', chargingstation: 'LP-01' },
    { id: 2, date: new Date('2024-03-12'), timeSlot: '2:00 PM - 4:00 PM', location: 'Schiphol-Rijk', chargingstation: 'LP-03' },
    { id: 3, date: new Date('2024-03-10'), timeSlot: '9:00 AM - 11:00 AM', location: 'Schiphol-Rijk', chargingstation: 'LP-23' },
    // Add more reservations as needed
  ]);

  const [expiredReservations, setExpiredReservations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    checkExpiredReservations();
  }, []);

  const checkExpiredReservations = () => {
    const currentDate = new Date();
    const expiredReservations = reservationsData.filter(reservation => reservation.date < currentDate);
    setExpiredReservations(expiredReservations);
    setReservationsData(prevReservations => prevReservations.filter(reservation => reservation.date >= currentDate).sort((a, b) => a.date - b.date));
  };

  const handleExpiredPress = () => {
    navigation.navigate('ReservationsExpired', { expiredReservations });
  };

  const FormatDate = (date, short=true) => {
    const nth = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
      };

    var month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
    var monthS = ["Jan", "Feb", "Mrt", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!short) return month[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
    else return monthS[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
}

  const renderReservationItem = ({ item }) => (
    <View className={`${item.date == new Date() ? "bg-schuberg_blue" : "bg-main_box_color"} w-full rounded-lg p-2.5 mb-3`}>
            <StyledView className="flex-row items-center justify-between mb-1">
                <Text className="text-lg text-wit font-light">{FormatDate(item.date)}</Text>
                <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
            </StyledView>

            <StyledView className="flex-row items-center mb-0.5">
                <StyledView className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faClock} size={20} color="#fff" />  
                </StyledView>  
                <Text className="text-lg text-wit">{item.timeSlot}</Text>
            </StyledView>

            <StyledView className="flex-row items-center">
                <StyledView className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
                    <FontAwesomeIcon icon={faLocationDot} size={20} color="#1E80ED" />  
                </StyledView> 
                <StyledView className="flex-row items-center"> 
                  <Text className="text-lg text-schuberg_blue font-bold mr-2">{item.chargingstation}</Text>
                  <Text className="text-md font-normal text-profile-grijs">{item.location}</Text>
                </StyledView>
            </StyledView>
        </View>
  );

  return (
    <View className="flex-1 w-full justify-start bg-main_bg_color items-start p-2.5">
      <FlatList className="w-full"
        data={reservationsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
      />
    </View>
  );
};

export default Reservations;
import React, { useState, useEffect } from 'react';
import { View, FlatList, Button } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { faCalendarDays, faClock, faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
    { id: 1, date: '2024-02-26', timeSlot: '10:00 AM - 12:00 PM', location: 'New York' },
    { id: 2, date: '2024-02-27', timeSlot: '2:00 PM - 4:00 PM', location: 'Los Angeles' },
    { id: 3, date: '2024-02-28', timeSlot: '9:00 AM - 11:00 AM', location: 'Chicago' },
    // Add more reservations as needed
  ]);

  const [expiredReservations, setExpiredReservations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    checkExpiredReservations();
  }, []);

  const checkExpiredReservations = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const expiredReservations = reservationsData.filter(reservation => reservation.date < currentDate);
    setExpiredReservations(expiredReservations);
    setReservationsData(prevReservations => prevReservations.filter(reservation => reservation.date >= currentDate));
  };

  const handleExpiredPress = () => {
    navigation.navigate('ReservationsExpired', { expiredReservations });
  };

  const renderReservationItem = ({ item }) => (
    <Card containerStyle={{ backgroundColor: '#1e51de', borderRadius: 20, width: 390, height: 220 }}>
      <FontAwesomeIcon icon={faCalendarDays} /><Card.Title style={{
        color: 'white', paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>Date: {item.date}</Card.Title>
      <FontAwesomeIcon icon={faClock} /><Text style={{ color: 'white', padding: 12 }}>Time Slot: {item.timeSlot}</Text>
      <FontAwesomeIcon icon={faFlag} /><Text style={{ color: 'white', padding: 8 }}>Location: {item.location}</Text>
    </Card>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#000', alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button title="View Expired Reservations" onPress={handleExpiredPress} />
      </View>
      <FlatList
        data={reservationsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
      />
    </View>
  );
};

export default Reservations;
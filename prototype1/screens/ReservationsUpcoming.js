import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { IP } from '@env';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDays, faClock, faFlag, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Reservations = ({ reservations }) => { // Destructure reservations from props
  const CalculateTime = (date) => {
    var hours = date.getHours();
    return hours + ":00 - " + (hours + 1) + ":00";
  }

  const formatDate = (date, short = true) => {
    const nth = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthS = ["Jan", "Feb", "Mrt", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!short) return month[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
    else return monthS[date.getMonth()] + " " + date.getDate() + nth(date.getDate());
  }

  const renderReservationItem = ({ item }) => (
    <View className="px-3 py-1.5">
      <View className={`${reservations[0] == item ? "bg-schuberg_blue" : "bg-main_box_color"} w-full rounded-lg p-2.5`}>
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg text-wit font-light" style={styles.font_semibold}>{formatDate(new Date(item.date))}</Text>
          <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
        </View>

        <View className="flex-row items-center mb-0.5">
          <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
            <FontAwesomeIcon icon={faClock} size={20} color="#fff" />  
          </View>  
          <Text className="text-lg text-wit" style={styles.font_regular}>{CalculateTime(new Date(item.date))}</Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-main_bg_color rounded-full items-center justify-center mr-2">
            <FontAwesomeIcon icon={faLocationDot} size={20} color="#1E80ED" />  
          </View> 
          <View className="flex-row items-center"> 
            <Text className={`${reservations[0] == item ? "text-wit" : "text-schuberg_blue"} text-lg font-bold mr-2`} style={styles.font_medium}>Schiphol-Rijk</Text>
            {/* <Text className="text-lg text-schuberg_blue font-bold mr-2" style={styles.font_thin}>{item.laadpaalID}</Text> */}
            {/* <Text className="text-md font-normal text-profile-grijs" style={styles.font_thin}>{item.location}</Text> */}
          </View>
        </View>
      </View>
      </View>
  );

  return (
    <View className="flex-1 bg-main_bg_color">
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.id.toString()} // Add a keyExtractor to ensure unique keys for each item
      />
    </View>
  );
};

const stylesbox = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  reservationContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
});

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

export default Reservations;

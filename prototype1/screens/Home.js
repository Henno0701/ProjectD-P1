import React, { useState, useEffect } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CountDown } from 'react-native-countdown-component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBattery2, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import ProgressBar from '../data/ProgressBar';

export default function HomeScreen({ navigation: { navigate } }) {
  const date = new Date();
  var Name = "John";
  var reservation = false;
  var Battery = 10;
  var License = "XN-0A2-B2";
  var Station = "LP-01A";
  var Charge = 10; // kW
  var startRes = (Date.now() / 1000) - 360; // Start time in seconds
  var TimeSlot = "13:00-14:00";

  const insets = useSafeAreaInsets();

  const [progress, setProgress] = useState(0);
  const [kWhCharged, setkWhCharged] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() / 1000) - startRes;
      const duration = 3600; // Total duration in seconds (1 hour)
      const newProgress = (elapsedTime / duration) * 100;
      setProgress(newProgress);

      // Calculate kWh charged
      const kWh = (Charge * elapsedTime) / 3600;
      setkWhCharged(kWh);

      if (elapsedTime >= duration) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startRes, Charge]);

  return (
    <View className="flex-1 bg-main_bg_color p-3" style={{ paddingTop: insets.top }}>
      <Text className="text-schuberg_blue text-4xl mt-10" style={styles.font_thin}>Welcome</Text>
      {/* !needs function that checks the name of the user. */}
      <Text className="text-[#ffffff] text-2xl -mt-2" style={styles.font_thin}>{Name}</Text>
      {/* If there is a reservation show information about it. */}
      {/* !needs function that checks if there is a reservation. */}
      {!reservation ?
        <View>
          {/* Here needs to be an if statement that shows info of reservation if there is one */}
          {/* !needs function that checks Battery */}
          <Text className="text-[#686868] text-sm mt-5" style={styles.font_thin}>Car Status</Text>
          <View className="w-full h-20 flex flex-row mt-1">
            <View className="flex-row w-1/2 basis-[48] bg-main_box_color rounded-xl justify-evenly items-center">
              <View className="w-12 h-12 bg-main_bg_color justify-center items-center -rotate-90 rounded-full">
                <FontAwesomeIcon size={32} color="#db2525" icon={faBattery2} />
              </View>
              <View>
                <Text className="text-[#ffffff] text-base" style={styles.font_thin}>Battery</Text>
                <Text className="text-[#686868]" style={styles.font_regular}>Power: {Battery}%</Text>
              </View>
            </View>

            <View className="basis-[4]"></View>

            {/* Here needs to be an if statement that shows info of reservation if there is one */}
            {/* !needs function that checks time left */}
            <View className="w-1/2 basis-[48] bg-main_box_color justify-center rounded-xl">
              <View className="justify-evenly items-center flex flex-row ">
                <View className="w-12 h-12 bg-main_bg_color justify-center items-center rounded-full">
                  <FontAwesomeIcon size={32} color="#56db21" icon={faClock} />
                </View>
                <CountDown
                  until={checkTimeLeft(startRes)}
                  size={16}
                  digitStyle={{ backgroundColor: null, marginHorizontal: -2 }}
                  digitTxtStyle={{ color: '#FFF', fontFamily: 'Montserrat_400Regular' }}
                  timeToShow={['H', 'M', 'S']}
                  timeLabels={{ h: null, m: null, s: null }}
                  showSeparator
                  separatorStyle={{ color: '#FFF', marginHorizontal: -4 }}
                />
              </View>
            </View>
          </View>

          {/* Here needs to be an if statement that shows info of reservation if there is one */}
          {/* !needs function that checks information about the charging station */}
          <View className="w-full h-auto mt-3 bg-main_box_color rounded-xl">
            <Text className="mt-5 ml-5 text-box-information-text" style={styles.font_thin}>info:</Text>
            <View className="ml-5 mr-5 mt-1 mb-5 flex flex-row ">
              <View className="mr-10">
                <Text className="text-box-information-text" style={styles.font_thin}>Charging Station:</Text>
                <Text className="text-box-information-text" style={styles.font_thin}>Charging KW:</Text>
                <Text className="text-box-information-text" style={styles.font_thin}>Session Time:</Text>
                <Text className="text-box-information-text" style={styles.font_thin}>License Plate:</Text>
              </View>

              <View className="mr-5">
                <Text className="text-[#ffffff]" style={styles.font_regular}>{Station}</Text>
                <Text className="text-[#ffffff]" style={styles.font_regular}>{Charge} kW</Text>
                <Text className="text-[#ffffff]" style={styles.font_regular}>{TimeSlot}</Text>
                <Text className="text-[#ffffff]" style={styles.font_regular}>{License}</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="w-full h-auto mt-3 bg-main_box_color rounded-xl p-4">
            <Text className="text-[#ffffff]" style={styles.font_regular}>Charging Progress</Text>
            <ProgressBar progress={progress} />
            <Text className="text-[#ffffff]" style={styles.font_regular}>kWh Charged: {kWhCharged.toFixed(2)} kWh</Text>
          </View>
        </View>
        : null}


      {/* Button that leads to Reservations */}
      <Text className="text-box-information-text text-sm mt-3" style={styles.font_thin}>Quick Access</Text>
      <View className="mt-1">
        <TouchableOpacity className="flex flex-row justify-between items-center bg-main_box_color w-full h-20 rounded-xl px-8"
          onPress={() => navigate('Reservations')}>
          <Text className="text-[#FFFFFF] text-base" style={styles.font_regular}>Make Reservation</Text>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* example button */}
        <TouchableOpacity className="flex flex-row justify-between items-center bg-main_box_color w-auto h-20 mt-3 rounded-xl px-8"
          onPress={() => navigate('Home')}>
          <Text className="text-[#FFFFFF] text-base" style={styles.font_regular}>Example</Text>
        </TouchableOpacity>
      </View>
      {/* {chargerInfo()} */}
      {/* server ligt eruit sadly */}
    </View>
  );
}

function checkTimeLeft(startTime) {
  if (typeof startTime !== 'number') {
    throw new Error('checkTimeLeft must get a number in seconds');
  }
  var timeNow = Date.now() / 1000;
  var time = timeNow - startTime;
  return time;
}

// function APICall() {
//   var url = "https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=";
//   var token = "01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955";
//   var url1 = "&url=/poi/v1/locations&method=GET&locationsVisibilityScopes=ACCOUNTS_STATIONS";

//   fetch(url + token + url1, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       const formattedData = JSON.stringify(data, null, 2);
//       console.log(formattedData);
//       return data;
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// }

// function chargerInfo() {
//   var data = APICall();
//   console.log(data);
// }

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

import { text } from '@fortawesome/fontawesome-svg-core';
import { Button, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CountDown } from 'react-native-countdown-component';
import BatteryImage from '../assets/Battery.png'
import ClockImage from '../assets/Clock.png'

export default function HomeScreen({ navigation: { navigate } }) {
    var Name = "John";
    var reservation = false;
    var Battery = 10;
    var License = "XN-0A2-B2";
    var Station = "LP-01A";
    var Charge = 10;
    var timeLeftSec = 60 * 10;

    return (
      <View className="flex-1 bg-main_bg_color">
        <Text className="text-schuberg_blue text-4xl ml-5 mt-28">Welcome</Text>

        {/* !needs function that checks the name of the user. */}
        <Text className="text-[#ffffff] text-xl ml-5">{Name}</Text>

        {/* If there is a reservation show information about it. */}
        {/* !needs function that checks if there is a reservation. */}
        {!reservation?
        <View>
          {/* Here needs to be an if statement that shows info of reservation if there is one */}
          {/* !needs function that checks Battery */}
          <Text className="ml-5 mt-3 text-[#686868] text-sm">Car Status</Text>
          <View className="mr-5 ml-5 w-auto h-20 flex flex-row">
            <View className="h-auto mr-5 bg-secondary_bg_color rounded-xl justify-center items-center flex flex-row">
            <Image
              className="ml-5"
              source={BatteryImage}
            />
              <View className="ml-3 mr-5">
                <Text className="mb-1 text-[#ffffff] text-base">Battery</Text>
                <Text className="text-[#686868]">Power: {Battery}%</Text>
              </View>
            </View>

            {/* Here needs to be an if statement that shows info of reservation if there is one */}
            {/* !needs function that checks time left */}
            <View className=" h-20 flex-1 bg-secondary_bg_color justify-center rounded-xl">
              <View className="justify-center items-center flex flex-row ">
                <Image
                  className="ml-5"
                  source={ClockImage}
                />
                <CountDown
                  className="mr-5"
                  until={timeLeftSec}
                  size={12}
                  digitStyle={{backgroundColor: null, marginHorizontal: -2}}
                  digitTxtStyle={{color: '#FFF'}}
                  timeToShow={['H', 'M','S']}
                  timeLabels={{h: null, m: null, s: null}}
                  showSeparator
                  separatorStyle={{color: '#FFF', marginHorizontal: -2}} 
                />
                </View>
            </View>
          </View>

          {/* Here needs to be an if statement that shows info of reservation if there is one */}
          {/* !needs function that checks information about the charging station */}
          <View className="w-auto h-auto ml-5 mr-5 mt-3 bg-secondary_bg_color rounded-xl">
            <Text className="mt-5 ml-5 text-[#686868]">info:</Text>
            <View className="ml-5 mr-5 mt-1 mb-5 flex flex-row ">
              <View className="mr-5">
                <Text className=" text-[#686868]">Charging Station:</Text>
                <Text className="text-[#686868]">Charging KW:</Text>
                <Text className="text-[#686868]">License Plate:</Text>
              </View>

              <View className="mr-5">
                <Text className="text-[#ffffff]">{Station}</Text>
                <Text className="text-[#ffffff]">{Charge} kW</Text>
                <Text className="text-[#ffffff]">{License}</Text>
              </View>
            </View>
          </View>
        </View>
        :null}



        {/* Button that leads to Reservations */}
        <Text className="text-[#686868] text-sm ml-5 mt-3">Quick Access</Text>
        <TouchableOpacity className="bg-secondary_bg_color w-auto h-20 ml-5 mr-5 justify-center mt-3 rounded-xl"
            onPress={() => navigate('Reservations')}>
            <Text className="text-[#686868] ml-10">Make Reservation</Text>
        </TouchableOpacity>

        {/* example button */}
        <TouchableOpacity className="bg-secondary_bg_color w-auto h-20 ml-5 mr-5 justify-center mt-3 rounded-xl"
            onPress={() => navigate('Home')}>
            <Text className="text-[#686868] ml-10">Example</Text>
        </TouchableOpacity>

      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
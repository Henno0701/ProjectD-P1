import { text } from '@fortawesome/fontawesome-svg-core';
import { Button, View, Text, TouchableOpacity } from 'react-native';



export default function HomeScreen({ navigation: { navigate } }) {
    var Name = "John";
    return (
      <View className="flex-1 bg-main_bg_color">
        <Text className="text-schuberg_blue text-4xl ml-5 mt-28">Welcome</Text>

        {/* needs function that checks the name of the user */}
        <Text className="text-[#ffffff] text-xl ml-5">{Name}</Text>

        {/* Here needs to be an if statement that shows info of reservation if there is one */}


        {/* Button that leads to Reservations */}
        <Text className="text-[#ffffff6b] text-sm ml-5 mt-8 ">Quick Access</Text>
        <TouchableOpacity className="bg-secondary_bg_color w-auto h-20 ml-5 mr-5 justify-center mt-3 rounded-xl"
            onPress={() => navigate('Reservations')}>
            <Text className="text-[#ffffff6b] ml-10">Make Reservation</Text>
        </TouchableOpacity>

        {/* example button */}
        <TouchableOpacity className="bg-secondary_bg_color w-auto h-20 ml-5 mr-5 justify-center mt-3 rounded-xl"
            onPress={() => navigate('Home')}>
            <Text className="text-[#ffffff6b] ml-10">Example</Text>
        </TouchableOpacity>

      </View>
    );
  }
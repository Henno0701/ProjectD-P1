import { Button, View, Text } from 'react-native';

export default function HomeScreen({ navigation: { navigate } }) {
    return (
      <View>
        <Text className="text-red-500">This is the home screen of the app</Text>
        <Button
          title="Go to Profile"
          onPress={() => navigate('Profile')}
        />
      </View>
    );
  }
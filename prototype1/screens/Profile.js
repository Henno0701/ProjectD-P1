import { Image, Text, View, Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  // deze data moet wel uit de backend komen
  var Name = "Maruf Rodjan";
  var foto = "https://imgur.com/4OxZys5.jpg";
  var rood = "#FA8072";
  return (
    <View className="flex-1 bg-main_bg_color ">
      {/* Hier begint eerst de View bedoeld voor de gehele pagina (body) */}
      <View className="items-center mt-10">
        {/*Hier heb je dan een view die de tekst van profile netjes in het midden zet en profile plaats */}
        <Text className="text-wit mx-5 text-3xl">Profile</Text>
      </View>
      <View className="bg-secondary_bg_color flex flex-row my-8 mx-4 h-28 rounded-xl">
        {/* Hier hebben we dan de div die de persoons gegevens lat zien */}
        <Image
          className="m-3 w-20 h-20 rounded-full"
          source={{
            uri: foto,
          }}
        />
        <Text className="text-wit m-5 text-base flex-2">{Name}</Text>
      </View>
      <Text className="text-profile-grijs mx-5 text-base -my-7">Account settings</Text>
      {/* zogenaamde div met account settings komt hieronder met zn eigen view*/}
      <View className="bg-secondary_bg_color my-8 mx-4 h-44 rounded-xl">
        {/* ervoor zorgen dat het wel goeie css krijgt, maar liep veel vast */}
        <Button
          style={styles.button}
          title="Edit Account Settings"
          onPress={() => console.log("Navigate to Account Settings")}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
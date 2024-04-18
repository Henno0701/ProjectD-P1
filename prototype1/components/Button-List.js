import React from 'react';
import { Button, View, Text } from 'react-native';

function ButtonList({ navigation, children }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#121212" }}>
        {children}
      </View>
    );
}

export default ButtonList;
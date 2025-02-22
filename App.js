import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const icon = require('./assets/icon.png');

export default function App() {
  return (
    <View style={styles.container}>
      {/*Remote image, is mandatory to set the width and height*/}
      {/*<Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ width: 50, height: 50 }} />*/}
      {/*Local image*/}
      {/*<Image source={icon} style={{ width: 150, height: 500 }} />*/}
      <StatusBar style="auto" />
      <Text>Buenas tardes, here is the app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

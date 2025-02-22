import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import AppNavigator from './navigation/navigation';

const icon = require('./assets/icon.png');

const customFonts = {
  'BoldF': require('./assets/fonts/bold.otf'),
};

export default function App() {
  return (
    <View style={styles.container}>
      {/*Remote image, is mandatory to set the width and height*/}
      {/*<Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ width: 50, height: 50 }} />*/}
      {/*Local image*/}
      {/*<Image source={icon} style={{ width: 150, height: 500 }} />*/}
      <StatusBar style="auto" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "BoldF",
  },
});

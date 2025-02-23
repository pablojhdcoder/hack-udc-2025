import { Text } from '@react-navigation/elements';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import QueryProduct from '../components/QueryProduct';

export function ProductSearch() {
  return (
    <View style={styles.container}>
      <QueryProduct/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

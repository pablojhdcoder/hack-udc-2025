import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import search from './assets/search.png';
import pic from './assets/pic.png';
import { Home } from './screens/Home';
import { ProductSearch } from './screens/ProductSearch';
import { Settings } from './screens/Settings';
import { Updates } from './screens/Updates';
import { NotFound } from './screens/NotFound';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Visual Search',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={pic}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    ProductSearch: {
      screen: ProductSearch,
      options: {
        title: 'Search Product',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={search}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  navigator: {
    screenOptions:{
      headerTitleStyle: {
        fontFamily: 'BoldF',
      },
    },
  },
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Home: {
      screen: Home,
      options: ({ navigation }) => ({
        title: 'Home',
        headerRight: () => (
          <HeaderButton onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontFamily: 'BoldF' }}>Settings</Text>
          </HeaderButton>
        ),
      }),
    },
    ProductSearch: {
      screen: ProductSearch,
      options: {
        title: 'Search'
      },
      linking: {
        path: 'ProductSearch',
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: 'modal',
        headerRight: () => (
          <HeaderButton onPress={() => navigation.goBack}>
            <Text style={{ fontFamily: 'BoldF' }}>Back</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

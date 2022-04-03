/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome} from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Text } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PostScreen from '../screens/PostScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailScreen from '../screens/DetailScreen';
import Login from '../screens/login';
import Signup from '../screens/signup';
import Signup2 from '../screens/signup2';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import SettingsScreen from "../screens/SettingsScreen";
import AdoptPrefsScreen from "../screens/AdoptPrefsScreen";

// import {Colors} from './../components/LogStyles';
const {primary, tertiary} = Colors;

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {

  // if (LOGGED_IN){
  //   return 
  // }
  return (

    // <Stack.Navigator>
    //   <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
    //   <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    //   <Stack.Group screenOptions={{ presentation: 'modal' }}>
    //     <Stack.Screen name="Modal" component={ModalScreen} />
    //   </Stack.Group>
    //   <Stack.Screen name="Detail" component={DetailScreen} />

    
    //  </Stack.Navigator>

    <Stack.Navigator 
      initialRouteName="Login">
        <Stack.Group
          screenOptions={{
            //headerStyle: {backgroundColor:'transparent'},
            //headerTintColor: tertiary,
            //headerTransparent: true,
            //headerTitle: '',
            headerShown: false 
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Signup2" component={Signup2} />
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ }} />
        </Stack.Group>
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name='Settings' component={SettingsScreen} options={{ }} />
        <Stack.Screen name='AdoptPrefs' component={AdoptPrefsScreen} options={{ headerTitle: 'Adoption Preferences' }} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerRight: () => SettingsButton(navigation, Colors[colorScheme].text),
      })}>
      <BottomTab.Screen
        name="TabOne"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={PostScreen}
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFive"
        component={ProfileScreen}
        options={({ navigation }: RootTabScreenProps<'TabFive'>) => ({
          //tabBarLabel: 'My',
          title: 'Me',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function SettingsButton(navigation: NativeStackScreenProps<RootStackParamList>['navigation'], color: string) {
  return (
    <Pressable
    onPress={() => navigation.navigate('Settings')}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
    })}>
    <FontAwesome
      name="gear"
      size={25}
      color={color}
      style={{ marginRight: 15 }}
    />
  </Pressable> 
  )
}
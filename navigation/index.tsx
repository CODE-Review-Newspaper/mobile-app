/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import dayjs from "dayjs"
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import { useState } from "react"
import { maybeCompleteAuthSession } from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LoginScreen from '../screens/LoginScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import CalendarContext from '../contexts/calendar.context';
import userLoginController from "../controller/userLogin.controller";
import bookRoomsController from "../controller/booking.controller";
import allRoomsController, { Room } from "../controller/allRooms.controller";
import UserContext from "../contexts/user.context";

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

maybeCompleteAuthSession()

function RootNavigator() {

  const [user, signIn, isSignedIn, _, signOut] = userLoginController()
  const [__, createNewEvent] = bookRoomsController()
  const [getBusyTimeOfRooms] = allRoomsController()

  const userContextValue = {
    user,
    isSignedIn,
    signIn,
    signOut,
  }

  // const [authState, setAuthState] = useState<AuthSession.TokenResponse | null>(null)

  // const [user, setUser] = React.useState<User | null>(null)
  // const [calendar, setCalendar] = React.useState<any>(null)

  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
  //   iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
  //   androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",
  //   scopes: ["https://www.googleapis.com/auth/calendar"]
  // })
  // const signIn = () => promptAsync()

  // async function ensureAuth() {

  //   if (authState?.shouldRefresh()) {

  //     setAuthState(await authState.refreshAsync({
  //       clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
  //     }, Google.discovery))
  //   }
  // }

  // React.useEffect(() => {
  //   if (response?.type === "success") {
  //     if (response.authentication?.accessToken !== authState?.accessToken) {
  //       setAuthState(response.authentication)
  //     } else {
  //       if (authState?.accessToken != null) fetchUserInfo()
  //     }
  //   }
  // }, [response, authState?.accessToken])

  // async function fetchUserInfo() {
  //   await ensureAuth()

  //   const meRes = await fetch("https://www.googleapis.com/userinfo/v2/me", {
  //     headers: {
  //       Authorization: `Bearer ${authState?.accessToken}`
  //     }
  //   }).catch((error) => {
  //     console.log(authState?.accessToken)
  //     console.log(error)
  //   })

  //   const calendarRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
  //     headers: {
  //       Authorization: `Bearer ${authState?.accessToken}`
  //     }
  //   }).catch((error) => {
  //     console.log(authState?.accessToken)
  //     console.log(error)
  //   })
  //   const userInfo: User = await meRes!.json();
  //   const calendarInfo = await calendarRes!.json()

  //   // console.log("user:", JSON.stringify(userInfo, null, 2))
  //   // console.log("calendar:", JSON.stringify(calendarInfo, null, 2))

  //   setUser(userInfo)
  //   setCalendar(calendarInfo)
  // }

  // const isAuthenticated = user != null

  const roundDownToNearestQuarterHour = (date: dayjs.Dayjs) => {

    const roundedMinutes = Math.floor(date.get("minutes") / 15) * 15;

    return date.set("minutes", roundedMinutes)
  }

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(roundDownToNearestQuarterHour(dayjs()))
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(startDate)
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(selectedDate.add(6, "hours"))

  const [busyTimes, setBusyTimes] = useState<any>({})

  React.useEffect(() => {

    (async () => {

      const res = await getBusyTimeOfRooms()

      setBusyTimes(res)
    })()
  }, [])

  return (
    <UserContext.Provider value={userContextValue}>
      <CalendarContext.Provider value={{
        selectedRoom,
        setSelectedRoom,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedDate,
        setSelectedDate,
        roomSchedules: busyTimes,
        createEvent: createNewEvent,
      }}>
        <Stack.Navigator>

          {isSignedIn ?
            <>
              <Stack.Screen name="Root" component={BottomTabNavigator}
                options={{ headerShown: false }}
              // options={{
              //   title: 'CODE Review',
              //   headerStyle: {
              //     backgroundColor: '#222',
              //   },
              //   headerTintColor: '#fff',
              //   headerTitleStyle: {
              //     fontWeight: 'bold',
              //   },
              // }}
              />
              <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Modal" component={ModalScreen} options={{
                  title: "Book room",
                  headerShown: false,
                }} />
              </Stack.Group>
            </>
            : <Stack.Screen name="Root" component={LoginScreen}
              options={{ headerShown: false }} />}


        </Stack.Navigator >
      </CalendarContext.Provider>
    </UserContext.Provider>
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
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#444",
        },
      }}
      sceneContainerStyle={{ backgroundColor: "#222" }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Floorplan',
          tabBarActiveTintColor: "#FF6961",
          // tabBarInactiveTintColor: "#efefef",
          // tabBarActiveBackgroundColor: "blue",
          // tabBarInActiveBackgroundColor: "green",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      {/* <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          headerShown: false,
          title: 'Calendar',
          tabBarActiveTintColor: "#FF6961",
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => { }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        }}
      /> */}
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarActiveTintColor: "#FF6961",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => { }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        }}
      />
    </BottomTab.Navigator >
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

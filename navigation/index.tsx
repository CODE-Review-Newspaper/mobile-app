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

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LoginScreen from '../screens/LoginScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import CalendarContext, { CalendarContextType } from '../contexts/calendar.context';
import userLoginController from "../controller/userLogin.controller";
import bookRoomsController from "../controller/booking.controller";
import allRoomsController, { Room } from "../controller/allRooms.controller";
import UserContext, { UserContextType } from "../contexts/user.context";
import LoadingScreen from "../screens/LoadingScreen";

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

  const [roomScheduleState, setRoomScheduleState] = useState<{ isLoading: boolean, hasData: boolean, hasError: boolean }>({ isLoading: true, hasData: false, hasError: false })

  const { user, isSignedIn, isLoadingAuthState, signIn, signOut } = userLoginController()
  const { createEvent } = bookRoomsController()
  const { getBusyTimeOfRooms } = allRoomsController()

  const roundDownToNearestQuarterHour = (date: dayjs.Dayjs) => {

    const roundedMinutes = Math.floor(date.get("minutes") / 15) * 15;

    return date.set("minutes", roundedMinutes)
  }

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(roundDownToNearestQuarterHour(dayjs()))
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(startDate)
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(selectedDate.add(6, "hours"))
  const [roomSchedules, setRoomSchedules] = useState<any>({})

  async function loadRoomSchedules() {

    setRoomScheduleState(prev => ({
      ...prev,
      isLoading: true,
    }))

    const [scheduleError, scheduleData] = await getBusyTimeOfRooms()

    if (scheduleError != null) {

      setRoomScheduleState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
      }))
      return
    }
    setRoomScheduleState(prev => ({
      ...prev,
      isLoading: false,
      hasError: false,
      hasData: true,
    }))
    setRoomSchedules(scheduleData)
  }

  React.useEffect(() => {

    loadRoomSchedules()
  }, [isLoadingAuthState, isSignedIn])

  const userContextValue: UserContextType = {
    user,
    isSignedIn,
    signIn,
    signOut,
  }
  const calendarContextValue: CalendarContextType = {
    selectedRoom,
    setSelectedRoom,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDate,
    setSelectedDate,
    roomSchedules,
    createEvent,
    loadRoomSchedules,
    ...roomScheduleState,
  }

  return (
    <UserContext.Provider value={userContextValue}>
      <CalendarContext.Provider value={calendarContextValue}>
        <Stack.Navigator>
          {(() => {

            if (isLoadingAuthState) return <Stack.Screen
              name="Root"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />

            if (!isSignedIn) return <Stack.Screen
              name="Root"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            return <>
              <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NotFound"
                component={NotFoundScreen}
                options={{ title: 'Oops!' }}
              />
              <Stack.Group
                screenOptions={{ presentation: 'modal' }}
              >
                <Stack.Screen
                  name="Modal"
                  component={ModalScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
            </>
          })()}
          {/* {isSignedIn ?
            <>
              <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NotFound"
                component={NotFoundScreen}
                options={{ title: 'Oops!' }}
              />
              <Stack.Group
                screenOptions={{ presentation: 'modal' }}
              >
                <Stack.Screen
                  name="Modal"
                  component={ModalScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
            </>
            : <Stack.Screen
              name="Root"
              component={LoginScreen}
              options={{ headerShown: false }}
            />} */}
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

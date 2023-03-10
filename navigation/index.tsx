/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { ComponentProps, useEffect } from 'react';
import { useState } from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { useInterval } from 'usehooks-ts';

import Colors from '../constants/Colors';
import CalendarContext, {
  CalendarContextType,
} from '../contexts/calendar.context';
import PreferencesContext, {
  PreferencesContextType,
} from '../contexts/preferences.context';
import UserContext, { UserContextType } from '../contexts/user.context';
import allRoomsController from '../controller/allRooms.controller';
import bookRoomsController from '../controller/booking.controller';
import userLoginController from '../controller/userLogin.controller';
import {
  DEFAULT_MEETING_DURATION_MINS,
  MAX_TIMEPICKER_RANGE_DAYS,
  ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_DEFAULT,
  ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_OFFLINE,
} from '../data/time.data';
import { DEFAULT_TIMEPICKER_MODE } from '../data/views.data';
import useColorScheme from '../hooks/useColorScheme';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import RoomListScreen from '../screens/RoomListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignedOutFloorplanScreen from '../screens/SignedOutFloorplanScreen';
import TabOneScreen from '../screens/TabOneScreen';
import UserPreferences from '../services/UserPreferences.service';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

maybeCompleteAuthSession();

function RootNavigator() {
  const [roomScheduleState, setRoomScheduleState] = useState<{
    isLoading: boolean;
    hasData: boolean;
    hasError: boolean;
  }>({ isLoading: true, hasData: false, hasError: false });

  const [timePickerMode, setTimePickerMode] = useState<any>(
    DEFAULT_TIMEPICKER_MODE
  );

  const {
    user,
    isSignedIn,
    isLoadingAuthState,
    signIn,
    signOut,
    fetchUserEvents,
  } = userLoginController();
  const { createEvent } = bookRoomsController();
  const { getBusyTimeOfRooms } = allRoomsController();

  const startOfQuarterHour = (date: dayjs.Dayjs) => {
    const roundedMinutes = Math.floor(date.get('minutes') / 15) * 15;

    return date.set('minutes', roundedMinutes);
  };
  function getStartDate(from = dayjs()) {
    return from.startOf('day').add(timePickerMode.startHours, 'hours');
  }
  function getSelectedDate() {
    return startOfQuarterHour(dayjs());
  }
  function getEndDate(from = dayjs()) {
    return from.add(DEFAULT_MEETING_DURATION_MINS, 'minutes');
  }

  function goToPrevDay() {
    setStartDate((prev) => prev.subtract(1, 'day'));
    setEndDate((prev) => prev.subtract(1, 'day'));
    setSelectedDate((prev) => prev.subtract(1, 'day'));
  }
  function goToNextDay() {
    setStartDate((prev) => prev.add(1, 'day'));
    setEndDate((prev) => prev.add(1, 'day'));
    setSelectedDate((prev) => prev.add(1, 'day'));
  }
  function goToToday() {
    setStartDate(getStartDate());

    const newSelectedDate = getSelectedDate();

    setSelectedDate(newSelectedDate);
    setEndDate(newSelectedDate);
  }

  const [selectedRoom, setSelectedRoom] =
    useState<CalendarContextType['selectedRoom']>(null);
  const [startDate, setStartDate] = useState<CalendarContextType['startDate']>(
    getStartDate()
  );
  const [selectedDate, setSelectedDate] = useState<
    CalendarContextType['selectedDate']
  >(getSelectedDate());
  const [endDate, setEndDate] = useState<CalendarContextType['endDate']>(
    getEndDate(selectedDate)
  );
  const [roomSchedules, setRoomSchedules] = useState<
    CalendarContextType['roomSchedules']
  >({});

  const [userSchedule, setUserSchedule] = useState<
    CalendarContextType['userSchedule']
  >([]);

  const daysInTheFuture = startDate.diff(dayjs().startOf('day'), 'days');

  const canGoToPrevDay = daysInTheFuture > 0;
  const canGoToNextDay = daysInTheFuture < MAX_TIMEPICKER_RANGE_DAYS;

  async function loadUserSchedule() {
    const [scheduleError, scheduleData] = await fetchUserEvents();

    if (scheduleError != null) {
      console.error('error loading user schedule:', scheduleError);

      return;
    }
    setUserSchedule(scheduleData.items);

    console.info('loaded user schedule');
  }

  async function loadRoomSchedules() {
    setRoomScheduleState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const [scheduleError, scheduleData] = await getBusyTimeOfRooms();

    if (scheduleError != null) {
      console.error('error loading room schedules:', scheduleError);

      setRoomScheduleState((prev) => ({
        ...prev,
        isLoading: false,
        hasError: true,
      }));
      return;
    }
    setRoomScheduleState((prev) => ({
      ...prev,
      isLoading: false,
      hasError: false,
      hasData: true,
    }));
    setRoomSchedules(scheduleData);

    console.info('loaded room schedules');
  }

  useEffect(() => {
    if (isSignedIn && !isLoadingAuthState) {
      loadRoomSchedules();
      loadUserSchedule();
    }
  }, [isSignedIn, isLoadingAuthState]);

  useInterval(
    () => {
      if (isSignedIn && !isLoadingAuthState) {
        loadUserSchedule();
        loadRoomSchedules();
      }

      // const newStartDate = getStartDate();

      // setStartDate(newStartDate);

      // we DON'T want to set endDate here because that would mess up
      // the event creation screen

      // if (selectedDate.isBefore(newStartDate)) setSelectedDate(newStartDate);
    },
    roomScheduleState.hasError
      ? ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_OFFLINE * 1000
      : ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_DEFAULT * 1000
  );

  useEffect(() => {
    const newStartDate = getStartDate(startDate);

    setStartDate(newStartDate);

    if (selectedDate.diff(newStartDate, 'hours') > timePickerMode.rangeHours) {
      setSelectedDate(newStartDate.add(timePickerMode.rangeHours, 'hours'));
    }
    if (selectedDate.diff(newStartDate, 'hours') < 0) {
      setSelectedDate(newStartDate);
    }
  }, [timePickerMode]);

  const preferencesValue: PreferencesContextType = {
    timePickerMode,
    setTimePickerMode: (value: any) => {
      UserPreferences.setTimePickerInterval(value).then(setTimePickerMode);
    },
  };
  useEffect(() => {
    UserPreferences.getTimePickerInterval().then(setTimePickerMode);
  }, []);

  const userContextValue: UserContextType = {
    user,
    isSignedIn,
    signIn,
    signOut,
    about: {
      isCodeMember: user?.hd === 'code.berlin',
    },
  };
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
    userSchedule,
    loadUserSchedule,
    goToPrevDay,
    goToNextDay,
    goToToday,
    canGoToPrevDay,
    canGoToNextDay,
    ...roomScheduleState,
  };

  return (
    <PreferencesContext.Provider value={preferencesValue}>
      <UserContext.Provider value={userContextValue}>
        <CalendarContext.Provider value={calendarContextValue}>
          <Stack.Navigator>
            {(() => {
              if (isLoadingAuthState)
                return (
                  <Stack.Screen
                    name="Root"
                    component={LoadingScreen}
                    options={{ headerShown: false }}
                  />
                );

              // if (!isSignedIn)
              //   return (
              //     <Stack.Screen
              //       name="Root"
              //       component={LoginScreen}
              //       options={{ headerShown: false }}
              //     />
              //   );

              if (!isSignedIn) {
                return (
                  <Stack.Screen
                    name="Root"
                    component={SignedOutFloorplanScreen}
                    options={{ headerShown: false }}
                  />
                );
              }

              return (
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
                  <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen
                      name="Modal"
                      component={ModalScreen}
                      options={{ headerShown: false }}
                    />
                  </Stack.Group>
                </>
              );
            })()}
          </Stack.Navigator>
        </CalendarContext.Provider>
      </UserContext.Provider>
    </PreferencesContext.Provider>
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
      initialRouteName="TabTwo"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#444',
        },
      }}
      sceneContainerStyle={{ backgroundColor: '#222' }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Floorplan',
          tabBarActiveTintColor: '#FF6961',
          // tabBarInactiveTintColor: "#efefef",
          // tabBarActiveBackgroundColor: "blue",
          // tabBarInActiveBackgroundColor: "green",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-marker" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
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
      <BottomTab.Screen
        name="TabTwo"
        component={RoomListScreen}
        options={{
          headerShown: false,
          title: 'Rooms',
          tabBarActiveTintColor: '#FF6961',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
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
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarActiveTintColor: '#FF6961',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
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
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

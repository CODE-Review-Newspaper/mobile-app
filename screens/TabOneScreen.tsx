import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ErrorTriangle from '../assets/images/errorTriangle.svg';
import Floorplan from '../assets/images/floorplan/base.svg';
import GoogleIcon from '../assets/images/googleIcon.svg';
import Rooms from '../components/Rooms';
import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';
import UserContext from '../contexts/user.context';
import { RoomBookableData, RoomCategoryData, rooms } from '../data/rooms.data';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const { about, signIn } = useContext(UserContext);

  const {
    setSelectedRoom,
    startDate,
    selectedDate,
    setSelectedDate,
    roomSchedules,
    isLoading,
    hasData,
    hasError,
  } = useContext(CalendarContext);

  const state = (() => {
    if (hasData) return 'SUCCESS';
    if (hasError) return 'ERROR';
    if (isLoading) return 'LOADING';

    return 'ERROR';
  })();

  const DisplayMode = {
    MAP_MODE: {
      id: 'MAP_MODE',
      displayName: 'Map mode',
      next: 'BOOKING_MODE' as const,
    },
    BOOKING_MODE: {
      id: 'BOOKING_MODE',
      displayName: 'Booking mode',
      next: 'MAP_MODE' as const,
    },
  };
  const [displayMode, setDisplayMode] = useState<
    (typeof DisplayMode)[keyof typeof DisplayMode]
  >(about.isCodeMember ? DisplayMode.BOOKING_MODE : DisplayMode.MAP_MODE);

  function switchDisplayMode() {
    setDisplayMode(DisplayMode[displayMode.next]);
  }

  return (
    <>
      {state === 'LOADING' && (
        <View style={styles.statusTopBar}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 25 }}>
            Loading...
          </Text>
        </View>
      )}
      {state === 'ERROR' && (
        <View style={styles.statusTopBar}>
          <Text style={{ color: '#FF160A', fontWeight: '900', fontSize: 25 }}>
            An error occured.
          </Text>
        </View>
      )}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
        style={{
          ...styles.toolBar,
          opacity: state === 'SUCCESS' && about.isCodeMember ? 1 : 0,
        }}
      >
        <Text style={styles.timeDisplay}>
          {selectedDate.format('MMM D, H:mma')}
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          step={1 / 12 / 4}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="white"
          onValueChange={(numberBetween0and1) =>
            setSelectedDate(startDate.add(numberBetween0and1 * 12, 'hours'))
          }
        />
        <Pressable
          accessibilityLabel="Switch to next display mode"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingBottom: 16,
            backgroundColor: 'transparent',
          }}
          onPress={switchDisplayMode}
        >
          <Text
            style={{ ...styles.timeDisplay, textDecorationLine: 'underline' }}
          >
            {displayMode.displayName}
          </Text>
          <FontAwesome
            name="arrows-v"
            style={{ marginLeft: 5, color: '#ccc', fontSize: 15 }}
          />
        </Pressable>
      </LinearGradient>

      <ReactNativeZoomableView
        zoomEnabled={true}
        maxZoom={state === 'SUCCESS' ? 2 : 1}
        minZoom={1}
        zoomStep={0.25}
        initialZoom={1}
        bindToBorders={true}
        style={styles.container}
      >
        <View style={styles.dings}>
          {displayMode.id === 'MAP_MODE' && (
            <View style={styles.legend}>
              {Object.values(RoomCategoryData)
                .filter((i) => i.showInLegend)
                .map((i) => {
                  return (
                    <View
                      key={i.displayName}
                      style={{
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 2,
                      }}
                    >
                      <View
                        style={{
                          ...styles.legendColorCircle,
                          backgroundColor: i.color,
                        }}
                      />
                      <Text style={{ color: 'white', fontWeight: '500' }}>
                        {i.displayName}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}

          <Floorplan
            width="100%"
            height="100%"
            fill="white"
            style={styles.floorPlanComponent}
          />

          {state !== 'SUCCESS' && (
            <Rooms.Heaven.Component
              width="100%"
              height="100%"
              fill="white"
              style={styles.floorPlanComponent}
            />
          )}

          {state === 'SUCCESS' &&
            Object.values(Rooms).map((i) => {
              const scheduleInfo = roomSchedules[i.name];

              const isUnavailable =
                scheduleInfo?.busyTimes?.some((i) => {
                  const isUnavailable =
                    selectedDate.isAfter(dayjs(i.start)) &&
                    selectedDate.isBefore(dayjs(i.end));

                  return isUnavailable;
                }) ?? true;

              const isAvailable = !isUnavailable;

              const color = (() => {
                const roomCategory = RoomCategoryData[rooms[i.name].category];

                if (displayMode.id === 'MAP_MODE') return roomCategory?.color;

                if (displayMode.id === 'BOOKING_MODE') {
                  if (scheduleInfo?.bookable === 'BOOKABLE' && isAvailable)
                    return RoomBookableData.BOOKABLE.color;

                  if (scheduleInfo?.bookable === 'BOOKABLE' && isUnavailable)
                    return RoomBookableData.UNAVAILABLE.color;

                  return RoomCategoryData.DEFAULT.color;
                }
                // this should never happen so we make it black to stand out
                return 'black';
              })();

              return (
                <i.Component
                  key={i.name}
                  width="100%"
                  height="100%"
                  style={styles.floorPlanComponent}
                  fill={color}
                  onPress={() => {
                    if (!(scheduleInfo?.bookable === 'BOOKABLE' && isAvailable))
                      return;

                    setSelectedRoom(scheduleInfo);

                    navigation.navigate('Modal');
                  }}
                />
              );
            })}
        </View>
        {state === 'ERROR' && (
          <View style={styles.staticOverlay}>
            <ErrorTriangle fill="#FF160A" width="45%" height="45%" />
          </View>
        )}
      </ReactNativeZoomableView>
    </>
  );
}

const styles = StyleSheet.create({
  staticOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  toolBar: {
    width: '100%',
    padding: 16,
    paddingTop: 32,
    alignItems: 'center',
    zIndex: 3,
    elevation: 3,
  },
  timeDisplay: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 48,
    paddingHorizontal: 32,

    backgroundColor: '#FF6961',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],

    backgroundColor: '#fe746a',
  },
  buttonText: {
    paddingLeft: 10,

    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
  dings: {
    position: 'relative',
    width: '120%',
    height: '80%',
    transform: [{ rotate: '-90deg' }],
    backgroundColor: 'transparent',
  },
  legend: {
    position: 'absolute',

    backgroundColor: 'transparent',

    transform: [{ rotate: '90deg' }],

    left: -4,
    top: 6,
  },
  legendColorCircle: {
    width: 16,
    height: 16,
    marginRight: 8,

    borderRadius: 8,
  },
  sache: {
    color: '#222',
  },
  logo: {
    height: '10rem',
  },
  header: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  floorPlanComponent: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',

    margin: 0,
    padding: 0,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  statusTopBar: {
    position: 'absolute',
    width: '100%',
    height: 150,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// import {
//     Animated,
//     useSharedValue,
//     useAnimatedProps,
//     withTiming
// } from 'react-native-reanimated';
// import Svg, { Path } from 'react-native-svg';

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// export default function App() {
//     const radius = useSharedValue(50);

//     const animatedProps = useAnimatedProps(() => {
//         // draw a circle
//         const path = `
//     M 100, 100
//     m -${radius}, 0
//     a ${radius},${radius} 0 1,0 ${radius * 2},0
//     a ${radius},${radius} 0 1,0 ${-radius * 2},0
//     `;
//         return {
//             d: path
//         };
//     });

//     return null

//     // attach animated props to an SVG path using animatedProps
//     // return <Svg><AnimatedPath animatedProps={animatedProps} fill="black" onPress={() => radius.value = withTiming(Math.random() * 180)} /></Svg>
// }

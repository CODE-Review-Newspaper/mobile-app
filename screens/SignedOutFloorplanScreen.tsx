import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Layer from '../assets/icons/layers/layer.svg';
import TopLayer from '../assets/icons/layers/topLayer.svg';
import GoogleIcon from '../assets/images/googleIcon.svg';
import FifthFloorAssets from '../components/fifthFloor.assetMap';
import Floorplan from '../components/Floorplan';
import FourthFloorAssets from '../components/fourthFloor.assetMap';
import overlayElementsStyles from '../components/overlayUI/overlayElements.styles';
import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';
import UserContext from '../contexts/user.context';
import { rooms } from '../data/rooms.data';
import { MAX_TIMEPICKER_RANGE_HOURS } from '../data/time.data';

export default function SignedOutFloorplanScreen() {
  const { about, signIn } = useContext(UserContext);

  const {
    startDate,
    selectedDate,
    setSelectedDate,
    roomSchedules,
    isLoading,
    hasData,
    hasError,
  } = useContext(CalendarContext);

  const DisplayMode = {
    MAP_MODE: {
      id: 'MAP_MODE' as const,
      displayName: 'Map mode',
      next: 'BOOKING_MODE' as const,
    },
    BOOKING_MODE: {
      id: 'BOOKING_MODE' as const,
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
  const selectableFloors = [rooms.FourthFloor, rooms.FifthFloor];

  const [activeFloorIdx, setActiveFloorIdx] = useState<number>(0);

  const floor = selectableFloors[activeFloorIdx];

  const Assets =
    floor.id === 'FourthFloor' ? FourthFloorAssets : FifthFloorAssets;

  function goToNextFloor() {
    setActiveFloorIdx((prev) =>
      prev < selectableFloors.length - 1 ? prev + 1 : 0
    );
  }
  const activeFloorColor = 'white';
  const inactiveFloorColor = '#7c7c7d';

  return (
    <>
      <View style={{ width: '100%', height: '100%', backgroundColor: '#222' }}>
        {!about.isCodeMember && (
          <View
            style={{
              ...styles.statusTopBar,
              position: 'absolute',
              zIndex: 4,
              elevation: 4,
              paddingTop: 16,
            }}
          >
            <Pressable
              onPress={signIn}
              style={({ pressed }) =>
                pressed ? [styles.button, styles.buttonPressed] : styles.button
              }
              accessibilityLabel="Sign in with @code.berlin"
            >
              <GoogleIcon
                width="16"
                height="16"
                fill="white"
                style={{ marginBottom: 1 }}
              />
              <Text style={styles.buttonText}>
                {Dimensions.get('window').width >= 430
                  ? 'Sign in with @code.berlin'
                  : 'Sign in with Google'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityHint="Go to next floor"
              style={[
                overlayElementsStyles.bigOverlaySquare,
                { position: 'absolute', right: 16, top: 16 },
              ]}
              onPress={goToNextFloor}
            >
              <TopLayer
                fill={
                  floor.id === 'FifthFloor'
                    ? activeFloorColor
                    : inactiveFloorColor
                }
                width="20"
                height="20"
                style={{
                  position: 'absolute',
                  top: 10,
                }}
              />
              <Layer
                fill={
                  floor.id === 'FourthFloor'
                    ? activeFloorColor
                    : inactiveFloorColor
                }
                width="20"
                height="20"
                style={{
                  position: 'absolute',
                  top: 10 + 2 + 6.24,
                }}
              />
            </Pressable>
          </View>
        )}
        <View
          style={{
            borderTopWidth: 97,
            borderColor: '#222',

            width: '100%',
            height: 16 * 6,

            zIndex: 3,
            elevation: 3,
          }}
        >
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
            style={{
              ...styles.toolBar,
              opacity: 0,
            }}
          >
            <Text style={styles.timeDisplay}>
              {selectedDate.format('MMM D, H:mma')}
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              step={1 / MAX_TIMEPICKER_RANGE_HOURS / 4}
              minimumTrackTintColor="#ff6961"
              maximumTrackTintColor="white"
              onValueChange={(numberBetween0and1) =>
                setSelectedDate(
                  startDate.add(
                    numberBetween0and1 * MAX_TIMEPICKER_RANGE_HOURS,
                    'hours'
                  )
                )
              }
              value={
                selectedDate.diff(startDate, 'hours') /
                MAX_TIMEPICKER_RANGE_HOURS
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
                style={{
                  ...styles.timeDisplay,
                  textDecorationLine: 'underline',
                }}
              >
                {displayMode.displayName}
              </Text>
              <FontAwesome
                name="arrows-v"
                style={{ marginLeft: 5, color: '#ccc', fontSize: 15 }}
              />
            </Pressable>
          </LinearGradient>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',

            width: '100%',

            backgroundColor: 'transparent',
          }}
        >
          <Floorplan
            displayMode={DisplayMode.MAP_MODE}
            isZoomEnabled={true}
            hasData={hasData}
            hasError={hasError}
            isLoading={isLoading}
            selectedDate={selectedDate}
            roomSchedules={roomSchedules}
            userSchedule={[]}
            handleRoomClick={() => null}
            Assets={Assets}
          />
        </View>
      </View>
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

    // width: '100%',
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 16,

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
    top: 30,
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
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    paddingHorizontal: 16,

    top: 43,

    backgroundColor: 'transparent',
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

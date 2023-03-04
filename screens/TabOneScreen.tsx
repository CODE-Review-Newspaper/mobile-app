import dayjs from 'dayjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ArrowUpArrowDown from '../assets/icons/arrowUpArrowDown.svg';
import Layer from '../assets/icons/layers/layer.svg';
import TopLayer from '../assets/icons/layers/topLayer.svg';
import FifthFloorAssets from '../components/fifthFloor.assetMap';
import Floorplan from '../components/Floorplan';
import FourthFloorAssets from '../components/fourthFloor.assetMap';
import overlayElementsStyles from '../components/overlayUI/overlayElements.styles';
import { Text, View } from '../components/Themed';
import TimePicker from '../components/TimePicker';
import CalendarContext from '../contexts/calendar.context';
import PreferencesContext from '../contexts/preferences.context';
import UserContext from '../contexts/user.context';
import { RoomEntity, rooms } from '../data/rooms.data';
import {
  getTimepickerTitle,
  MAX_TIMEPICKER_RANGE_HOURS,
} from '../data/time.data';
import {
  DEFAULT_SIGNED_IN_MAP_MODE,
  DEFAULT_SIGNED_OUT_MAP_MODE,
  MapMode,
} from '../data/views.data';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const { about } = useContext(UserContext);

  const {
    setSelectedRoom,
    startDate,
    selectedDate,
    setSelectedDate,
    roomSchedules,
    isLoading,
    hasData,
    hasError,
    goToPrevDay,
    goToNextDay,
    canGoToPrevDay,
    canGoToNextDay,
    userSchedule,
    setStartDate,
  } = useContext(CalendarContext);

  const state = (() => {
    if (hasData) return 'SUCCESS';
    if (hasError) return 'ERROR';
    if (isLoading) return 'LOADING';

    return 'ERROR';
  })();

  const [displayMode, setDisplayMode] = useState<
    (typeof MapMode)[keyof typeof MapMode]
  >(
    about.isCodeMember && state !== 'ERROR'
      ? DEFAULT_SIGNED_IN_MAP_MODE
      : DEFAULT_SIGNED_OUT_MAP_MODE
  );

  if (state === 'ERROR' && displayMode.id === 'BOOKING_MODE')
    setDisplayMode(DEFAULT_SIGNED_OUT_MAP_MODE);

  function switchMapMode() {
    setDisplayMode(MapMode[displayMode.next]);
  }

  function handleRoomClick(room: RoomEntity) {
    setSelectedRoom(room);

    navigation.navigate('Modal');
  }
  const selectableFloors = [rooms.FourthFloor, rooms.FifthFloor];

  const [activeFloorIdx, setActiveFloorIdx] = useState<number>(0);

  const startDateRef = useRef<dayjs.Dayjs>(startDate);

  startDateRef.current = startDate;

  const { timePickerMode } = useContext(PreferencesContext);

  const timePickerModeRef = useRef<any>(timePickerMode);

  timePickerModeRef.current = timePickerMode;

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
      {state === 'LOADING' && (
        <View style={styles.statusTopBar}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 25 }}>
            Loading...
          </Text>
        </View>
      )}
      {state === 'ERROR' && (
        <View style={styles.statusTopBar}>
          <Text style={{ color: '#fe746a', fontWeight: '900', fontSize: 25 }}>
            {/* <ErrorTriangle fill="#fe746a" width="1" height="1" style={{ width: 1, height: 1, marginRight: 16 }} /> */}
            Offline
          </Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'transparent']}
        // colors={["#111", "#111"]}
        style={{
          ...styles.toolBar,
          opacity: state === 'SUCCESS' ? 1 : 0,
          flexDirection: 'row',
        }}
      >
        <Pressable
          accessibilityLabel="Switch to next display mode"
          style={overlayElementsStyles.bigOverlayElement}
          onPress={switchMapMode}
        >
          <Text
            style={{
              ...overlayElementsStyles.bigOverlayText,
              textDecorationLine: 'underline',
            }}
          >
            {displayMode.displayName}
            {'   '}
          </Text>
          {/* <FontAwesome
            name="arrows-v"
            style={[overlayElementsStyles.bigOverlayText, { marginLeft: 10 }]}
          /> */}
          <ArrowUpArrowDown fill="white" width="20" height="20" />
        </Pressable>

        <Pressable
          accessibilityHint="Go to next floor"
          style={[
            overlayElementsStyles.bigOverlaySquare,
            { position: 'absolute', right: 16 },
          ]}
          onPress={goToNextFloor}
        >
          <TopLayer
            fill={
              floor.id === 'FifthFloor' ? activeFloorColor : inactiveFloorColor
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
              floor.id === 'FourthFloor' ? activeFloorColor : inactiveFloorColor
            }
            width="20"
            height="20"
            style={{
              position: 'absolute',
              top: 10 + 2 + 6.24,
            }}
          />
        </Pressable>
      </LinearGradient>

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
          displayMode={displayMode}
          isZoomEnabled={state === 'SUCCESS'}
          hasData={hasData}
          hasError={hasError}
          isLoading={isLoading}
          selectedDate={selectedDate}
          roomSchedules={roomSchedules}
          userSchedule={userSchedule}
          handleRoomClick={handleRoomClick}
          Assets={Assets}
        />
      </View>
      <View
        style={{
          borderTopWidth: 97,
          borderColor: '#444',

          width: '100%',
          height: 16 * 6,

          zIndex: 3,
          elevation: 3,
        }}
      >
        <LinearGradient
          // colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
          colors={['#111', '#111']}
          style={{
            position: 'absolute',
            zIndex: 3,
            elevation: 3,

            width: '100%',
            height: 16 * 6,

            left: 0,
            bottom: 0,

            borderTopWidth: 1,
            borderTopColor: '#444',
          }}
        >
          <TimePicker
            style={{
              position: 'absolute',

              width: '100%',

              left: 0,
              bottom: 0,

              backgroundColor: 'transparent',
            }}
            title={getTimepickerTitle(selectedDate)}
            selectedDate={selectedDate}
            value={
              selectedDate.diff(startDate, 'hours') / timePickerMode.rangeHours
            }
            onValueChange={(e) =>
              setSelectedDate(
                startDateRef.current.add(
                  e.value * timePickerModeRef.current.rangeHours,
                  'hours'
                )
              )
            }
            goToPrevDay={goToPrevDay}
            goToNextDay={goToNextDay}
            canGoToPrevDay={canGoToPrevDay}
            canGoToNextDay={canGoToNextDay}
          />
        </LinearGradient>
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
    marginTop: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: 66,

    left: 0,
    top: 0,

    backgroundColor: 'transparent',

    zIndex: 3,
    elevation: 3,
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

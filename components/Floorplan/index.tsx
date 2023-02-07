import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import dayjs from 'dayjs';
import { Pressable, StyleSheet } from 'react-native';

import Layers from '../../assets/icons/layers.svg';
import ErrorTriangle from '../../assets/images/errorTriangle.svg';
import FloorplanBase from '../../assets/images/floorplan/base.svg';
import { Room } from '../../controller/allRooms.controller';
import {
  RoomBookableData,
  RoomCategoryData,
  rooms,
} from '../../data/rooms.data';
import Rooms from '../Rooms';
import { Text, View } from '../Themed';

export const DisplayMode = {
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

export interface FloorplanProps {
  displayMode: (typeof DisplayMode)[keyof typeof DisplayMode];
  isZoomEnabled: boolean;

  hasData: boolean;
  hasError: boolean;
  isLoading: boolean;

  selectedDate: dayjs.Dayjs;

  roomSchedules: Record<string, Room>;
  handleRoomClick: (room: Room) => any;
}

export default function Floorplan({
  displayMode,
  isZoomEnabled,

  hasData,
  hasError,
  isLoading,

  selectedDate,

  roomSchedules,
  handleRoomClick,
}: FloorplanProps) {
  const state = (() => {
    if (hasData) return 'SUCCESS';
    if (hasError) return 'ERROR';
    if (isLoading) return 'LOADING';

    return 'ERROR';
  })();

  function goToNextFloor() { }

  return (
    <>
      <ReactNativeZoomableView
        zoomEnabled={isZoomEnabled}
        maxZoom={2}
        minZoom={1}
        zoomStep={0.25}
        initialZoom={1}
        bindToBorders={true}
        style={styles.container}
      >
        <View style={styles.dings}>
          <FloorplanBase
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
                scheduleInfo?.busyTimes?.some((j) => {
                  const isUnavailable =
                    selectedDate.isAfter(dayjs(j.start)) &&
                    selectedDate.isBefore(dayjs(j.end));

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

                    handleRoomClick(scheduleInfo);
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
        </View>)}
      {/* <Pressable
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',

          width: 64,
          height: 64,

          right: 0,
          bottom: 0,
        }}
        onPress={goToNextFloor}
        accessibilityHint="Go to next floor"
      >
        <Layers fill="white" width="25" height="25" />
      </Pressable> */}
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

    left: 8,
    bottom: 8,
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

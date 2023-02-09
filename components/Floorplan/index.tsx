import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Layers from '../../assets/icons/layers.svg';
import ErrorTriangle from '../../assets/images/errorTriangle.svg';
import {
  RoomBookableData,
  RoomCategoryData,
  RoomEntity,
  rooms,
} from '../../data/rooms.data';
import FifthFloorAssets from '../fifthFloor.assetMap';
import FourthFloorAssets from '../fourthFloor.assetMap';
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

  roomSchedules: Record<string, RoomEntity>;
  handleRoomClick: (room: RoomEntity) => any;
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

  const selectableFloors = [rooms.fourthFloor, rooms.fifthFloor];

  const [activeFloorIdx, setActiveFloorIdx] = useState<number>(0);

  const floor = selectableFloors[activeFloorIdx];

  function goToNextFloor() {
    setActiveFloorIdx((prev) =>
      prev < selectableFloors.length - 1 ? prev + 1 : 0
    );
  }
  const Assets =
    floor.id === 'fourthFloor' ? FourthFloorAssets : FifthFloorAssets;

  if (state === 'ERROR' && displayMode.id === 'BOOKING_MODE') {
    // this should never happen because we redirect from BOOKING_MODE
    // if network issues occur
    return (
      <>
        <View style={styles.staticOverlay}>
          <ErrorTriangle fill="#fe746a" width="45%" height="45%" />
        </View>
      </>
    );
  }

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
        <View style={styles.floorPlanContainer}>
          {Object.values(Assets).map((i) => {
            const selectedRoomSchedule = roomSchedules[i.id];

            const isUnavailable =
              selectedRoomSchedule?.busyTimes?.some((j) => {
                const isUnavailable =
                  selectedDate.isAfter(dayjs(j.start)) &&
                  selectedDate.isBefore(dayjs(j.end));

                return isUnavailable;
              }) ?? true;

            const isAvailable = !isUnavailable;

            const color = (() => {
              if (!(i.id in rooms)) return 'black';

              const roomCategory = RoomCategoryData[rooms[i.id].category];

              if (displayMode.id === 'MAP_MODE')
                return roomCategory.mapModeColor;

              if (displayMode.id === 'BOOKING_MODE') {
                if (
                  selectedRoomSchedule?.bookable === 'BOOKABLE' &&
                  isAvailable
                )
                  return RoomBookableData.BOOKABLE.color;

                if (
                  selectedRoomSchedule?.bookable === 'BOOKABLE' &&
                  isUnavailable
                )
                  return RoomBookableData.UNAVAILABLE.color;

                return roomCategory.bookingModeColor;
              }
              // this should never happen so we make it black to stand out
              return 'black';
            })();

            return (
              <i.Component
                key={i.id}
                width="100%"
                height="100%"
                style={styles.floorPlanComponent}
                fill={color}
                onPress={() => {
                  if (
                    !(
                      selectedRoomSchedule?.bookable === 'BOOKABLE' &&
                      isAvailable
                    )
                  )
                    return;

                  handleRoomClick(selectedRoomSchedule);
                }}
              />
            );
          })}
        </View>
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
                      backgroundColor: i.mapModeColor,
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
      <Pressable
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',

          width: 80,
          height: 80,

          right: 0,
          bottom: 0,
        }}
        onPress={goToNextFloor}
        accessibilityHint="Go to next floor"
      >
        <Text style={{ color: 'white', fontSize: 10, paddingBottom: 6 }}>
          {floor.displayName}
        </Text>
        <Layers fill="white" width="25" height="25" />
      </Pressable>
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
  floorPlanContainer: {
    position: 'relative',

    width: '110%',
    height: '999%',

    left: 135,
    bottom: 150,

    backgroundColor: 'transparent',
  },
  legend: {
    position: 'absolute',

    backgroundColor: 'transparent',

    left: 20,
    bottom: 20,
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

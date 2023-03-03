import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import ErrorTriangle from '../../assets/images/errorTriangle.svg';
import {
  RoomBookableData,
  RoomCategoryData,
  RoomEntity,
  rooms,
} from '../../data/rooms.data';
import { GoogleEventResponse } from '../../googleClient/google.types';
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
  HIGHLIGHT_MODE: {
    id: 'HIGHLIGHT_MODE' as const,
    displayName: 'Highlight mode',
    next: null,
  },
};

export interface FloorplanProps {
  highlightData?: Record<string, { isHighlighted: boolean }>;

  displayMode: (typeof DisplayMode)[keyof typeof DisplayMode];
  isZoomEnabled: boolean;

  hasData: boolean;
  hasError: boolean;
  isLoading: boolean;

  selectedDate: dayjs.Dayjs;

  roomSchedules: Record<string, RoomEntity>;
  userSchedule: GoogleEventResponse[];
  handleRoomClick: (room: RoomEntity) => any;

  Assets: Record<
    string,
    { id: keyof typeof rooms; Component: FunctionComponent }
  >;
}

export default function Floorplan({
  highlightData = {},

  displayMode,
  isZoomEnabled,

  hasData,
  hasError,
  isLoading,

  selectedDate,

  roomSchedules,
  userSchedule,
  handleRoomClick,
  Assets,
}: FloorplanProps) {
  const state = (() => {
    if (hasData) return 'SUCCESS';
    if (hasError) return 'ERROR';
    if (isLoading) return 'LOADING';

    return 'ERROR';
  })();

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
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        <ReactNativeZoomableView
          zoomEnabled={isZoomEnabled}
          maxZoom={2}
          minZoom={1}
          zoomStep={0.25}
          initialZoom={1}
          bindToBorders={true}
          style={styles.zoomContainer}
        >
          <View style={styles.floorPlanContainer}>
            <View style={styles.sached}>
              {Object.values(Assets).map((i) => {
                const selectedRoomSchedule = roomSchedules[i.id];

                const isBookedBySelf =
                  userSchedule?.some((j) => {
                    const isSameRoom = j.attendees?.some(
                      (k) => k.email === rooms[i.id]?.email
                    );

                    const isBookedBySelf =
                      selectedDate.isAfter(
                        dayjs(j.start?.dateTime?.slice(0, -6))
                      ) &&
                      selectedDate.isBefore(
                        dayjs(j.end?.dateTime?.slice(0, -6))
                      );

                    return isSameRoom && isBookedBySelf;
                  }) ?? false;

                const isUnavailable =
                  selectedRoomSchedule?.busyTimes?.some((j) => {
                    const isUnavailable =
                      selectedDate.isAfter(dayjs(j.start)) &&
                      selectedDate.isBefore(dayjs(j.end));

                    return isUnavailable;
                  }) ?? true;

                const isAvailable = !isUnavailable;

                const color = (() => {
                  if (!(i.id in rooms)) return 'red';

                  if (rooms[i.id].type === 'ICON') {
                    if (displayMode.id !== 'MAP_MODE') {
                      return 'transparent';
                    }

                    return '#222';
                  }

                  if (rooms[i.id].type === 'LABEL') {
                    const parent = rooms[rooms[i.id].parentId];

                    const sache =
                      RoomCategoryData[parent.category]?.labelBookingModeColor;

                    if (sache != null) {
                      return sache;
                    }

                    if (parent.type === 'FLOOR') {
                      return 'white';
                    }

                    if (displayMode.id === 'HIGHLIGHT_MODE') {
                      return 'transparent';
                    }

                    if (displayMode.id === 'BOOKING_MODE') {
                      return '#222';
                    }

                    if (displayMode.id === 'MAP_MODE') {
                      return '#222';
                    }
                    return 'red';
                  }

                  const roomCategory = RoomCategoryData[rooms[i.id].category];

                  if (displayMode.id === 'HIGHLIGHT_MODE') {
                    if (['FourthFloor', 'FifthFloor'].includes(i.id))
                      return '#efefef';

                    if (highlightData[i.id]?.isHighlighted)
                      return RoomBookableData.BOOKABLE.color;

                    return roomCategory.bookingModeColor;
                  }

                  if (displayMode.id === 'MAP_MODE')
                    return roomCategory.mapModeColor;

                  if (displayMode.id === 'BOOKING_MODE') {
                    if (isBookedBySelf) {
                      return RoomBookableData.BOOKED_BY_SELF.color;
                    }
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
            {displayMode.id === 'BOOKING_MODE' && (
              <View style={styles.legend}>
                {Object.values(RoomBookableData)
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
          </View>
        </ReactNativeZoomableView>
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

    backgroundColor: 'transparent',

    alignItems: 'center',

    width: '100%',
    height: '90%',
  },
  sached: {
    height: '100%',
    aspectRatio: 10 / 32,

    backgroundColor: 'transparent',
  },
  zoomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',

    width: '100%',
    height: '100%',
  },
  legend: {
    position: 'absolute',

    backgroundColor: 'transparent',

    left: 16,
    bottom: 0,
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
    backgroundColor: 'transparent',
  },
  floorPlanComponent: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',

    width: 10,
    height: '100%',
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

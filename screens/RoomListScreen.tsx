import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text, View } from '../components/Themed';
import TimePicker from '../components/TimePicker';
import CalendarContext from '../contexts/calendar.context';
import PreferencesContext from '../contexts/preferences.context';
import { RoomEntity } from '../data/rooms.data';
import { getTimepickerTitle } from '../data/time.data';
import { DEFAULT_ROOM_VIEW, RoomView } from '../data/views.data';
import { RootTabScreenProps } from '../types';

dayjs.extend(relativeTime);

const backgroundColor = '#111';
const cardColor = '#222';
const textColor = 'white';
const borderColor = '#111';

export interface RoomViewEntity {
  room: RoomEntity;
  isAvailable: boolean;
  minutesUntilNextEvent: number;
}
export interface RoomViewFilter {
  id: string;
  displayName: string;

  filter: (room: RoomViewEntity) => boolean;
}
export interface RoomViewType {
  id: string;
  label: JSX.Element;

  filters: RoomViewFilter[];
  sort: (firstRoom: RoomViewEntity, secondRoom: RoomViewEntity) => number;
}

const MinutesUntilNextEventDesc = ({ mins }: { mins: number }) => {
  if (mins >= 60 * 24)
    return <Text style={styles.secondaryText}>Free for over a day</Text>;

  const hours = Math.floor(mins / 60);

  const minutes = mins % 60;

  const hoursStr = hours > 0 ? `${hours} hours` : '';

  const minutesStr = minutes > 0 ? `${minutes} mins` : '';

  const timeStr = hoursStr + ' ' + minutesStr;

  if (mins >= 60)
    return <Text style={styles.secondaryText}>Free for {timeStr}</Text>;

  return (
    <Text style={styles.secondaryText}>
      Free for{'  '}
      <Text
        style={{
          fontWeight: '900',
          color: '#1bd760',
          fontSize: 18,
        }}
      >
        {mins}
      </Text>
      {'  '}minutes
    </Text>
  );
};

export default function RoomListScreen({
  navigation,
}: RootTabScreenProps<'TabTwo'>) {
  const {
    startDate,
    selectedDate,
    setSelectedDate,
    roomSchedules,
    isLoading,
    hasData,
    hasError,
    setSelectedRoom,
    goToPrevDay,
    goToNextDay,
    canGoToPrevDay,
    canGoToNextDay,
    setStartDate,
  } = useContext(CalendarContext);

  const [selectedView, setSelectedView] = useState(DEFAULT_ROOM_VIEW);

  const sachen = selectedView.filters.map((i) => {
    const results = Object.values(roomSchedules)
      .map((room) => {
        const isUnavailable =
          room?.busyTimes?.some((j) => {
            const isUnavailable =
              selectedDate.isAfter(dayjs(j.start)) &&
              selectedDate.isBefore(dayjs(j.end));

            return isUnavailable;
          }) ?? true;

        const isAvailable = !isUnavailable;

        const nextEventsInSelectedRoom = room.busyTimes
          ?.filter((j) => dayjs(j.start).isAfter(selectedDate))
          ?.sort((a, b) => (dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : 0));

        const nextEventInSelectedRoom = nextEventsInSelectedRoom?.[0] ?? null;

        const minutesUntilNextEvent =
          nextEventInSelectedRoom == null
            ? Infinity
            : dayjs(nextEventInSelectedRoom!.start).diff(
                selectedDate,
                'minutes'
              ) + 1;

        return {
          room,
          isAvailable,
          minutesUntilNextEvent,
        };
      })
      .filter(i.filter);

    results.sort(selectedView.sort);

    return [i, results] as const;
  });

  // const results = Object.values(roomSchedules)
  //   .filter(selectedView.filter)
  //   .map((room) => {
  //     const isUnavailable =
  //       room?.busyTimes?.some((j) => {
  //         const isUnavailable =
  //           selectedDate.isAfter(dayjs(j.start)) &&
  //           selectedDate.isBefore(dayjs(j.end));

  //         return isUnavailable;
  //       }) ?? true;

  //     const isAvailable = !isUnavailable;

  //     const nextEventsInSelectedRoom = room.busyTimes
  //       ?.filter((i) => dayjs(i.start).isAfter(selectedDate))
  //       ?.sort((a, b) => (dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : 0));

  //     const nextEventInSelectedRoom = nextEventsInSelectedRoom?.[0] ?? null;

  //     const minutesUntilNextEvent =
  //       nextEventInSelectedRoom == null
  //         ? Infinity
  //         : dayjs(nextEventInSelectedRoom!.start).diff(
  //           selectedDate,
  //           'minutes'
  //         ) + 1;

  //     return {
  //       room,
  //       isAvailable,
  //       minutesUntilNextEvent,
  //     };
  //   })
  //   .filter((i) => i.isAvailable);
  // results.sort((a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent);

  const hasResults =
    sachen.map((i) => i[1]).filter((i) => i.length > 0).length > 0;

  const startDateRef = useRef<dayjs.Dayjs>(startDate);

  startDateRef.current = startDate;

  const { timePickerMode } = useContext(PreferencesContext);

  const timePickerModeRef = useRef<any>(timePickerMode);

  timePickerModeRef.current = timePickerMode;

  return (
    <>
      <View
        style={{
          backgroundColor: backgroundColor,

          paddingHorizontal: 16,
          paddingTop: 43,

          height: 16 * 3 + 43 + 16,

          borderBottomWidth: 1,
          borderBottomColor: '#444',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',

            // borderBottomWidth: 1,
            // borderBottomColor: "#444",
          }}
        >
          {Object.values(RoomView).map((i) => (
            <Pressable
              key={i.id}
              onPress={() => setSelectedView(i)}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',

                  width: '100%',
                  maxWidth: 62,
                  height: 32,

                  borderRadius: 999,
                  backgroundColor: '#444',
                  marginRight: 8,
                },
                i.id === selectedView.id
                  ? {
                      backgroundColor: '#222',

                      borderColor: 'white',
                      borderWidth: 1,
                      transform: [{ scale: 1.03 }],
                    }
                  : {},
              ]}
            >
              {i.label}
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView
        style={{
          flexDirection: 'column',
          paddingHorizontal: 16,

          backgroundColor: backgroundColor,

          height: '100%',
        }}
      >
        <View
          style={{
            marginBottom: 16,

            backgroundColor: 'transparent',
          }}
        >
          {sachen.map(([filter, results]) => (
            <>
              <Text
                key={filter.id + '-text'}
                style={[styles.timeDisplay, { marginLeft: 12 }]}
              >
                {filter.displayName} ({results.length})
              </Text>
              {results.length > 0 && (
                <View
                  key={filter.id + '-results'}
                  style={{
                    flexDirection: 'column',

                    borderRadius: 4,

                    overflow: 'hidden',

                    backgroundColor: cardColor,
                  }}
                >
                  {results.map(({ room, minutesUntilNextEvent }, idx) => {
                    return (
                      <Pressable
                        key={room.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',

                          height: 64,
                          paddingHorizontal: 24,

                          backgroundColor: 'transparent',
                          borderColor: borderColor,
                          borderTopWidth: idx === 0 ? 0 : 1,
                        }}
                        onPress={() => {
                          setSelectedRoom(room);

                          navigation.navigate('Modal');
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'column',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Text
                            style={{
                              color: textColor,
                              fontWeight: '900',
                              fontSize: 16,
                            }}
                          >
                            {room.displayName} ({room.capacity})
                          </Text>
                        </View>
                        <MinutesUntilNextEventDesc
                          mins={minutesUntilNextEvent}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </>
          ))}
          {!hasResults && !(hasError && !hasData) && (
            <Text
              style={{
                backgroundColor: 'transparent',

                marginTop: 22,

                fontSize: 16,

                fontWeight: '900',
              }}
            >
              Found no free rooms.
            </Text>
          )}
          {!hasResults && hasError && !hasData && (
            <Text
              style={{
                backgroundColor: 'transparent',

                marginTop: 22,

                fontSize: 16,

                fontWeight: '900',

                color: '#fe746a',
              }}
            >
              You appear to be offline.
            </Text>
          )}
        </View>
      </ScrollView>

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
  secondaryText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '700',
  },
  timeDisplay: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',

    height: 16 * 3,
    paddingTop: 20,
  },
});

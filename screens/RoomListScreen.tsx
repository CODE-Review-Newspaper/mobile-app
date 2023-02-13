import { FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Sparkles from '../assets/icons/sparkles.svg';
import { Text, View } from '../components/Themed';
import TimePicker from '../components/TimePicker';
import CalendarContext from '../contexts/calendar.context';
import { RoomEntity } from '../data/rooms.data';
import { RootTabScreenProps } from '../types';

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
export interface RoomView {
  id: string;
  label: JSX.Element;

  filters: RoomViewFilter[];
  sort: (firstRoom: RoomViewEntity, secondRoom: RoomViewEntity) => number;
}

const MinutesUntilNextEventDesc = ({ mins }: { mins: number }) => {
  if (mins >= 120)
    return <Text style={{ color: '#222' }}>Free for multiple hours</Text>;

  return (
    <Text style={{ color: '#222' }}>
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
  } = useContext(CalendarContext);

  const RoomFilter: Record<string, RoomViewFilter> = {
    MAX_THREE_PEOPLE: {
      id: 'MAX_THREE_PEOPLE',
      displayName: 'Small rooms',
      filter: (i) =>
        i.room.bookable === 'BOOKABLE' &&
        i.isAvailable &&
        !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
        i.room.capacity <= 3,
    },
    MAX_NINE_PEOPLE: {
      id: 'MAX_NINE_PEOPLE',
      displayName: 'Mid-sized rooms',
      filter: (i) =>
        i.room.bookable === 'BOOKABLE' &&
        i.isAvailable &&
        !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
        i.room.capacity >= 4 &&
        i.room.capacity <= 9,
    },
    TEN_OR_MORE_PEOPLE: {
      id: 'TEN_OR_MORE_PEOPLE',
      displayName: 'Large rooms',
      filter: (i) =>
        i.room.bookable === 'BOOKABLE' &&
        i.isAvailable &&
        !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
        i.room.capacity >= 10,
    },
    ALL: {
      id: 'ALL',
      displayName: 'All rooms',
      filter: (i) =>
        i.room.bookable === 'BOOKABLE' &&
        i.isAvailable &&
        !['STUDIO', 'WORKSHOP'].includes(i.room.category),
    },
    MUSIC_STUDIO: {
      id: 'MUSIC_STUDIO',
      displayName: 'Music studio',
      filter: (i) =>
        i.room.bookable === 'BOOKABLE' &&
        i.isAvailable &&
        ['STUDIO'].includes(i.room.category),
    },
  };
  const RoomView: Record<string, RoomView> = {
    MAX_THREE_PEOPLE: {
      id: 'MAX_THREE_PEOPLE',
      label: (
        <Text style={styles.chipText}>
          {'1-3 '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
      filters: [RoomFilter.MAX_THREE_PEOPLE],
      sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
    },
    MAX_NINE_PEOPLE: {
      id: 'MAX_NINE_PEOPLE',
      label: (
        <Text style={styles.chipText}>
          {'4-9 '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
      filters: [RoomFilter.MAX_NINE_PEOPLE],
      sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
    },
    TEN_OR_MORE_PEOPLE: {
      id: 'TEN_OR_MORE_PEOPLE',
      label: (
        <Text style={styles.chipText}>
          {'10+ '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
      filters: [RoomFilter.TEN_OR_MORE_PEOPLE],
      sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
    },
    ALL: {
      id: 'ALL',
      label: <Text style={styles.chipText}>{'ALL'}</Text>,
      filters: [
        RoomFilter.MAX_THREE_PEOPLE,
        RoomFilter.MAX_NINE_PEOPLE,
        RoomFilter.TEN_OR_MORE_PEOPLE,
      ],
      sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
    },
    SPECIAL_ROOMS: {
      id: 'SPECIAL_ROOMS',
      label: (
        <Text style={styles.chipText}>
          <FontAwesome name="star" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
      filters: [RoomFilter.MUSIC_STUDIO],
      sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
    },
  };

  const [selectedView, setSelectedView] = useState(RoomView.ALL);

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

  return (
    <>
      <ScrollView
        style={{
          flexDirection: 'column',
          paddingHorizontal: 16,

          backgroundColor: '#111',

          height: '100%',

          paddingTop: 43,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            height: 16 * 3,
            marginTop: 16,
            backgroundColor: 'transparent',
          }}
        >
          {Object.values(RoomView).map((i) => (
            <Pressable
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
        <View
          style={{
            marginBottom: 43 + 96, // paddingTop - height of TimePicker

            backgroundColor: 'transparent',
          }}
        >
          {sachen.map(([filter, results]) => (
            <>
              <Text style={[styles.timeDisplay, { marginLeft: 12 }]}>
                {filter.displayName} ({results.length})
              </Text>
              {results.length > 0 && (
                <View
                  style={{
                    flexDirection: 'column',

                    borderRadius: 4,

                    overflow: 'hidden',

                    backgroundColor: 'white',
                  }}
                >
                  {results.map(({ room, minutesUntilNextEvent }) => {
                    return (
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',

                          height: 64,
                          paddingHorizontal: 24,

                          backgroundColor: 'transparent',
                          borderColor: '#ccc',
                          borderTopWidth: 1,
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
                              color: '#222',
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

      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
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
          title={
            selectedDate.format('MMM D, H:mma') +
            (selectedDate.diff(dayjs(), 'minutes') >= 0
              ? ` (in ${selectedDate.diff(dayjs(), 'minutes')} mins)`
              : ` (${Math.abs(
                  selectedDate.diff(dayjs(), 'minutes')
                )} mins ago)`)
          }
          value={selectedDate.diff(startDate, 'hours') / 12}
          onValueChange={(numberBetween0and1) =>
            setSelectedDate(startDate.add(numberBetween0and1 * 12, 'hours'))
          }
          goToPrevDay={() => null}
          goToNextDay={() => null}
          hasGoToPrevDay={false}
          hasGoToNextDay={false}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  timeDisplay: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',

    height: 16 * 3,
    paddingTop: 20,
  },
  chipText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
});

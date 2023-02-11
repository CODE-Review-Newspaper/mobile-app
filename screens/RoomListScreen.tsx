import { FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text, View } from '../components/Themed';
import TimePicker from '../components/TimePicker';
import CalendarContext from '../contexts/calendar.context';
import { RoomEntity } from '../data/rooms.data';
import { RootTabScreenProps } from '../types';

const rangeToStr = (range: { min: number; max: number }) => {
  if (range.max === Infinity) return `${range.min}+`;

  return `${range.min}-${range.max}`;
};
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

  const RoomView = {
    MAX_THREE_PEOPLE: {
      id: 'MAX_THREE_PEOPLE',
      displayName: 'Small rooms',
      filter: (i: RoomEntity) =>
        i.bookable === 'BOOKABLE' &&
        !['STUDIO', 'WORKSHOP'].includes(i.category) &&
        i.capacity <= 3,
      Label: () => (
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          {rangeToStr({ min: 1, max: 3 })}{' '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
    },
    MAX_NINE_PEOPLE: {
      id: 'MAX_NINE_PEOPLE',
      displayName: 'Mid-sized rooms',
      filter: (i: RoomEntity) =>
        i.bookable === 'BOOKABLE' &&
        !['STUDIO', 'WORKSHOP'].includes(i.category) &&
        i.capacity >= 4 &&
        i.capacity <= 9,
      Label: () => (
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          {rangeToStr({ min: 4, max: 9 })}{' '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
    },
    TEN_OR_MORE_PEOPLE: {
      id: 'TEN_OR_MORE_PEOPLE',
      displayName: 'Large rooms',
      filter: (i: RoomEntity) =>
        i.bookable === 'BOOKABLE' &&
        !['STUDIO', 'WORKSHOP'].includes(i.category) &&
        i.capacity >= 10,
      Label: () => (
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          {rangeToStr({ min: 10, max: Infinity })}{' '}
          <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
    },
    ALL: {
      id: 'ALL',
      displayName: 'All rooms',
      filter: (i: RoomEntity) =>
        i.bookable === 'BOOKABLE' &&
        !['STUDIO', 'WORKSHOP'].includes(i.category),
      Label: () => <Text style={{ fontWeight: '900', fontSize: 16 }}>ALL</Text>,
    },
    SPECIAL_ROOMS: {
      id: 'SPECIAL_ROOMS',
      displayName: 'Specialized rooms',
      filter: (i: RoomEntity) =>
        i.bookable === 'BOOKABLE' &&
        ['STUDIO', 'WORKSHOP'].includes(i.category),
      Label: () => (
        <Text style={{ fontWeight: '900', fontSize: 16 }}>
          <FontAwesome name="star" style={{ fontSize: 16, color: 'white' }} />
        </Text>
      ),
    },
  };

  const [selectedView, setSelectedView] = useState(RoomView.ALL);

  const results = Object.values(roomSchedules)
    .filter(selectedView.filter)
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
        ?.filter((i) => dayjs(i.start).isAfter(selectedDate))
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
    .filter((i) => i.isAvailable);
  results.sort((a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent);

  return (
    <>
      <ScrollView
        style={{
          flexDirection: 'column',
          paddingHorizontal: 16,

          backgroundColor: '#111',

          height: '100%',

          paddingTop: 32,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 16,
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
              <i.Label />
            </Pressable>
          ))}
        </View>
        <Text style={[styles.timeDisplay, { marginBottom: 8, marginLeft: 12 }]}>
          {selectedView.displayName} ({results.length})
        </Text>
        {results.length < 1 && !(hasError && !hasData) && (
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
        {results.length < 1 && hasError && !hasData && (
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
        {results.length > 0 && (
          <View
            style={{
              flexDirection: 'column',

              borderRadius: 4,

              overflow: 'hidden',

              backgroundColor: 'white',

              marginBottom: 80,
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
                      style={{ color: '#222', fontWeight: '900', fontSize: 16 }}
                    >
                      {room.displayName} ({room.capacity})
                    </Text>
                  </View>
                  <MinutesUntilNextEventDesc mins={minutesUntilNextEvent} />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
        style={{
          position: 'absolute',
          zIndex: 3,
          elevation: 3,

          width: '100%',
          height: 84,

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
            ` (in ${selectedDate.diff(dayjs(), 'minutes')} mins)`
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

    marginTop: 8,
  },
});

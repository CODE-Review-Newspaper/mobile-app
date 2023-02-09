import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';
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

  const ranges = [
    { min: 1, max: 3 },
    { min: 4, max: 9 },
    { min: 10, max: Infinity },
  ];

  const [selectedRange, setSelectedRange] = useState(ranges[2]);

  const results = Object.values(roomSchedules)
    .filter(
      (i) =>
        i.bookable === 'BOOKABLE' &&
        i.capacity >= selectedRange.min &&
        i.capacity <= selectedRange.max
    )
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
          : dayjs(nextEventInSelectedRoom!.start).diff(selectedDate, 'minutes');

      return {
        room,
        isAvailable,
        minutesUntilNextEvent,
      };
    })
    .filter((i) => i.isAvailable);
  results.sort((a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent);

  return (
    <ScrollView
      style={{
        flexDirection: 'column',
        paddingHorizontal: 16,

        backgroundColor: '#111',

        height: '100%',

        paddingTop: 64,
      }}
    >
      <Slider
        style={{
          width: '100%',
          height: 40,
        }}
        minimumValue={0}
        maximumValue={1}
        step={1 / 12 / 4}
        minimumTrackTintColor="#ff6961"
        maximumTrackTintColor="white"
        onValueChange={(numberBetween0and1) =>
          setSelectedDate(startDate.add(numberBetween0and1 * 12, 'hours'))
        }
      />
      <Text style={[styles.timeDisplay]}>
        {selectedDate.format('MMM D, H:mma')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          marginBottom: 16,
          marginTop: 16,
          backgroundColor: 'transparent',
        }}
      >
        {ranges.map((i) => (
          <Pressable
            onPress={() => setSelectedRange(i)}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

                width: 64,
                height: 32,
                paddingHorizontal: 8,

                borderRadius: 999,
                backgroundColor: '#444',
                marginRight: 8,
              },
              i.min === selectedRange.min
                ? {
                    backgroundColor: '#222',

                    borderColor: 'white',
                    borderWidth: 1,
                    transform: [{ scale: 1.03 }],
                  }
                : {},
            ]}
          >
            <Text style={{ fontWeight: '900', fontSize: 16 }}>
              {rangeToStr(i)}{' '}
              <FontAwesome
                name="user"
                style={{ fontSize: 16, color: 'white' }}
              />
            </Text>
          </Pressable>
        ))}
      </View>
      {results.length < 1 && (
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

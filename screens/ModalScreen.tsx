import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';
import { Room } from '../controller/allRooms.controller';
import { CreateEventResponse } from '../controller/booking.controller';
import { RootTabScreenProps } from '../types';

const getRoomDescription = (room: Room) => {
  if (room.factoryRoomNumber != null)
    return `[${room.factoryRoomNumber}] ${room.displayName}`;

  if (room.displayName != null) return room.displayName;

  return 'Unknown room';
};

export default function ModalScreen({
  navigation,
}: RootTabScreenProps<'Modal'>) {
  const {
    selectedRoom,
    selectedDate,
    endDate,
    setEndDate,
    createEvent,
    loadRoomSchedules,
    roomSchedules,
  } = useContext(CalendarContext);

  const DEFAULT_DURATION_MINS = 60;
  const MIN_DURATION_MINS = 15;
  const MAX_DURATION_MINS = 60 * 6;

  useEffect(() => {
    setEndDate(
      selectedDate.add(
        Math.min(DEFAULT_DURATION_MINS, maxEventDurationMins),
        'minutes'
      )
    );
  }, []);

  const [createdEventData, setCreatedEventData] =
    useState<CreateEventResponse | null>(null);

  const [meetingTitle, setMeetingTitle] = useState(
    'Working session in ' + selectedRoom!.displayName
  );

  const [state, setState] = useState<
    'DEFAULT' | 'ERROR' | 'SUCCESS' | 'LOADING'
  >('DEFAULT');

  async function submit() {
    setState('LOADING');

    const [createEventError, createEventData] = await createEvent(
      {
        start: {
          dateTime: selectedDate.toDate(),
          timeZone: 'Europe/Berlin',
        },
        end: {
          dateTime: endDate.toDate(),
          timeZone: 'Europe/Berlin',
        },
        attendees: [{ email: selectedRoom!.email! }],
        summary: meetingTitle,
      },
      {
        items: [
          {
            id: selectedRoom!.email!,
          },
        ],
        timeMin: selectedDate.toDate(),
        timeMax: endDate.toDate(),
      }
    );
    if (createEventError != null) {
      setState('ERROR');

      return;
    }
    setCreatedEventData(createEventData);

    setState('SUCCESS');

    // wait before updating state because google api won't immediately return the new event
    setTimeout(loadRoomSchedules, 1000);
  }
  const selectedRoomSchedule = roomSchedules[selectedRoom!.id];

  const nextEventsInSelectedRoom = selectedRoomSchedule.busyTimes
    ?.filter((i) => dayjs(i.start).isAfter(selectedDate))
    ?.sort((a, b) => (dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : 0));

  const nextEventInSelectedRoom = nextEventsInSelectedRoom?.[0] ?? null;

  const minutesUntilNextEvent =
    nextEventInSelectedRoom == null
      ? Infinity
      : dayjs(nextEventInSelectedRoom!.start).diff(selectedDate, 'minutes');

  const maxEventDurationMins = Math.min(
    minutesUntilNextEvent,
    MAX_DURATION_MINS
  );

  return (
    <View style={styles.container}>
      {(() => {
        if (state === 'LOADING')
          return (
            <Text style={{ ...styles.titleInput, textDecorationLine: 'none' }}>
              {meetingTitle}
            </Text>
          );

        if (state === 'SUCCESS')
          return (
            <Pressable
              onPress={() => Linking.openURL(createdEventData!.htmlLink)}
              accessibilityHint="Open event link in google calendar"
            >
              <Text
                style={{
                  ...styles.titleInput,
                  color: '#007acc',
                  textDecorationColor: '#007acc',
                }}
              >
                {createdEventData?.summary ?? 'No event text'}
              </Text>
            </Pressable>
          );

        return (
          <TextInput
            defaultValue={'Working session in ' + selectedRoom!.displayName}
            placeholder="Meeting title"
            multiline
            style={styles.titleInput}
            onChangeText={(e) => setMeetingTitle(e)}
          />
        );
      })()}

      <Text style={styles.text}>{getRoomDescription(selectedRoom!)}</Text>

      <Text style={styles.text}>
        {selectedDate.format('H:mma')} - {endDate.format('H:mma')}
      </Text>

      <Text style={styles.lessText}>
        {endDate.diff(selectedDate, 'minutes')} minutes
      </Text>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          marginTop: 32,
          backgroundColor: 'transparent',
        }}
      >
        {state !== 'SUCCESS' && (
          <Slider
            disabled={state === 'LOADING'}
            style={{ width: '100%', height: 40 }}
            minimumValue={MIN_DURATION_MINS}
            maximumValue={maxEventDurationMins}
            value={DEFAULT_DURATION_MINS}
            step={15}
            minimumTrackTintColor="#ff6961"
            maximumTrackTintColor="#efefef"
            onValueChange={(durationMinutes) =>
              setEndDate(selectedDate.add(durationMinutes, 'minutes'))
            }
          />
        )}

        <Pressable
          disabled={state === 'LOADING'}
          style={({ pressed }) =>
            pressed
              ? [styles.button, styles.buttonPressed, { marginTop: 24 }]
              : [styles.button, { marginTop: 24 }]
          }
          accessibilityLabel={state === 'SUCCESS' ? 'Close' : 'Book room'}
          onPress={() =>
            state === 'SUCCESS' ? navigation.navigate('TabOne') : submit()
          }
        >
          <Text style={styles.buttonText}>
            {(() => {
              if (state === 'SUCCESS') return 'Close';
              if (state === 'ERROR') return 'Failed to book room';
              if (state === 'LOADING') return 'Loading...';

              return 'Book room';
            })()}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    fontSize: 25,
    fontWeight: '900',
    maxWidth: '66%',
    textAlign: 'center',

    color: '#222',

    textDecorationColor: '#ccc',
    textDecorationLine: 'underline',
  },
  lessText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  text: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '66%',
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
});

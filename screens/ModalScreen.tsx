import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

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
  } = useContext(CalendarContext);

  const DEFAULT_DURATION_MINS = 60;
  const MIN_DURATION_MINS = 15;
  const MAX_DURATION_MINS = 60 * 6;

  useEffect(() => {
    setEndDate(selectedDate.add(DEFAULT_DURATION_MINS, 'minutes'));
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
        attendees: [{ email: selectedRoom!.id! }],
        summary: meetingTitle,
      },
      {
        items: [
          {
            id: selectedRoom!.id!,
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

    loadRoomSchedules();

    // setTimeout(() => navigation.navigate('TabOne'), 300)
  }

  return (
    <View style={styles.container}>
      <TextInput
        defaultValue={'Working session in ' + selectedRoom!.displayName}
        placeholder="Meeting title"
        multiline
        style={styles.titleInput}
        // @ts-ignore
        onChange={(e) => setMeetingTitle(e.target.value)}
      />

      <Text style={styles.text}>{getRoomDescription(selectedRoom!)}</Text>

      <Text style={styles.text}>
        {selectedDate.format('H:mma')} - {endDate.format('H:mma')}
      </Text>

      <Text style={styles.lessText}>
        {endDate.diff(selectedDate, 'minutes')} minutes
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} /> */}

      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          marginTop: 32,
          backgroundColor: 'transparent',
        }}
      >
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={MIN_DURATION_MINS}
          maximumValue={MAX_DURATION_MINS}
          value={DEFAULT_DURATION_MINS}
          step={15}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="#efefef"
          onValueChange={(durationMinutes) =>
            setEndDate(selectedDate.add(durationMinutes, 'minutes'))
          }
        />

        {state === 'SUCCESS' && (
          <Pressable
            onPress={() => Linking.openURL(createdEventData!.htmlLink)}
          >
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
              Open event in Google Calendar
            </Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) =>
            pressed ? [styles.button, styles.buttonPressed] : styles.button
          }
          accessibilityLabel="Book room"
          onPress={() => submit()}
        >
          <Text style={styles.buttonText}>
            {(() => {
              if (state === 'SUCCESS') return 'Booked room!';
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

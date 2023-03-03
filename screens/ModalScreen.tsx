import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import {
  Linking,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';
import { Keyboard } from 'react-native';

import FifthFloorAssets from '../components/fifthFloor.assetMap';
import Floorplan, { DisplayMode } from '../components/Floorplan';
import FourthFloorAssets from '../components/fourthFloor.assetMap';
import SegmentedSlider from '../components/SegmentedSlider';
import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';
import {
  BookableRoomEntity,
  RoomBookableData,
  RoomCategoryData,
  RoomEntity,
} from '../data/rooms.data';
import {
  DEFAULT_MEETING_DURATION_MINS,
  MAX_MEETING_DURATION_MINS,
  MIN_MEETING_DURATION_MINS,
} from '../data/time.data';
import { GoogleEventResponse } from '../googleClient/google.types';
import { RootTabScreenProps } from '../types';

const getRoomDescription = (room: RoomEntity) => {
  if (room.factoryNumber != null)
    return `[${room.factoryNumber}] ${room.displayName} - ${
      RoomCategoryData[room.category].displayName
    }`;

  if (room.displayName != null)
    return `${room.displayName}  - ${
      RoomCategoryData[room.category].displayName
    }`;

  return 'Unknown room';
};

const removeNewlines = (str: string) => str.replace(/\n/g, '');

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
    loadUserSchedule,
  } = useContext(CalendarContext);

  useEffect(() => {
    setEndDate(
      selectedDate.add(
        Math.min(DEFAULT_MEETING_DURATION_MINS, maxEventDurationMins),
        'minutes'
      )
    );
  }, []);

  const [createdEventData, setCreatedEventData] =
    useState<GoogleEventResponse | null>(null);

  const [meetingTitle, setMeetingTitle] = useState(
    'Working session in ' + selectedRoom!.displayName
  );

  const [state, setState] = useState<
    'DEFAULT' | 'ERROR' | 'SUCCESS' | 'LOADING'
  >('DEFAULT');

  function closeModal() {
    // navigation.navigate("TabOne")
    // navigation.getParent()?.goBack();

    // navigation.popToTop();
    navigation.goBack();
  }

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
        attendees: [{ email: (selectedRoom as BookableRoomEntity).email! }],
        summary: meetingTitle,
      },
      {
        items: [
          {
            id: (selectedRoom as BookableRoomEntity).email!,
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
    setTimeout(loadUserSchedule, 1000);
  }
  const selectedRoomSchedule = roomSchedules[selectedRoom!.id];

  const nextEventsInSelectedRoom = (
    selectedRoomSchedule as BookableRoomEntity
  ).busyTimes
    ?.filter((i) => dayjs(i.start).isAfter(selectedDate))
    ?.sort((a, b) => (dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : 0));

  const nextEventInSelectedRoom = nextEventsInSelectedRoom?.[0] ?? null;

  const hasEvents = nextEventInSelectedRoom != null;

  const minutesUntilNextEvent =
    nextEventInSelectedRoom == null
      ? Infinity
      : dayjs(nextEventInSelectedRoom!.start).diff(selectedDate, 'minutes');

  const maxEventDurationMins = Math.min(
    minutesUntilNextEvent,
    MAX_MEETING_DURATION_MINS
  );

  const MinutesUntilNextEventDesc = ({ mins }: { mins: number }) => {
    // if (mins <= 0) return "0 minutes"

    const hours = Math.floor(mins / 60);

    const minutes = mins % 60;

    const hoursStr = hours > 0 ? `${hours} hours` : '';

    const minutesStr = minutes > 0 ? `${minutes} minutes` : '';

    return (
      <View
        style={{
          width: 170,
          flexDirection: 'column',
          backgroundColor: 'transparent',
        }}
      >
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
          <Text style={[styles.moreText, { width: 37, textAlign: 'right' }]}>
            {hours}
          </Text>
          <Text style={[styles.moreText, { textAlign: 'left' }]}> hours</Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
          <Text style={[styles.moreText, { width: 37, textAlign: 'right' }]}>
            {minutes}
          </Text>
          <Text style={[styles.moreText, { textAlign: 'left' }]}> minutes</Text>
        </View>
      </View>
    );
  };

  const segments = hasEvents
    ? nextEventsInSelectedRoom.flatMap((i, idx) => {
        const ding = {
          start: dayjs(i.start),
          end: dayjs(i.end),
          lengthMins: dayjs(i.end).diff(dayjs(i.start), 'minutes'),
          type: 'UNAVAILABLE',
        } as const;
        const dong = {
          start:
            idx === 0
              ? selectedDate
              : dayjs(nextEventsInSelectedRoom![idx - 1].end),
          end: dayjs(i.start),
          lengthMins: dayjs(i.start).diff(
            idx === 0
              ? selectedDate
              : dayjs(nextEventsInSelectedRoom![idx - 1].end),
            'minutes'
          ),
          type: 'BOOKABLE',
        } as const;

        return [dong, ding];
      })
    : [
        {
          start: dayjs(),
          end: dayjs().add(MAX_MEETING_DURATION_MINS, 'minutes'),
          lengthMins: MAX_MEETING_DURATION_MINS,
          type: 'BOOKABLE',
        } as const,
      ];

  const [sliderValue, setSliderValue] = useState<any>(null);

  function onSliderValueChange(event: any) {
    setEndDate(
      selectedDate.add(event.value * MAX_MEETING_DURATION_MINS, 'minutes')
    );
    setSliderValue(event);
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={closeModal}
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',

          width: 48,
          height: 48,

          right: 16,
          top: 16,

          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: 999,
        }}
      >
        <FontAwesome name="close" style={{ color: '#222', fontSize: 20 }} />
      </Pressable>
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
          <>
            <TextInput
              autoCapitalize="none"
              defaultValue={'Working session in ' + selectedRoom!.displayName}
              placeholder="Meeting title"
              multiline
              style={styles.titleInput}
              onChangeText={(text) => setMeetingTitle(removeNewlines(text))}
              onKeyPress={quitKeyboardOnEnter}
              value={meetingTitle}
            />
            {/* <FontAwesome name="pencil" style={{ color: "#222", fontSize: 50 }} /> */}
          </>
        );
      })()}

      <Text style={styles.text}>{getRoomDescription(selectedRoom!)}</Text>

      <View
        style={{
          height: '40%',
          backgroundColor: 'transparent',
        }}
      >
        <Floorplan
          highlightData={{ [selectedRoom!.id]: { isHighlighted: true } }}
          displayMode={DisplayMode.HIGHLIGHT_MODE}
          isZoomEnabled={false}
          hasData={true}
          hasError={false}
          isLoading={false}
          selectedDate={dayjs()}
          roomSchedules={{}}
          handleRoomClick={() => {}}
          userSchedule={[]}
          Assets={
            selectedRoom!.parentId === 'fifthFloor'
              ? FifthFloorAssets
              : FourthFloorAssets
          }
        />
      </View>

      <MinutesUntilNextEventDesc mins={endDate.diff(selectedDate, 'minutes')} />

      <Text style={styles.text}>
        {selectedDate.format('H:mma')} - {endDate.format('H:mma')}
      </Text>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          marginTop: 32,
          backgroundColor: 'transparent',
        }}
      >
        {sliderValue?.isUpperLimit && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: RoomBookableData.UNAVAILABLE.color,
              borderRadius: 4,
              paddingHorizontal: 4,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',

              left: 16,

              // left:
              //   (sliderWidth / 6 / 4) * (minutesUntilNextEvent / 15) + 16 + 12,
              bottom: 110,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '900',
              }}
            >
              Already booked
            </Text>
          </View>
        )}

        <SegmentedSlider
          value={DEFAULT_MEETING_DURATION_MINS / MAX_MEETING_DURATION_MINS}
          onValueChange={onSliderValueChange}
          step={1 / (MAX_MEETING_DURATION_MINS / 15)}
          segments={segments.map((i) => ({
            width: 1 / (MAX_MEETING_DURATION_MINS / i.lengthMins),
            color: RoomBookableData[i.type].color,
            isUpperLimit: i.type === 'UNAVAILABLE',
          }))}
        />

        <Pressable
          disabled={state === 'LOADING'}
          style={({ pressed }) =>
            pressed
              ? [styles.button, styles.buttonPressed, { marginTop: 24 }]
              : [styles.button, { marginTop: 24 }]
          }
          accessibilityLabel={state === 'SUCCESS' ? 'Close' : 'Book room'}
          onPress={() => (state === 'SUCCESS' ? closeModal() : submit())}
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
  moreText: {
    maxWidth: '66%',
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',

    color: '#222',
  },
  titleInput: {
    fontSize: 25,
    fontWeight: '900',
    maxWidth: '66%',
    textAlign: 'center',

    color: '#222',

    textDecorationColor: '#ccc',
    textDecorationLine: 'underline',
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
    borderRadius: 4,

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
    backgroundColor: RoomBookableData.UNAVAILABLE.color,
    borderRadius: 4,
    height: 16,
    paddingHorizontal: 3,
    color: 'white',
  },
});

function quitKeyboardOnEnter(
  e: NativeSyntheticEvent<TextInputKeyPressEventData>
) {
  if (e.nativeEvent.key == 'Enter') {
    Keyboard.dismiss();
  }
}

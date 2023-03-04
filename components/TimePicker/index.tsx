import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { useCallback, useContext, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import CalendarContext from '../../contexts/calendar.context';
import PreferencesContext from '../../contexts/preferences.context';
import { RoomBookableData, rooms } from '../../data/rooms.data';
import overlayElementsStyles from '../overlayUI/overlayElements.styles';
import SegmentedSlider from '../SegmentedSlider';
import { Text, View } from '../Themed';

function handleOverlappingSegments(segments: any[]) {}

export interface TimePickerProps {
  style: StyleProp<ViewStyle>;

  title: string;
  value: number;
  onValueChange: (e: number) => any;
  canGoToPrevDay: boolean;
  canGoToNextDay: boolean;
  goToPrevDay: () => any;
  goToNextDay: () => any;
  selectedDate: dayjs.Dayjs;
}
export default function TimePicker({
  style,

  title,
  value,
  onValueChange,
  canGoToPrevDay,
  canGoToNextDay,
  goToPrevDay,
  goToNextDay,
  selectedDate,
}: TimePickerProps) {
  const { userSchedule, startDate, goToToday } = useContext(CalendarContext);

  const { timePickerMode } = useContext(PreferencesContext);

  const meetingsWithRooms =
    userSchedule?.map((i) => {
      const roomEmails =
        i.attendees?.filter((j) => j.resource)?.map((j) => j.email) ?? [];

      const meetingRooms = Object.values(rooms).filter((j) =>
        roomEmails.includes(j.email)
      );

      return {
        ...i,
        meetingRooms,
      };
    }) ?? [];

  const meetingSegments = meetingsWithRooms
    .filter((i) => i.meetingRooms.length)
    .map((i) => {
      // TODO: investigate weird google dateTime format with timezone offset add the end

      const start = dayjs(i.start.dateTime.slice(0, -6));
      const end = dayjs(i.end.dateTime.slice(0, -6));

      const lengthMins = end.diff(start, 'minutes');

      return {
        start,
        end,
        lengthMins,
        type: 'BOOKED_BY_SELF',
      } as const;
    })
    .filter(
      (i) =>
        i.end.isAfter(startDate) &&
        i.start.isBefore(startDate.add(timePickerMode.rangeHours, 'hours'))
    );

  meetingSegments.sort((a, b) => (a.start.isBefore(b.start) ? -1 : 1));

  const segments =
    meetingSegments.length > 0
      ? meetingSegments.flatMap((i, idx) => {
          const isLastSegment = idx === meetingSegments.length - 1;

          const prevDate =
            idx === 0 ? startDate.startOf('day') : meetingSegments[idx - 1].end;

          const inBetweenSegment = {
            lengthMins: i.start.diff(prevDate, 'minutes'),
            type: 'BOOKABLE',
          } as const;

          if (isLastSegment) {
            const finalSegment = {
              lengthMins: startDate
                .add(timePickerMode.rangeHours, 'hours')
                .diff(i.end, 'minutes'),
              type: 'BOOKABLE',
            } as const;

            return [inBetweenSegment, i, finalSegment];
          }
          return [inBetweenSegment, i];
        })
      : [
          {
            // start: dayjs(),
            // end: dayjs().add(timePickerMode.rangeHours, 'nhours'),
            lengthMins: timePickerMode.rangeHours * 60,
            type: 'BOOKABLE',
          } as const,
        ];

  const borderOffset = 16; // 26;

  const minsFromStartOfDay = dayjs().diff(dayjs().startOf('day'), 'minutes');

  // TODO: reimplement UNBOOKABLE segment on slider if in past

  const segmentss = canGoToPrevDay
    ? [
        {
          start: startDate,
          end: startDate.add(timePickerMode.rangeHours, 'hours'),
          lengthMins: timePickerMode.rangeHours * 60,
          type: 'BOOKABLE',
        } as const,
      ]
    : [
        {
          start: startDate,
          end: startDate.add(minsFromStartOfDay, 'minutes'),
          lengthMins: minsFromStartOfDay,
          type: 'UNBOOKABLE',
          isLowerLimit: true,
        } as const,
        {
          start: startDate.add(minsFromStartOfDay, 'minutes'),
          end: startDate.add(timePickerMode.rangeHours, 'hours'),
          lengthMins: timePickerMode.rangeHours * 60 - minsFromStartOfDay,
          type: 'BOOKABLE',
        } as const,
      ];

  return (
    <View style={[styles.datePicker, style]}>
      <View style={styles.upperRow}>
        <View
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'column',
            top: 6,
            position: 'absolute',
            left: 48 + 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#7c7c7c' }}>
            {selectedDate.format(
              Dimensions.get('window').width >= 430
                ? 'ddd, MMM D'
                : 'ddd, MMM D'
            )}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#7c7c7c' }}>
            {selectedDate.format('H:mm')}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '900',
            color: 'white',
            marginHorizontal: 16,
            position: 'absolute',
            right: 48 + 56,
            top: 16,
          }}
        >
          {selectedDate.from(dayjs())}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.nowButton,
            { position: 'absolute', right: borderOffset, top: 10 },
            pressed ? { transform: [{ scale: 0.95 }] } : {},
          ]}
          onPress={goToToday}
        >
          <Text style={styles.nowButtonText}>NOW</Text>
        </Pressable>

        {canGoToPrevDay && (
          <Pressable
            onPress={goToPrevDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 10,
                left: borderOffset,
              },
            ]}
          >
            <FontAwesome
              name="chevron-left"
              style={overlayElementsStyles.smallOverlayText}
            />
          </Pressable>
        )}

        {/* <View style={overlayElementsStyles.smallOverlayElement}>
          <Text
            style={[
              overlayElementsStyles.smallOverlayText,
              { fontWeight: '700' },
            ]}
          >
            {title}
          </Text>
        </View> */}

        {canGoToNextDay && (
          <Pressable
            onPress={goToNextDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 10,
                right: borderOffset + 64 + 8,
              },
            ]}
          >
            <FontAwesome
              name="chevron-right"
              style={overlayElementsStyles.smallOverlayText}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.lowerRow}>
        <SegmentedSlider
          // value={DEFAULT_MEETING_DURATION_MINS / (24 * 60)}
          // onValueChange={onSliderValueChange}

          value={value}
          onValueChange={onValueChange}
          step={1 / ((timePickerMode.rangeHours * 60) / 15)}
          segments={segments.map((i) => ({
            width: 1 / ((timePickerMode.rangeHours * 60) / i.lengthMins),
            color: RoomBookableData[i.type].color,
            isLowerLimit: i.isLowerLimit,
            isUpperLimit: i.isUpperLimit,
            // isUpperLimit: i.type === 'UNAVAILABLE',
          }))}
        />
        {/* <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            // marginTop: 32,
            backgroundColor: 'transparent',
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 98,
              left: 16,
              height: 6,
              width: '100%',
              overflow: 'hidden',
              flexDirection: 'row',
              backgroundColor: 'transparent',

              top: 16,

              borderRadius: 4,
            }}
          >
            {segments.map((i, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    height: '100%',
                    backgroundColor: RoomBookableData[i.type].color,
                    borderRadius: 4,
                    width:
                      ((timePickerMode.rangeHours * 4) /
                        Math.round(i.lengthMins / 15)) *
                        100 +
                      '%',
                    marginLeft: 2,
                  }}
                />
              );
            })}
            {!canGoToPrevDay && (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  backgroundColor: '#7c7c7c',
                  borderRadius: 4,
                  width:
                    (1 / timePickerMode.rangeHours / 4) *
                      Math.round(
                        dayjs().diff(dayjs().startOf('day'), 'minutes') / 15
                      ) *
                      100 +
                    '%',
                }}
              />
            )}
          </View>
          {/* {!canGoToPrevDay && <View style={{
            backgroundColor: "white",

            width: 8,

            height: 30,

            position: "absolute",
            left: (1 / timePickerMode.rangeHours / 4) * (dayjs().diff(dayjs().startOf("day"), "minutes") / 15) * sliderWidth - 5,

            top: 4

          }} />} 
        <Slider
          style={{
            width: '100%',
          }}
          minimumValue={0}
          maximumValue={1}
          step={1 / timePickerMode.rangeHours / 4}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="white"
          onValueChange={debounced}
          value={value}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          lowerLimit={
            canGoToPrevDay
              ? 0
              : (1 / timePickerMode.rangeHours / 4) *
              (dayjs().diff(dayjs().startOf('day'), 'minutes') / 15)
          }
        />
      </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    flexDirection: 'column',
  },
  upperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: 16 * 2,

    bottom: 8,

    backgroundColor: 'transparent',
  },
  lowerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: 16 * 3,
    paddingHorizontal: 16,

    bottom: 0,

    backgroundColor: 'transparent',
  },
  timeDisplay: {
    position: 'absolute',

    marginTop: 8,

    bottom: -1,

    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',

    color: 'white',
  },
  timeDisplayAlt: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '700',

    color: 'white',
  },
  nowButton: {
    alignItems: 'center',
    justifyContent: 'center',

    height: 32,
    paddingHorizontal: 10,

    backgroundColor: 'white',
    borderRadius: 4,
  },
  nowButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#222',
  },
});

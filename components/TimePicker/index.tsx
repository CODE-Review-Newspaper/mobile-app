import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { RoomBookableData } from '../../data/rooms.data';
import {
  MAX_TIMEPICKER_RANGE_DAYS,
  MAX_TIMEPICKER_RANGE_HOURS,
} from '../../data/time.data';
import overlayElementsStyles from '../overlayUI/overlayElements.styles';
import SegmentedSlider from '../SegmentedSlider';
import { Text, View } from '../Themed';

export interface TimePickerProps {
  style: StyleProp<ViewStyle>;

  title: string;
  value: number;
  onValueChange: (e: number) => any;
  canGoToPrevDay: boolean;
  canGoToNextDay: boolean;
  goToPrevDay: () => any;
  goToNextDay: () => any;
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
}: TimePickerProps) {
  const borderOffset = 16; // 26;

  const minsFromStartOfDay = dayjs().diff(dayjs().startOf('day'), 'minutes');

  const segments = canGoToPrevDay
    ? [
        {
          // start: dayjs(),
          // end: dayjs().add(MAX_TIMEPICKER_RANGE_HOURS, 'nhours'),
          lengthMins: MAX_TIMEPICKER_RANGE_HOURS * 60,
          type: 'BOOKABLE',
        } as const,
      ]
    : [
        {
          // start: dayjs(),
          // end: dayjs().add(60 * 120, "minutes"),
          lengthMins: minsFromStartOfDay,
          type: 'UNBOOKABLE',
          isLowerLimit: true,
        } as const,
        {
          // start: dayjs(),
          // end: dayjs().add(MAX_TIMEPICKER_RANGE_HOURS, 'hours'),
          lengthMins: MAX_TIMEPICKER_RANGE_HOURS * 60 - minsFromStartOfDay,
          type: 'BOOKABLE',
        } as const,
      ];

  return (
    <View style={[styles.datePicker, style]}>
      <View style={styles.upperRow}>
        {canGoToPrevDay && (
          <Pressable
            onPress={goToPrevDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 0,
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
        <View style={overlayElementsStyles.smallOverlayElement}>
          <Text
            style={[
              overlayElementsStyles.smallOverlayText,
              { fontWeight: '700' },
            ]}
          >
            {title}
          </Text>
        </View>
        {canGoToNextDay && (
          <Pressable
            onPress={goToNextDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 0,
                right: borderOffset,
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
          step={1 / ((24 * 60) / 15)}
          segments={segments.map((i) => ({
            width: 1 / ((24 * 60) / i.lengthMins),
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
                      ((MAX_TIMEPICKER_RANGE_HOURS * 4) /
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
                    (1 / MAX_TIMEPICKER_RANGE_HOURS / 4) *
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
            left: (1 / MAX_TIMEPICKER_RANGE_HOURS / 4) * (dayjs().diff(dayjs().startOf("day"), "minutes") / 15) * sliderWidth - 5,

            top: 4

          }} />} 
        <Slider
          style={{
            width: '100%',
          }}
          minimumValue={0}
          maximumValue={1}
          step={1 / MAX_TIMEPICKER_RANGE_HOURS / 4}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="white"
          onValueChange={debounced}
          value={value}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          lowerLimit={
            canGoToPrevDay
              ? 0
              : (1 / MAX_TIMEPICKER_RANGE_HOURS / 4) *
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
});

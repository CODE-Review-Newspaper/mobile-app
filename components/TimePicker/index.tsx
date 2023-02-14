import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import debounce from 'lodash/debounce';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { MAX_TIMEPICKER_RANGE_HOURS } from '../../data/time.data';
import overlayElementsStyles from '../overlayUI/overlayElements.styles';
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

  const debounced = useCallback(debounce(onValueChange, 3), []);

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
        />
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

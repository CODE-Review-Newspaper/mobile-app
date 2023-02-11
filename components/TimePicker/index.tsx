import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import overlayElementsStyles from '../overlayUI/overlayElements.styles';
import { Text, View } from '../Themed';

export interface TimePickerProps {
  style: StyleProp<ViewStyle>;

  title: string;
  value: number;
  onValueChange: (e: number) => any;
  hasGoToPrevDay: boolean;
  hasGoToNextDay: boolean;
  goToPrevDay: () => any;
  goToNextDay: () => any;
}
export default function TimePicker({
  style,

  title,
  value,
  onValueChange,
  hasGoToPrevDay,
  hasGoToNextDay,
  goToPrevDay,
  goToNextDay,
}: TimePickerProps) {
  return (
    <View style={[styles.datePicker, style]}>
      <View style={styles.upperRow}>
        {hasGoToNextDay && (
          <Pressable
            onPress={goToNextDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 0,
                left: 26,
              },
            ]}
          >
            <FontAwesome
              name="chevron-right"
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
        {hasGoToNextDay && (
          <Pressable
            onPress={goToNextDay}
            style={[
              overlayElementsStyles.smallOverlaySquare,
              {
                position: 'absolute',
                top: 0,
                right: 26,
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
          step={1 / 12 / 4}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="white"
          onValueChange={onValueChange}
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
    height: 32,

    bottom: 4,

    backgroundColor: 'transparent',
  },
  lowerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: 48,
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

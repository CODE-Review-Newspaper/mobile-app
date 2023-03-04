/**
 * wrapper for the Slider component that allows for segmentation of the slider track.
 * we can have an arbitrary amount of colored segments, and can optionally set them as the minimum or maximum.
 * the output value is always between 0 and 1.
 *
 * this component also handles debouncing the onValueChange callback.
 */
import Slider, { SliderProps } from '@react-native-community/slider';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { View } from './Themed';

export interface SegmentedSliderProps {
  value: number;
  onValueChange: (e: {
    value: number;
    segmentIdx: number;
    isLowerLimit: boolean;
    isUpperLimit: boolean;
  }) => any;
  segments: {
    color: string;
    width: number;
    isLowerLimit?: boolean;
    isUpperLimit?: boolean;
  }[];
  step?: number | null;

  disabled?: boolean;
}
export default function SegmentedSlider({
  value,
  onValueChange,
  segments,
  step = null,

  disabled = false,
}: SegmentedSliderProps) {
  const [isSliding, setIsSliding] = useState(false);

  function startSlide() {
    setIsSliding(true);

    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
  }
  function endSlide() {
    setIsSliding(false);
  }
  const lowerLimit = segments.some((i) => i.isLowerLimit)
    ? segments
        .slice(0, segments.findIndex((i) => i.isLowerLimit) + 1)
        .reduce((sum, i) => sum + i.width, 0)
    : 0;
  const upperLimit = segments.some((i) => i.isUpperLimit)
    ? segments
        .slice(
          0,
          segments.findIndex((i) => i.isUpperLimit)
        )
        .reduce((sum, i) => sum + i.width, 0)
    : 1;

  const debugStr = `slider ranges from ${lowerLimit} to ${upperLimit} (${
    upperLimit - lowerLimit
  } range)`;

  // debounce the function so it gets called at max every 3ms, to make two-way binding the value smoother
  const debouncedOnValueChange = useCallback(debounce(onValueChange, 3), []);

  const getCurrentSegmentIdx = (value: number, segments: any[]) => {
    let sache = 0;

    for (const [idx, segment] of segments.entries()) {
      sache += segment.width;

      if (sache > value) return idx;
    }
    return 0;
  };

  return (
    <>
      <View
        style={{
          position: 'relative',

          width: '100%',
          height: 40,

          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 17,

            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'hidden',

            width: '100%',
            height: 6,

            backgroundColor: 'transparent',

            paddingHorizontal: 2,
          }}
        >
          {segments.map((i, idx) => {
            const gapSpace = (segments.length - 1) * 0.5;

            const widthPercent = i.width * 100 - gapSpace / segments.length;

            return (
              <View
                key={idx}
                style={{
                  width: widthPercent + '%',
                  height: '100%',

                  backgroundColor: i.color,
                  borderRadius: 4,
                }}
              />
            );
          })}
        </View>
        <Slider
          value={Math.min(Math.max(value, lowerLimit), upperLimit)}
          onValueChange={(newValue) => {
            const segmentIdx = getCurrentSegmentIdx(newValue, segments);

            const isLowerLimit = newValue === lowerLimit;
            const isUpperLimit = newValue === upperLimit;

            const event = {
              value: newValue,
              segmentIdx,
              isLowerLimit,
              isUpperLimit,
            };
            debouncedOnValueChange(event);
          }}
          onSlidingStart={startSlide}
          onSlidingComplete={endSlide}
          disabled={disabled}
          lowerLimit={lowerLimit}
          upperLimit={upperLimit}
          {...(step == null ? {} : { step })}
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 40,
          }}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
    </>
  );
}

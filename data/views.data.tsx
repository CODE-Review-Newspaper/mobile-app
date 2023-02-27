import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { Text } from '../components/Themed';
import { RoomViewFilter, RoomViewType } from '../screens/RoomListScreen';
import { TimePickerMode } from '../services/UserPreferences.service';

const styles = StyleSheet.create({
  chipText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
});

export const RoomFilter: Record<string, RoomViewFilter> = {
  MAX_THREE_PEOPLE: {
    id: 'MAX_THREE_PEOPLE',
    displayName: 'Small rooms',
    filter: (i) =>
      i.room.bookable === 'BOOKABLE' &&
      i.isAvailable &&
      !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
      i.room.capacity <= 3,
  },
  MAX_NINE_PEOPLE: {
    id: 'MAX_NINE_PEOPLE',
    displayName: 'Mid-sized rooms',
    filter: (i) =>
      i.room.bookable === 'BOOKABLE' &&
      i.isAvailable &&
      !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
      i.room.capacity >= 4 &&
      i.room.capacity <= 9,
  },
  TEN_OR_MORE_PEOPLE: {
    id: 'TEN_OR_MORE_PEOPLE',
    displayName: 'Large rooms',
    filter: (i) =>
      i.room.bookable === 'BOOKABLE' &&
      i.isAvailable &&
      !['STUDIO', 'WORKSHOP'].includes(i.room.category) &&
      i.room.capacity >= 10,
  },
  ALL: {
    id: 'ALL',
    displayName: 'All rooms',
    filter: (i) =>
      i.room.bookable === 'BOOKABLE' &&
      i.isAvailable &&
      !['STUDIO', 'WORKSHOP'].includes(i.room.category),
  },
  MUSIC_STUDIO: {
    id: 'MUSIC_STUDIO',
    displayName: 'Music studio',
    filter: (i) =>
      i.room.bookable === 'BOOKABLE' &&
      i.isAvailable &&
      ['STUDIO'].includes(i.room.category),
  },
};
export const RoomView: Record<string, RoomViewType> = {
  MAX_THREE_PEOPLE: {
    id: 'MAX_THREE_PEOPLE',
    label: (
      <Text style={styles.chipText}>
        {'1-3 '}
        <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
      </Text>
    ),
    filters: [RoomFilter.MAX_THREE_PEOPLE],
    sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
  },
  MAX_NINE_PEOPLE: {
    id: 'MAX_NINE_PEOPLE',
    label: (
      <Text style={styles.chipText}>
        {'4-9 '}
        <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
      </Text>
    ),
    filters: [RoomFilter.MAX_NINE_PEOPLE],
    sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
  },
  TEN_OR_MORE_PEOPLE: {
    id: 'TEN_OR_MORE_PEOPLE',
    label: (
      <Text style={styles.chipText}>
        {'10+ '}
        <FontAwesome name="user" style={{ fontSize: 16, color: 'white' }} />
      </Text>
    ),
    filters: [RoomFilter.TEN_OR_MORE_PEOPLE],
    sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
  },
  ALL: {
    id: 'ALL',
    label: <Text style={styles.chipText}>ALL</Text>,
    filters: [
      RoomFilter.MAX_THREE_PEOPLE,
      RoomFilter.MAX_NINE_PEOPLE,
      RoomFilter.TEN_OR_MORE_PEOPLE,
    ],
    sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
  },
  SPECIAL_ROOMS: {
    id: 'SPECIAL_ROOMS',
    label: (
      <Text style={styles.chipText}>
        <FontAwesome name="star" style={{ fontSize: 16, color: 'white' }} />
      </Text>
    ),
    filters: [RoomFilter.MUSIC_STUDIO],
    sort: (a, b) => a?.minutesUntilNextEvent - b?.minutesUntilNextEvent,
  },
};
export const DEFAULT_ROOM_VIEW = RoomView.ALL;

export const MapMode = {
  MAP_MODE: {
    id: 'MAP_MODE' as const,
    displayName: 'Map mode',
    next: 'BOOKING_MODE' as const,
  },
  BOOKING_MODE: {
    id: 'BOOKING_MODE' as const,
    displayName: 'Booking mode',
    next: 'MAP_MODE' as const,
  },
  HIGHLIGHT_MODE: {
    id: 'HIGHLIGHT_MODE' as const,
    displayName: 'Highlight mode',
    next: null,
  },
};
export const DEFAULT_SIGNED_IN_MAP_MODE = MapMode.BOOKING_MODE;
export const DEFAULT_SIGNED_OUT_MAP_MODE = MapMode.MAP_MODE;

const TimePickerModeImpl = {
  HALF_DAY: {
    id: 'HALF_DAY',
    displayName: 'Half day (8:00 - 20:00)',
    startHours: 8,
    endHours: 20,
    rangeHours: 12,
  } as TimePickerMode,
  FULL_DAY: {
    id: 'FULL_DAY',
    displayName: 'Full day (0:00 - 24:00)',

    startHours: 0,
    endHours: 24,
    rangeHours: 24,
  } as TimePickerMode,
};

export { TimePickerModeImpl as TimePickerMode };

export const DEFAULT_TIMEPICKER_MODE = TimePickerModeImpl.HALF_DAY;

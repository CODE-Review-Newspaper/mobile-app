import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Dimensions } from 'react-native';

import overlayElementsStyles from '../components/overlayUI/overlayElements.styles';
import { Text } from '../components/Themed';

export const ROOM_SCHEDULES_FETCH_TIME_DAYS = 7;
export const ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_DEFAULT = 30;
export const ROOM_SCHEDULES_REFETCHING_INTERVAL_SECONDS_OFFLINE = 1;

export const USER_SCHEDULE_FETCH_TIME_DAYS = 7;
export const USER_SCHEDULE_REFETCHING_INTERVAL_SECONDS_DEFAULT = 30;
export const USER_SCHEDULE_REFETCHING_INTERVAL_SECONDS_OFFLINE = 1;

export const MAX_TIMEPICKER_RANGE_HOURS = 24;
export const MAX_TIMEPICKER_RANGE_DAYS = 7;

export const MIN_MEETING_DURATION_MINS = 15;
export const MAX_MEETING_DURATION_MINS = 60 * 6;
export const DEFAULT_MEETING_DURATION_MINS = 60;

dayjs.extend(relativeTime);

export const getTimepickerTitle = (selectedDate: dayjs.Dayjs) => {
  const date = selectedDate.format(
    Dimensions.get('window').width >= 430 ? 'dddd, MMM D' : 'ddd, MMM D'
  );
  const time = selectedDate.format('H:mm');

  const relativeTime = '(' + selectedDate.from(dayjs()) + ')';

  return (
    <>
      <Text
        style={[
          overlayElementsStyles.smallOverlayText,
          { fontWeight: '700', color: '#777', fontSize: 15 },
        ]}
      >
        {date} | {time}
      </Text>{' '}
      <Text
        style={[overlayElementsStyles.smallOverlayText, { fontWeight: '700' }]}
      >
        {relativeTime}
      </Text>
    </>
  );
};

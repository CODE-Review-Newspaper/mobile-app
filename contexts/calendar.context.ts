import dayjs from 'dayjs';
import { createContext } from 'react';

import bookRoomsController from '../controller/booking.controller';
import { RoomEntity } from '../data/rooms.data';
import { GoogleEventResponse } from '../googleClient/google.types';

export interface CalendarContextType {
  selectedRoom: RoomEntity | null;
  setSelectedRoom: (room: RoomEntity | null) => unknown;

  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => unknown;

  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => unknown;

  endDate: dayjs.Dayjs;
  setEndDate: (date: dayjs.Dayjs) => unknown;

  createEvent: ReturnType<typeof bookRoomsController>['createEvent'];

  roomSchedules: Record<string, RoomEntity>;
  loadRoomSchedules: () => Promise<any>;

  userSchedule: GoogleEventResponse[];
  loadUserSchedule: () => Promise<any>;

  isLoading: boolean;
  hasData: boolean;
  hasError: boolean;

  goToPrevDay: () => any;
  goToNextDay: () => any;
  goToToday: () => any;

  canGoToPrevDay: boolean;
  canGoToNextDay: boolean;
}
// @ts-ignore
const CalendarContext = createContext<CalendarContextType>();
export default CalendarContext;

import dayjs from 'dayjs';
import { createContext } from 'react';

import { CreateEventResponse } from '../controller/booking.controller';
import { RoomEntity } from '../data/rooms.data';
import {
  BusyRooms,
  CheckBusyRoomRequest,
  CreateEventRequest,
} from '../types/dings.types';

export interface CalendarContextType {
  selectedRoom: RoomEntity | null;
  setSelectedRoom: (room: RoomEntity | null) => unknown;

  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => unknown;

  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => unknown;

  endDate: dayjs.Dayjs;
  setEndDate: (date: dayjs.Dayjs) => unknown;

  roomSchedules: Record<string, RoomEntity>;
  createEvent: (
    eventBody: CreateEventRequest,
    roomBusyBody: CheckBusyRoomRequest
  ) => Promise<
    readonly [{}, null] | readonly [null | undefined, CreateEventResponse]
  >;
  loadRoomSchedules: () => Promise<any>;

  isLoading: boolean;
  hasData: boolean;
  hasError: boolean;
}
// @ts-ignore
const CalendarContext = createContext<CalendarContextType>();
export default CalendarContext;

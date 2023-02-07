import dayjs from 'dayjs';
import { createContext } from 'react';

import { Room } from '../controller/allRooms.controller';
import { CreateEventResponse } from '../controller/booking.controller';
import {
  BusyRooms,
  CheckBusyRoomRequest,
  CreateEventRequest,
} from '../types/dings.types';

export interface CalendarContextType {
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => unknown;

  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => unknown;

  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => unknown;

  endDate: dayjs.Dayjs;
  setEndDate: (date: dayjs.Dayjs) => unknown;

  roomSchedules: Record<string, Room>;
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

import { createContext } from "react";
import dayjs from "dayjs"
import { CheckBusyRoomRequest, CreateEventRequest } from "../types/dings.types";

interface CalendarContextType {
    selectedRoomId: null | string
    setSelectedRoomId: (id: string) => unknown

    selectedDate: dayjs.Dayjs
    setSelectedDate: (date: dayjs.Dayjs) => unknown

    startDate: dayjs.Dayjs
    setStartDate: (date: dayjs.Dayjs) => unknown

    endDate: dayjs.Dayjs
    setEndDate: (date: dayjs.Dayjs) => unknown

    roomSchedules: any
    createEvent: (eventBody: CreateEventRequest, roomBusyBody: CheckBusyRoomRequest) => Promise<[any, any]>
}
// @ts-ignore
const CalendarContext = createContext<CalendarContextType>();
export default CalendarContext
import { createContext } from "react";
import dayjs from "dayjs"

interface CalendarContextType {
    selectedRoomId: null | string
    setSelectedRoomId: (id: string) => unknown

    selectedDate: dayjs.Dayjs
    setSelectedDate: (date: dayjs.Dayjs) => unknown

    startDate: dayjs.Dayjs
    setStartDate: (date: dayjs.Dayjs) => unknown

    endDate: dayjs.Dayjs
    setEndDate: (date: dayjs.Dayjs) => unknown
}
// @ts-ignore
const CalendarContext = createContext<CalendarContextType>();
export default CalendarContext
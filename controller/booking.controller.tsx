import {
  CreateGoogleEventRequest,
  GetGoogleResourceSchedulesRequest,
  GoogleEventDate,
  GoogleEventResponse,
  GoogleResourceScheduleResponse,
  GoogleTimeFrame,
} from '../googleClient/google.types';
import userLoginController from './userLogin.controller';
import { fetchData } from './wrapper';

export default function bookRoomsController() {
  const { getAuthState } = userLoginController();

  async function createEvent(
    eventBody: CreateGoogleEventRequest,
    roomBusyBody: GetGoogleResourceSchedulesRequest
  ) {
    const url =
      'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    const [errorRooms, roomTimes] = await checkRoomAvailability(roomBusyBody);

    if (errorRooms != null) return [errorRooms, null] as const;

    const eventStart = eventBody.start;
    const eventEnd = eventBody.end;

    const confirmation = compareTimeFrames(roomTimes, eventStart, eventEnd);

    if (!confirmation) {
      return ['No available time.', null] as const;
    }
    const [error, res] = await fetchData(
      url,
      await getAuthState(),
      true,
      eventBody
    );

    if (error != null) {
      console.error('error inside createEvent:', error);

      return [error, null] as const;
    }
    const data: GoogleEventResponse = await res!.json();

    return [error, data] as const;
  }

  async function checkRoomAvailability(
    body: GetGoogleResourceSchedulesRequest
  ) {
    const url = 'https://www.googleapis.com/calendar/v3/freeBusy';

    const [error, response] = await fetchData(
      url,
      await getAuthState(),
      true,
      body
    );

    if (error != null) {
      console.error('error inside checkRoomAvailability:', error);

      return [error, null] as const;
    }
    const content: GoogleResourceScheduleResponse = await response!.json();

    const email = body.items[0].id;

    const roomCalendar = content?.calendars?.[email];

    if (roomCalendar == null) {
      return [`Failed to find calendar for room: "${email}"`, null] as const;
    }
    const roomBusyTimes = roomCalendar.busy;

    return [null, roomBusyTimes] as const;
  }

  function compareTimeFrames(
    roomTimes: GoogleTimeFrame[],
    eventTimeStart: { dateTime: string | Date; timeZone: string },
    eventTimeEnd: { dateTime: string | Date; timeZone: string }
  ) {
    for (let time of roomTimes) {
      if (typeof time.start === 'string') {
        time.start = new Date(time.start);
      }
      if (typeof time.end === 'string') {
        time.end = new Date(time.end);
      }
      if (
        time.start >= eventTimeStart.dateTime ||
        time.end >= eventTimeEnd.dateTime
      ) {
        return false;
      }
    }
    return true;
  }
  return { compareTimeFrames, createEvent, checkRoomAvailability };
}

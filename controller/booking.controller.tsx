import {
  BusyRooms,
  CheckBusyRoomRequest,
  CreateEventRequest,
  Time,
  TimeFrame,
} from '../types/dings.types';
import { url } from '../types/dings.types';
import userLoginController from './userLogin.controller';
import { fetchData } from './wrapper';

export interface EventTime {
  dateTime: string; // "2023-02-06T22:45:26+01:00",
  timeZone: string; // "Europe/Berlin"
}

export interface EventAttendee {
  email: string;
  self: boolean;
  displayName?: string;
  resource?: boolean;
  responseStatus?: 'needsAction';
}

export interface CreateEventResponse {
  kind: 'calendar#event';
  etag: string; // "\"3351441171534000\"",
  id: string; // "edsudrvom8t03j72pe89i7dtac",
  status: 'confirmed';
  htmlLink: string; // "https://www.google.com/calendar/event?eid=ZWRzdWRydm9tOHQwM2o3MnBlODlpN2R0YWMgbGludXMuYm9sbHNAY29kZS5iZXJsaW4",
  created: string; //  // "2023-02-06T21:56:25.000Z",
  updated: string; // "2023-02-06T21:56:25.767Z",
  summary: string; // "Working session in Jungle",
  location: string; // "--4-Jungle (35)",
  creator: EventAttendee;
  organizer: EventAttendee;
  start: EventTime;
  end: EventTime;
  iCalUID: string; // "edsudrvom8t03j72pe89i7dtac@google.com",
  sequence: 0;
  attendees: EventAttendee[];
  reminders: {
    useDefault: boolean;
  };
  eventType: 'default';
}

export default function bookRoomsController() {
  const { getAuthState } = userLoginController();

  async function createEvent(
    eventBody: CreateEventRequest,
    roomBusyBody: CheckBusyRoomRequest
  ) {
    const url: url =
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
    const data: CreateEventResponse = await res!.json();

    return [error, data] as const;
  }

  async function checkRoomAvailability(body: CheckBusyRoomRequest) {
    const url: url = 'https://www.googleapis.com/calendar/v3/freeBusy';

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
    const content = await response!.json();

    const email = body.items[0].id;

    const roomCalendar = content?.calendars?.[email];

    if (roomCalendar == null) {
      return [`Failed to find calendar for room: "${email}"`, null] as const;
    }
    const roomBusyTimes: BusyRooms[] = roomCalendar.busy;

    return [null, roomBusyTimes] as const;
  }

  function compareTimeFrames(
    roomTimes: TimeFrame[],
    eventTimeStart: Time,
    eventTimeEnd: Time
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

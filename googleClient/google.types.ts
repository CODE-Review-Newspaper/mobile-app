type Email = string;
type GoogleCalendarUrl = string;
type GoogleAssetUrl = string;
type Locale = 'en' | 'de';

type TimeZone = string; // "Europe/Berlin"
type DateTime = string; // "2023-02-06T16:18:30.000Z"

/**
 * occurs in stringified form in GoogleEventExtendedProperties.shared.meetingParams
 */
export interface GoogleEventMeetingParams {
  topic: string; // event title
  type: number; // observed to be 2
  start_time: DateTime;
  duration: number; // minutes
  timezone: TimeZone;
  invitees_hash: string;
}

/**
 * in the recorded case it was a zoom meeting
 */
export interface GoogleEventExtendedProperties {
  shared: {
    meetingId: string;
    zmMeetingNum: string;
    meetingParams: string; // stringified GoogleEventMeetingParams
  };
}
/**
 * in the recorded case it was a zoom meeting
 * TODO: actually type this i was too lazy lol
 */
export interface GoogleEventConferenceData {
  entryPoints: [
    {
      entryPointType: 'video';
      uri: 'https://codeuniversity.zoom.us/j/99803147990';
      label: 'codeuniversity.zoom.us/j/99803147990';
      meetingCode: '99803147990';
    },
    {
      regionCode: 'DE';
      entryPointType: 'phone';
      uri: 'tel: 496950502596,,99803147990#';
      label: ' 49 69 50502596';
    },
    {
      entryPointType: 'more';
      uri: 'https://www.google.com/url?q=https://applications.zoom.us/addon/invitation/detail?meetingUuid=fFBZALsKSGSAa4dMNhRDZw%3D%3D&signature=a478ec18554a5ed3edfcda79d40b346ec156e0a670489ca0595d40fc75f81759&v=1saDsourcecalendarusgAOvVaw1oFpyMYby7vYlSaOb2ZpoE';
    }
  ];
  conferenceSolution: {
    key: {
      type: 'addOn';
    };
    name: 'Zoom Meeting';
    iconUri: 'https://lh3.googleusercontent.com/pw/AM-JKLUkiyTEgH-6DiQP85RGtd_BORvAuFnS9katNMgwYQBJUTiDh12qtQxMJFWYH2Dj30hNsNUrr-kzKMl7jX-Qd0FR7JmVSx-Fhruf8xTPPI-wdsMYez6WJE7tz7KmqsORKBEnBTiILtMJXuMvphqKdB9X=s128-no';
  };
  conferenceId: '99803147990';
  notes: 'Meeting host: leonard.darsow@code.berlin<br /><br />Join Zoom Meeting: <br /><a href="https://www.google.com/url?q=https://codeuniversity.zoom.us/j/99803147990amp;saDamp;sourcecalendaramp;usgAOvVaw0HYNismklE70E2Z59eBY6f" target="_blank">https://codeuniversity.zoom.us/j/99803147990</a>';
  parameters: {
    addOnParameters: {
      parameters: {
        scriptId: '1O_9DeEljSH2vrECr8XeFYYRxFFiowFKOivqSDz316BlBcDXrF00BXrkO';
        realMeetingId: '99803147990';
        creatorUserId: '1Q9Po6NMQRa0L3bQ4WQ4gA';
        meetingUuid: 'fFBZALsKSGSAa4dMNhRDZw==';
        meetingType: '2';
        originalEventId: '0ndq0ur0rgpvqm332resrsjte8';
      };
    };
  };
}

export interface GoogleEventAttendee {
  email: string;
  responseStatus?: 'accepted' | 'needsAction';
  organizer?: boolean;
  self?: boolean;
  resource?: boolean; // whether the attendee is a room or an item (yes, those have email adresses)
  // observed in resources, probably not exclusive
  displayName?: string;
}
export interface GoogleEventDate {
  dateTime: DateTime;
  timeZone: TimeZone;
}
export interface GoogleEventResponse {
  kind: 'calendar#event';
  etag: string;
  id: string;
  status: 'confirmed';
  htmlLink: GoogleCalendarUrl;
  created: DateTime;
  updated: DateTime;
  summary: string; // the event title, observed to be "Working session in Jungle"
  location?: string; // the displayName of the room resource, observed to be "--4-Jungle (35)", only observed in response for creating event
  creator: GoogleEventAttendee;
  organizer: GoogleEventAttendee;
  start: GoogleEventDate;
  end: GoogleEventDate;
  iCalUID: Email; // ends in @google.com
  sequence: number; // observed to be 0, 2, and 3
  recurrence?: string[]; // observed to be [ "RRULE:FREQ=WEEKLY;BYDAY=TU" ]
  attendees?: GoogleEventAttendee[];
  reminders: {
    useDefault: boolean;
  };
  eventType: 'default';
  extendedProperties?: GoogleEventExtendedProperties;
  conferenceData?: GoogleEventConferenceData;
}

export interface GoogleEventsResponse {
  kind: 'calendar#events';
  etag: string;
  summary: Email;
  updated: DateTime;
  timeZone: TimeZone;
  accessRole: 'owner';
  defaultReminders: [
    {
      method: 'popup';
      minutes: number; // observed to be 10
    }
  ];
  nextSyncToken: string;
  items: GoogleEventResponse[];
}

export interface CreateGoogleEventRequest {
  summary?: GoogleEventResponse['summary'];
  start: GoogleEventResponse['start'];
  end: GoogleEventResponse['end'];
  attendees: GoogleEventResponse['attendees'];
}
export interface GoogleItemId {
  id: string;
}
export interface GoogleTimeFrame {
  start: string | Date;
  end: string | Date;
}
export interface GoogleStringTimeFrame {
  start: string;
  end: string;
}

export interface GetGoogleResourceSchedulesRequest {
  items: GoogleItemId[];
  timeMin: Date;
  timeMax: Date;
}
export interface GoogleUser {
  id: string;
  email: Email;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: GoogleAssetUrl;
  locale: Locale;
  hd: string; // the host of the users email, "code.berlin" for code members
}
export interface GoogleResourceSchedule {
  busy: GoogleStringTimeFrame[];
}
export interface GoogleResourceScheduleResponse {
  kind: 'calendar#freeBusy';
  timeMin: DateTime;
  timeMax: DateTime;
  // maps the email of a resource (aka room) to its schedule
  calendars: Record<Email, GoogleResourceSchedule>;
}

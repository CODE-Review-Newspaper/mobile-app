// summary is basically the title (Optional because google will create an event without a title)
// attendees must contain the calender ID's of the rooms (or also called mails)
// attendees can also contain non room mails, but they need to be entered correctly

export type email = string;

export interface CreateEventRequest {
  summary?: string;
  start: Time;
  end: Time;
  attendees: Attendee[];
}

export interface Time {
  dateTime: Date;
  timeZone: string;
}

export interface Attendee {
  email: email;
}

export interface CheckBusyRoomRequest {
  items: ItemID[];
  timeMin: Date;
  timeMax: Date;
}

export interface ItemID {
  id: email;
}

export interface TimeFrame {
  start: Date;
  end: Date;
}

export type BusyRooms = TimeFrame;

export type url = string;

export interface User {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string; // url
  locale: string; // en, de
  hd: string; // code.berlin
}

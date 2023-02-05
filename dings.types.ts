
// summary is basically the title (Optional because google will create an event without a title)
// attendees must contain the calender ID's of the rooms (or also called mails)
// attendees can also contain non room mails, but they need to be entered correctly

export type email = string

export interface CreateEventRequest {
    summary?: string
    start: Time
    end: Time
    attendees: Attendee[]
}

export interface Time{
    dateTime: Date,
    timezone: string
}

export interface Attendee {
    email: email
}


export interface CheckBusyRoomRequest {
    items: ItemID[]
    timeMin: string
    timeMax: string
}

export interface ItemID {
    id: email
}

export interface TimeFrame {
    start: string
    end: string
}

export type BusyRooms = TimeFrame
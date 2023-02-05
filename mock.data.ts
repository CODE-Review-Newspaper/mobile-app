import { CheckBusyRoomRequest, CreateEventRequest, Time, TimeFrame } from "./dings.types"

export const timeframe1: TimeFrame = {
    "start": new Date("2023-02-10T10:00:00Z"),
    "end": new Date("2023-02-10T10:45:00Z")
}

export const timeframe2: TimeFrame = {
    "start": new Date("2023-02-10T13:00:00Z"),
    "end": new Date("2023-02-10T15:00:00Z")
}

export const timeFrames = [timeframe1, timeframe2]

export const timestart: Time = {
    'dateTime': new Date('2023-02-10T14:00:00'),
    'timeZone': 'Europe/Zurich'
}

export const timeend: Time = {
    'dateTime': new Date('2023-02-10T16:00:00'),
    'timeZone': 'Europe/Zurich'
}


export const eventMock: CreateEventRequest = {
    'summary': 'TestDingsd',
    'start': {
        'dateTime': new Date('2023-02-12T14:00:00'),
        'timeZone': 'Europe/Zurich'
    },
    'end': {
        'dateTime': new Date('2023-02-12T16:00:00'),
        'timeZone': 'Europe/Zurich'
    },
    'attendees': [
        { 'email': 'code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com' },
    ],
}
// weg so machen
export const busyRoomMock: CheckBusyRoomRequest = {
    "items": [
        {
            "id": "code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com"
        }
    ],
    "timeMin": new Date("2023-02-12T00:00:00+01:00"),
    "timeMax": new Date("2023-02-12T23:00:00+01:00")
}
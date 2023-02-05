import * as React from "react"
import { BusyRooms, CheckBusyRoomRequest, CreateEventRequest, Time, TimeFrame } from "../dings.types"
import { url } from "../dings.types"
import { fetchData } from "./wrapper"

export default function bookRoomsController() {

    async function createNewEvent(eventBody: CreateEventRequest, roomBusyBody: CheckBusyRoomRequest) {
        const url: url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

        const data: CreateEventRequest = eventBody || {
            'summary': 'TestDingsd',
            'start': {
                'dateTime': '2023-02-10T14:00:00',
                'timeZone': 'Europe/Zurich'
            },
            'end': {
                'dateTime': '2023-02-10T16:00:00',
                'timeZone': 'Europe/Zurich'
            },
            'attendees': [
                { 'email': 'code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com' },
            ],
        }
        // weg so machen
        const testobj: CheckBusyRoomRequest = {
            "items": [
                {
                    "id": "code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com"
                }
            ],
            "timeMin": "2023-02-10T00:00:00+01:00",
            "timeMax": "2023-02-10T23:00:00+01:00"
        }

        const [errorRooms, roomTimes] = await checkRoomAvailability( roomBusyBody || testobj)

        if (errorRooms != null)
            return [errorRooms, null] as const

        const eventStart = data.start
        const eventEnd = data.end

        const confirmation = compareTimeFrames(roomTimes, eventStart, eventEnd)

        if (!confirmation) {
            const errorMsg = "No Available Time haher."
            return [errorMsg, null] as const
        }

        const [error, response] = await fetchData(url, true, data)

        if (error != null)
            return [error, null] as const

        const content = await response!.json()

        const successMsg = "Successfully booked a room."

        return [error, successMsg] as const
    }


    async function checkRoomAvailability(body: CheckBusyRoomRequest) {
        const url: url = "https://www.googleapis.com/calendar/v3/freeBusy"

        const data: CheckBusyRoomRequest = body 
        const [error, response] = await fetchData(url, true, data)

        if (error!= null) 
            return [error, null] as const
        

        const content = await response!.json()

        const roomBusyTimes: BusyRooms[] = content.calendars[body.items[0].id].busy

        return [null, roomBusyTimes] as const
    }


    function compareTimeFrames(roomTimes: TimeFrame[], eventTimeStart: Time, eventTimeEnd: Time) {
        if (roomTimes) {
            return true
        }
        return false
    }

    return [];
}
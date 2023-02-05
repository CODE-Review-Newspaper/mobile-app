import * as React from "react"
import { BusyRooms, CheckBusyRoomRequest, CreateEventRequest, Time, TimeFrame } from "../types/dings.types"
import { url } from "../types/dings.types"
import { fetchData } from "./wrapper"
import userLoginController from "./userLogin.controller"



export default function bookRoomsController() {
    const [user, signIn, isLoggedIn, getAuthState]= userLoginController()

    async function createNewEvent(eventBody: CreateEventRequest, roomBusyBody: CheckBusyRoomRequest) {

        const url: url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

        const [errorRooms, roomTimes] = await checkRoomAvailability(roomBusyBody)

        if (errorRooms != null)
            return [errorRooms, null] as const

        const eventStart = eventBody.start
        const eventEnd = eventBody.end

        const confirmation = compareTimeFrames(roomTimes, eventStart, eventEnd)

        if (!confirmation) {
            const errorMsg = "No Available Time haher."
            return [errorMsg, null] as const
        }

        const [error, response] = await fetchData(url, await getAuthState(), true, eventBody)

        if (error != null)
            return [error, null] as const

        const content = await response!.json()

        const successMsg = "Successfully booked a room."

        return [error, successMsg] as const
    }


    async function checkRoomAvailability(body: CheckBusyRoomRequest) {

        const url: url = "https://www.googleapis.com/calendar/v3/freeBusy"

        const [error, response] = await fetchData(url, await getAuthState(), true, body)

        if (error != null)
            return [error, null] as const

        const content = await response!.json()

        const email = body.items[0].id

        const roomBusyTimes: BusyRooms[] = content.calendars[email].busy

        return [null, roomBusyTimes] as const
    }


    function compareTimeFrames(roomTimes: TimeFrame[], eventTimeStart: Time, eventTimeEnd: Time) {
        for (let time of roomTimes) {
            if (typeof time.start === "string"){
                time.start = new Date(time.start)
            }
            if (typeof time.end === "string"){
                time.end = new Date(time.end)
            }
            console.log(roomTimes)
            console.log(eventTimeStart)
            console.log(eventTimeEnd)
            if (time.start <= eventTimeStart.dateTime || time.end >= eventTimeEnd.dateTime) {
                console.log("dsings")
                return false
            }
        }
        console.log("DONGS")
        return true
    }

    return [compareTimeFrames, createNewEvent, checkRoomAvailability] as const;
}
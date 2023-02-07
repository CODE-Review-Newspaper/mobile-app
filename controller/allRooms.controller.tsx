import dayjs from "dayjs"

import { rooms } from "../data/rooms.data"
import { BusyRooms, CheckBusyRoomRequest } from "../types/dings.types"
import bookRoomsController from "./booking.controller"

export interface Room {
    id: string | null
    displayName: string
    factoryRoomNumber: string | null
    bookable: "BOOKABLE" | "UNBOOKABLE" | "APPLICATION_REQUIRED" | "TEAM_ONLY"
    busyTimes?: BusyRooms[]
    category: "LEARNING_UNITS" | "PROJECT_ROOM" | "MEETING_ROOM" | "TEAM_HQ" | "PROJECT_LAB" | "SILENT_SPACE" | "STUDIO" | "OFFICE_BOOTH" | "WORKSPACES" | "LIBRARY"
}
export default function allRoomsController() {
    const { checkRoomAvailability } = bookRoomsController()

    async function getBusyTimeOfRooms() {

        const newRooms = Object.fromEntries(await Promise.all(Object.entries(rooms).map(async ([key, room]) => {

            if (!(room.bookable === "BOOKABLE" && room.id != null)) return [key, room]

            const newBody: CheckBusyRoomRequest = {
                items: [
                    {
                        id: room.id,
                    },
                ],
                timeMin: dayjs().startOf("day").toDate(),
                timeMax: dayjs().endOf("day").add(7, "days").toDate(),
            }
            const [error, busyTimes] = await checkRoomAvailability(newBody)

            if (error != null) {

                console.error("error inside checkRoomAvailability:", error)

                return [key, room]
            }
            const newRoom = {
                ...room,
                busyTimes,
            }
            return [key, newRoom]
        })))
        return [null, newRooms] as const
    }
    return { getBusyTimeOfRooms }
}
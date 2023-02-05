import { rooms } from "../data/rooms.data"
import { BusyRooms, CheckBusyRoomRequest } from "../types/dings.types"
import bookRoomsController from "./booking.controller"

export interface Rooms {
    id: string
    displayName?: string
    factoryRoomNumber?: number
    isBookable?: boolean
    facultyRoom?: boolean
    busyTimes?: BusyRooms[]
    category?: "LEARNING_UNITS" | "PROJECT_ROOM" | "MEETING_ROOM" | "TEAM_HQ" | "PROJECT_LAB" | "SILENT_SPACE" | "STUDIO" | "OFFICE_BOOTH" | "WORKSPACES"

}
export default function allRoomsController() {
    const [compareTimeFrames, createNewEvent, checkRoomAvailability] = bookRoomsController()

    async function getBusyTimeOfRooms() {
        for (const [key, value] of Object.entries(rooms)) {
            if (value.isBookable) {
                const beginOfDay = new Date("2023-02-10")
                beginOfDay.setUTCHours(0)
                beginOfDay.setUTCMinutes(0)
                beginOfDay.setUTCSeconds(0)
                const endOfDay = new Date("2023-02-10")
                endOfDay.setUTCHours(23)
                endOfDay.setUTCMinutes(59)
                endOfDay.setUTCSeconds(59)
                const newBody: CheckBusyRoomRequest = {
                    items: [
                        {
                            id: value.id
                        }
                    ],
                    timeMin: beginOfDay,
                    timeMax: endOfDay
                }

                const [error, roomTimes] = await checkRoomAvailability(newBody)

                if (error != null) 
                    console.log("Could not find Busy times of Room. ", error)

                value.busyTimes = roomTimes!
                
            }
            
        }
        console.log(JSON.stringify(rooms))
    }
    return [getBusyTimeOfRooms] as const
}
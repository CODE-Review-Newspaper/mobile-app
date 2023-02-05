
export interface Rooms {
    id: string
    displayName?: string
    factoryRoomNumber?: number
    isBookable?: boolean
    facultyRoom?: boolean
    busyTimes?: string
    category?: "LEARNING_UNITS" | "PROJECT_ROOM" | "MEETING_ROOM" | "TEAM_HQ" | "PROJECT_LAB" | "SILENT_SPACE" | "STUDIO" | "OFFICE_BOOTH" | "WORKSPACES"

}
export default function allRoomsController () {

    return(
        true
    )
}
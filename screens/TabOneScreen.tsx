import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';


import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { BusyRooms, CheckBusyRoomRequest, CreateEventRequest, Time, TimeFrame, url } from "../dings.types";
import userLoginController from "../conotrller/userLogin.controller";

WebBrowser.maybeCompleteAuthSession()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [authState, user, promptAsync, request] = userLoginController()
    // const [authState, setAuthState] = React.useState<AuthSession.TokenResponse | null>(null)
    // const [user, setUser] = React.useState(null)
    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    //     clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
    //     iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
    //     androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",
    //     scopes: ["https://www.googleapis.com/auth/calendar", "https://apps-apis.google.com/a/feeds/calendar/resource/", "https://www.googleapis.com/auth/admin.directory.resource.calendar"]
    // })

    // async function ensureAuth() {
    //     // console.log("refresh check")
    //     if (authState?.shouldRefresh()) {
    //         // console.log("SACHE WIRD REFRESHIERT!!!!!!!!!!!1111!")
    //         //lol wenn lol
    //         setAuthState(await authState.refreshAsync({
    //             clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
    //         }, Google.discovery))
    //     }
    // }

    // React.useEffect(() => {
    //     if (response?.type === "success") {
    //         // console.log(response.authentication)
    //         setAuthState(response.authentication)

    //         if (authState?.accessToken != null) fetchUserInfo()
    //     }
    // }, [response])

    // async function fetchData(urlToFetchFrom: url, postRequest: any = false, body: any = {}) {
    //     let request;
    //     const data = body
    //     if (postRequest) {
    //         request = {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${authState?.accessToken}`
    //             },
    //             body: JSON.stringify(data)
    //         }
    //     } else{
    //         request = {
    //             headers: {
    //                 Authorization: `Bearer ${authState?.accessToken}`
    //             }
    //         }
    //     }
    //     await ensureAuth()
    //     try {
    //         let response;

    //         if (request != null)
    //             response = await fetch(urlToFetchFrom, request)
    //         else
    //             response = await fetch(urlToFetchFrom)

    //         return [null, response] as const
    //     } catch (error) {
    //         return [error, null] as const
    //     }
    // }

    // async function fetchUserInfo() {
    //     const [errorUserData, responseUserData] = await fetchData("https://www.googleapis.com/userinfo/v2/me")
    //     const userInfo = await responseUserData!.json();
    //     setUser(userInfo)

    //     // const [errorCalender, responseCalender] = await fetchData("https://www.googleapis.com/calendar/v3/users/me/calendarList", request)
    //     // const calenderInfo = await responseCalender!.json()
    //     // console.log("calandERRRR", JSON.stringify(calenderInfo))


    //     // await createNewEvent()
    //     // weg so machen
    //     const testobj = {
    //         "items": [
    //             {
    //                 "id": "code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com"
    //             }
    //         ],
    //         "timeMin": "2023-02-10T00:00:00+01:00",
    //         "timeMax": "2023-02-10T23:00:00+01:00"
    //     }
    //     await checkRoomAvailability(testobj)
    // }

    // function compareTimeFrames(roomTimes: TimeFrame[], eventTimeStart: Time, eventTimeEnd: Time) {
    //     if (roomTimes) {
    //         return true
    //     }
    //     return false
    // }

    // async function createNewEvent(eventBody: CreateEventRequest, roomBusyBody: CheckBusyRoomRequest) {
    //     const url: url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

    //     const data: CreateEventRequest = eventBody || {
    //         'summary': 'TestDingsd',
    //         'start': {
    //             'dateTime': '2023-02-10T14:00:00',
    //             'timeZone': 'Europe/Zurich'
    //         },
    //         'end': {
    //             'dateTime': '2023-02-10T16:00:00',
    //             'timeZone': 'Europe/Zurich'
    //         },
    //         'attendees': [
    //             { 'email': 'code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com' },
    //         ],
    //     }
    //     // weg so machen
    //     const testobj: CheckBusyRoomRequest = {
    //         "items": [
    //             {
    //                 "id": "code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com"
    //             }
    //         ],
    //         "timeMin": "2023-02-10T00:00:00+01:00",
    //         "timeMax": "2023-02-10T23:00:00+01:00"
    //     }

    //     const [errorRooms, roomTimes] = await checkRoomAvailability( roomBusyBody || testobj)

    //     if (errorRooms != null)
    //         return [errorRooms, null] as const

    //     const eventStart = data.start
    //     const eventEnd = data.end

    //     const confirmation = compareTimeFrames(roomTimes, eventStart, eventEnd)

    //     if (!confirmation) {
    //         const errorMsg = "No Available Time haher."
    //         return [errorMsg, null] as const
    //     }

    //     const [error, response] = await fetchData(url, true, data)

    //     if (error != null)
    //         return [error, null] as const

    //     const content = await response!.json()

    //     const successMsg = "Successfully booked a room."

    //     return [error, successMsg] as const
    // }


    // async function checkRoomAvailability(body: CheckBusyRoomRequest) {
    //     const url: url = "https://www.googleapis.com/calendar/v3/freeBusy"

    //     const data: CheckBusyRoomRequest = body 
    //     const [error, response] = await fetchData(url, true, data)

    //     if (error!= null) 
    //         return [error, null] as const
        

    //     const content = await response!.json()

    //     const roomBusyTimes: BusyRooms[] = content.calendars[body.items[0].id].busy

    //     return [null, roomBusyTimes] as const
    // }

    const ShowUserInfo = () => {
        if (user) {
            return (
                <View>
                    <Text>Sack</Text>
                    <Text>{user?.name}</Text>
                </View>
            )
        }
        return null
    }

    return (
        <View>
            {user && <ShowUserInfo />}
            {user === null &&
                <TouchableOpacity
                    disabled={!request}
                    onPress={async () => {
                        promptAsync()
                    }}
                >
                    <Text>Nacken</Text>
                </TouchableOpacity>
            }
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

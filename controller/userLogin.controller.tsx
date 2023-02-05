import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';
import { fetchData } from "./wrapper";
import { User } from "../dings.types";
import bookRoomsController from "./booking.controller";
import { busyRoomMock, eventMock } from "../mock.data";

WebBrowser.maybeCompleteAuthSession()

export default function userLoginController() {
    const [authState, setAuthState] = React.useState<AuthSession.TokenResponse | null>(null)

    const [user, setUser] = React.useState<User | null>(null)

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
        iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
        androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",
        scopes: ["https://www.googleapis.com/auth/calendar"]
    })

    const signIn = () => promptAsync()

    const [compareTimeFrames, createNewEvent] = bookRoomsController()

    async function ensureAuth() {
        if (authState?.shouldRefresh()) {
            setAuthState(await authState.refreshAsync({
                clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
            }, Google.discovery))
        }
    }

    React.useEffect(() => {
        if (response?.type === "success") {
            if (response.authentication?.accessToken !== authState?.accessToken) {
                setAuthState(response.authentication)
            } else {
                if (authState?.accessToken != null) fetchUserInfo()
            }
        }
    }, [response, authState?.accessToken])

    async function fetchUserInfo() {
        await ensureAuth()
        const [errorUserData, meRes] = await fetchData("https://www.googleapis.com/userinfo/v2/me", authState)
        const userInfo: User = await meRes!.json();
        setUser(userInfo)
    }

    async function callCreateEvent(){
        createNewEvent(eventMock, busyRoomMock, authState)
    }

    return [authState, user, signIn, request, callCreateEvent] as const
    
}
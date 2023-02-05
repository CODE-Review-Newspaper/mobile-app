import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';
import { fetchData } from "./wrapper";
import { User } from "../dings.types";
import bookRoomsController from "./booking.controller";
import { busyRoomMock, eventMock } from "../mock.data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TokenResponse, TokenResponseConfig} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession()

export default function userLoginController() {

    const [user, setUser] = React.useState<User | null>(null)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
        iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
        androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",
        scopes: ["https://www.googleapis.com/auth/calendar"]
    })
    const signIn = async () => {
        console.log(JSON.stringify(await getAuthState(), null, 2));
        if (!await isLoggedIn()) {
            await promptAsync()

            fetchUserInfo()
        }
    }

    async function isLoggedIn() {
        const authState = await getAuthState();

        const loggedIn = authState != null && await ensureAuth();

        if (loggedIn) {
            fetchUserInfo()
        }

        return loggedIn
    }

    async function getAuthState(): Promise<TokenResponse | null> {
        const jsonValue = await AsyncStorage.getItem('@authState')
        const obj: TokenResponseConfig = JSON.parse(jsonValue!);
        return obj != null ? new AuthSession.TokenResponse(obj) : null;
    }

    async function setAuthState(authState: TokenResponse | null) {
        const jsonValue = JSON.stringify(authState != null ? authState.getRequestConfig() : null)
        await AsyncStorage.setItem('@authState', jsonValue)
    }

    const [compareTimeFrames, createNewEvent] = bookRoomsController()

    async function ensureAuth() {
        const authState = await getAuthState();

        if (authState === null) {
            return false
        }

        if ((authState.shouldRefresh())) {
            console.log("refreshing")
            const refresh = await authState.refreshAsync({
                clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
            }, Google.discovery);

            if (refresh.accessToken === undefined) {
                return false;
            }

            await setAuthState(refresh)
        }

        return true
    }

    React.useEffect(() => {
        if (response?.type === "success") {
            setAuthState(response.authentication)
        }
    }, [response])

    async function fetchUserInfo() {
        console.log("user fetch")
        //await ensureAuth()
        const [errorUserData, meRes] = await fetchData("https://www.googleapis.com/userinfo/v2/me", await getAuthState())
        const userInfo: User = await meRes!.json();
        setUser(userInfo)
    }

    async function callCreateEvent(){
        createNewEvent(eventMock, busyRoomMock, await getAuthState())
    }

    return [user, signIn, isLoggedIn, getAuthState, callCreateEvent] as const

}
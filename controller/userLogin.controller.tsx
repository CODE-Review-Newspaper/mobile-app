import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';
import { fetchData } from "./wrapper";
import { User } from "../types/dings.types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenError, TokenResponse, TokenResponseConfig } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession()

export default function userLoginController() {
    const [user, setUser] = React.useState<User | null>(null)

    const [isSignedIn, setIsSignedIn] = React.useState(true)

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

    const signOut = async () => {

        if (await isLoggedIn(false)) {
            const authState = await getAuthState();

            if (authState != null) {
                await AuthSession.revokeAsync({ token: authState.accessToken }, Google.discovery)
                console.log("revoked")
            }
        }

        await setAuthState(null)
        setUser(null)

        setIsSignedIn(false)
    }

    async function isLoggedIn(fetchUser = true) {
        const authState = await getAuthState();

        const loggedIn = authState != null && await autoRenewAuth();

        if (loggedIn && fetchUser) {
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
        if (authState == null) {
            await AsyncStorage.removeItem('@authState')
            setIsSignedIn(false)
        } else {

            const jsonValue = JSON.stringify(authState.getRequestConfig())
            await AsyncStorage.setItem('@authState', jsonValue)

            setIsSignedIn(true)
        }
    }

    async function autoRenewAuth() {
        const authState = await getAuthState();

        if (authState === null) {
            return false
        }

        if ((authState.shouldRefresh())) {
            console.log("refreshing")
            try {
                const refresh = await authState.refreshAsync({
                    clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
                    clientSecret: "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"
                }, Google.discovery);

                if (refresh.accessToken === undefined) {
                    return false;
                }

                await setAuthState(refresh)
            } catch (e) {
                if (e instanceof TokenError) {
                    if (e.code === 'invalid_grant') {
                        console.log("invalid grant, prompting for new grant")

                        await setAuthState(null)
                        await signIn()
                    }
                }
                console.log(JSON.stringify(e, null, 2))
            }
        }
        return true
    }

    React.useEffect(() => {
        if (response?.type === "success") {

            setAuthState(response.authentication).then(() => setIsSignedIn(true))
        }
    }, [response])

    async function fetchUserInfo() {

        const [errorUserData, meRes] = await fetchData("https://www.googleapis.com/userinfo/v2/me", await getAuthState())

        if (errorUserData != null) console.error("error trying to fetchUserInfo:", errorUserData)

        const userInfo: User = await meRes!.json();

        setUser(userInfo)
    }
    React.useEffect(() => {
        isLoggedIn()
    }, [])

    // TODO: replace user != null by isSignedIn
    return [user, signIn, user != null, getAuthState, signOut] as const

}
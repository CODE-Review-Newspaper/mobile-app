import * as React from "react"
import * as WebBroswer from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';

import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

WebBroswer.maybeCompleteAuthSession()

type url = string

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [authState, setAuthState] = React.useState<AuthSession.TokenResponse | null>(null)
    const [user, setUser] = React.useState(null)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
        iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
        androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",
        scopes: ["https://www.googleapis.com/auth/calendar", "https://apps-apis.google.com/a/feeds/calendar/resource/"]
    })

    async function ensureAuth() {
        console.log("refresh check")
        if (authState?.shouldRefresh()) {
            console.log("SACHE WIRD REFRESHIERT!!!!!!!!!!!1111!")
            //lol wenn lol
            setAuthState(await authState.refreshAsync({
                clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
            }, Google.discovery))
        }
    }

    React.useEffect(() => {
        if (response?.type === "success") {
            console.log(response.authentication)
            setAuthState(response.authentication)

            if (authState?.accessToken != null) fetchUserInfo()
        }
    }, [response])

    async function fetchData(urlToFetchFrom: url, headerAuth: any = null) {
        await ensureAuth()
        try {
            let response;

            if (headerAuth != null)
                response = await fetch(urlToFetchFrom, {
                    headers: {
                        Authorization: `Bearer ${headerAuth}`
                    }
                })
            else
                response = await fetch(urlToFetchFrom)

            return [null, response] as const
        } catch (error) {
            return [error, null] as const
        }
    }

    async function fetchUserInfo() {
        console.log("at1", authState?.accessToken)
        console.log("at2", authState?.accessToken);

        const [errorUserData, responseUserData] = await fetchData("https://www.googleapis.com/userinfo/v2/me", authState?.accessToken)
        const userInfo = await responseUserData!.json();
        console.log("usersache", JSON.stringify(userInfo))
        setUser(userInfo)

        const [errorCalender, responseCalender] = await fetchData("https://www.googleapis.com/calendar/v3/users/me/calendarList", authState?.accessToken)
        const calenderInfo = await responseCalender!.json()
        console.log("calandERRRR", JSON.stringify(calenderInfo))

        const [errorCalResource, responseCalResource] = await fetchData(`https://admin.googleapis.com/admin/directory/v1/customer/my_customer/resources/calendars/`, authState?.accessToken)
        const calResource = await responseCalResource!.json()
        console.log("RESORUCE", JSON.stringify(calResource))

    }

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
                    onPress={() => {
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

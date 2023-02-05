import * as React from "react"
import * as WebBroswer from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSession from 'expo-auth-session';

import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Function } from "@babel/types";

WebBroswer.maybeCompleteAuthSession()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    //const [accessToken, setAccessToken] = React.useState(null)
    const [authState, setAuthState] = React.useState<AuthSession.TokenResponse | null>(null)
    const [tokenResponse, setTokenResponse] = React.useState<AuthSession.TokenResponse | null>(null)

    const [user, setUser] = React.useState(null)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
        iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
        androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",

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

    async function fetchUserInfo() {
        console.log("at1", authState?.accessToken)
        await ensureAuth()
        console.log("at2", authState?.accessToken);
        let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${authState?.accessToken}`
            }
        }).catch((error) => {
            console.log(authState?.accessToken)
            console.log(error)
        })
        //console.log("JANNES SACK\n\n\n", await response.json())

        let response2 = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            headers: {
                Authorization: `Bearer ${authState?.accessToken}`
            }
        }).catch((error) => {
            console.log(authState?.accessToken)
            console.log(error)
        })
        const userInfo = await response.json();
        console.log("usersache", JSON.stringify(userInfo))
        console.log("calandAR", JSON.stringify(await response2.json()))

        setUser(userInfo)
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

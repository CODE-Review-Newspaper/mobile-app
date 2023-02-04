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
    Google.useAuthRequest()
    const [user, setUser] = React.useState(null)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",
        iosClientId: "614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com",
        androidClientId: "614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com",

    })

    async function ensureAuth() {
        // const nowTime = Math.floor(Date.now() / 1000)

        // console.log(nowTime)
        // console.log(authState?.expiresAt)

        // if (nowTime > authState?.expiresAt!) {
        //     //hoppps brauchen wa so neudings
        //     const refreshResult = new AuthSession.RefreshTokenRequest({
        //         refreshToken: authState?.refreshToken,
        //         clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com"
        //     }).performAsync(Google.discovery);

        //     console.log(refreshResult)


        // }

        console.log("SACHE WIRD REFRESHIERT!!!!!!!!!!!1111!")

        if (authState?.shouldRefresh()) {
            //lol wenn lol
            setAuthState(await authState.refreshAsync({
                clientId: "614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com",

            }, Google.discovery))
        }
    }

    React.useEffect(() => {
        if (response?.type === "success") {
            console.log(response.authentication)
            setAuthState(response.authentication)
            // setAuthState({
            //     accessToken: response.authentication?.accessToken!,
            //     expiresAt: response.authentication?.issuedAt! + response.authentication?.expiresIn!,
            //     refreshToken: response.authentication?.refreshToken!,
            //     sache: response.authentication
            // })
            if (authState?.accessToken != null) fetchUserInfo()
        }
    }, [response])

    async function fetchUserInfo() {
        let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((error) => {
            console.log(accessToken)
            console.log(error)
        })
        //console.log("JANNES SACK\n\n\n", await response.json())

        let response2 = await fetch("https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((error) => {
            console.log(accessToken)
            console.log(error)
        })
        console.log(JSON.stringify(await response2.json()))
        const userInfo = JSON.stringify(await response.json())

        setUser(userInfo)
    }

    const ShowUserInfo = () => {
        if (user) {
            return (
                <View>
                    <Text>Sack</Text>
                    <Text>{user.name}</Text>
                </View>
            )
        }
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

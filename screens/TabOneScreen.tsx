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

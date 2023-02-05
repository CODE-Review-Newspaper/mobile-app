import * as React from "react"
import * as WebBrowser from "expo-web-browser"


import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import userLoginController from "../controller/userLogin.controller";
import {useEffect} from "react";
import bookRoomsController from "../controller/booking.controller";
import { busyRoomMock, eventMock, timeFrames, timeend, timestart } from "../mock.data";

WebBrowser.maybeCompleteAuthSession()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [user, signIn, isLoggedIn] = userLoginController()
    const [compareTimeFrames, createNewEvent] = bookRoomsController()

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
    useEffect(() => {
        isLoggedIn()
    }, [])

    return (
        <View>
            {user && <Text>user so dings</Text>}
            {user && <ShowUserInfo />}
            {user == null &&
                <TouchableOpacity
                    onPress={async () => {
                        await signIn()
                    }}
                >
                    <Text>Nacken</Text>
                </TouchableOpacity>
            }
            {user &&
                <TouchableOpacity
                    onPress={async () => {
                        compareTimeFrames(timeFrames, timestart, timeend)
                    }}
                >
                    <Text>Nacken</Text>
                </TouchableOpacity>
            }
            {user &&
                <TouchableOpacity
                    onPress={async () => {
                        console.log("GENIAL!")
                        console.log("KLASSE!")
                    }}
                >
                    <Text>NUR WENN NACKEN</Text>
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

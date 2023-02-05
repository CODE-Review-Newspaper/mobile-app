import * as React from "react"
import * as WebBrowser from "expo-web-browser"


import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import userLoginController from "../controller/userLogin.controller";
import {useEffect} from "react";
import bookRoomsController from "../controller/booking.controller";
import { busyRoomMock, eventMock, timeFrames, timeend, timestart } from "../mock.data";
import allRoomsController from "../controller/allRooms.controller";

WebBrowser.maybeCompleteAuthSession()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [user, signIn, isLoggedIn, stupid, signOut] = userLoginController()
    const [compareTimeFrames, createNewEvent] = bookRoomsController()
    const [getBusyTimeOfRooms] = allRoomsController()

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
                        createNewEvent(eventMock, busyRoomMock)
                    }}
                >
                    <Text>NUR WENN NACKEN</Text>
                </TouchableOpacity>
            }
            {user &&
                <TouchableOpacity
                    onPress={async () => {
                        await signOut()
                    }}
                >
                    <Text>Ich wenn ich den logaus durchführen werde</Text>
                </TouchableOpacity>
            }
            {user &&
                <TouchableOpacity
                    onPress={async () => {
                        await getBusyTimeOfRooms()
                    }}
                >
                    <Text>DingsListe</Text>
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

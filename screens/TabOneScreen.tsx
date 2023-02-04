import * as React from "react"
import * as WebBroswer from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import {config} from "dotenv"


import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

WebBroswer.maybeCompleteAuthSession()
config()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [accessToken, setAccessToken] = React.useState(null)
    const [user, setUser] = React.useState(null)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.CLIENT_ID,
        iosClientId: process.env.IOS_CLIENT_ID,
        androidClientId: process.env.ANDROID_CLIENT
    })
     
    React.useEffect(() => {
        if (response?.type === "success"){
            setAccessToken(response.authentication.accessToken)
            accessToken && fetchUserInfo()
        }
    }, [response, accessToken])

    async function fetchUserInfo(){
        let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((error) => {
            console.log(accessToken)
            console.log(error)
        })
        const userInfo = await response.json()
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
        disabled ={!request}
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

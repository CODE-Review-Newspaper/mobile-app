import { Button, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Floorplan from '../assets/images/floorplan/base.svg';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import Rooms from "../components/Rooms"

import Slider from '@react-native-community/slider';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

    const [text, setText] = useState("not clicked")

    const [value, setValue] = useState(0)

    return (
        // <ScrollView contentContainerStyle={styles.container}>

        <ReactNativeZoomableView
            zoomEnabled={true}
            maxZoom={2}
            minZoom={1}
            zoomStep={0.25}
            initialZoom={1}
            bindToBorders={true}
            // onZoomAfter={this.logOutZoomState}
            style={styles.container}
        >

            {/* <View style={styles.header}>

        <Text style={styles.title}>Tab One</Text>
        <Logo style={styles.logo} height="100" />
      </View> */}
            {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#ff6961"
                maximumTrackTintColor="white"
                onValueChange={e => setValue(e)}
            />
            <View style={styles.dings}>

                <Floorplan
                    width="100%"
                    height="100%"
                    style={styles.floorplan}
                    fill="white"
                />

                {Object.values(Rooms).map(i => <i.Component
                    key={i.name}
                    width="100%"
                    height="100%"
                    style={styles.floorplan}
                    fill={["#68c13a", "#e5a23c", "#f66b6e", "#efefef"][Math.floor(Math.random() * 4)]}
                    // @ts-ignore
                    onPress={() => { setText("clicked " + i.name); navigation.navigate('Modal') }
                    }
                />)}

            </View>
            {/* </ScrollView> */}
        </ReactNativeZoomableView>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: "white",
        fontWeight: "900",
        fontSize: 16,
    },
    button: {
        paddingHorizontal: 32,
        height: 48,
        backgroundColor: "#FF6961",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    dings: {
        position: "relative",
        width: "150%",
        height: "100%",
        transform: [{ rotate: "-90deg" }],
        backgroundColor: "transparent",
    },
    sache: {
        color: "#222",
    },
    logo: {

        height: "10rem",
    },
    header: {
        width: "100%",
        height: "100%",
        backgroundColor: "#222",
    },
    floorplan: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#222",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#222",

        margin: 0,
        padding: 0,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

import { StyleSheet } from 'react-native';
import { useContext } from 'react';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Floorplan from '../assets/images/floorplan/base.svg';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import Rooms from "../components/Rooms"

import Slider from '@react-native-community/slider';
import CalendarContext from '../contexts/calendar.context';

import LinearGradient from 'react-native-linear-gradient';

import dayjs from "dayjs"

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

    const { setSelectedRoomId, startDate, selectedDate, setSelectedDate, roomSchedules } = useContext(CalendarContext)

    return (
        <>
            <LinearGradient colors={["rgba(0, 0, 0, 0.8)", "transparent"]} style={styles.toolBar}>

                <Text style={styles.timeDisplay}>{selectedDate.format("MMM D, hh:mma")}</Text>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    step={1 / 12 / 4}
                    minimumTrackTintColor="#ff6961"
                    maximumTrackTintColor="white"
                    onValueChange={numberBetween0and1 => setSelectedDate(startDate.add(numberBetween0and1 * 12, "hours"))}
                />

            </LinearGradient>

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


                <View style={styles.dings}>

                    <Floorplan
                        width="100%"
                        height="100%"
                        style={styles.floorplan}
                        fill="white"
                    />

                    {Object.values(Rooms).map(i => {

                        const scheduleInfo = roomSchedules[i.name]

                        if (scheduleInfo != null) console.log(i.name + " found")

                        // @ts-ignore
                        const isUnavailable = scheduleInfo?.busyTimes?.some(i => {

                            console.log("dongs:", i.start, dayjs(i.start).format("DD/MM/YYYY hh:mm"))

                            const isUnavailable = selectedDate.isAfter(dayjs(i.start)) && selectedDate.isBefore(dayjs(i.end))

                            return isUnavailable
                        }) ?? true
                        const isAvailable = !isUnavailable

                        const color = (() => {

                            if (scheduleInfo?.isBookable && isAvailable) return "green"

                            if (scheduleInfo?.isBookable && isUnavailable) return "red"

                            if (!scheduleInfo?.isBookable) return "#efefef"

                            return "#222"
                        })()

                        return <i.Component
                            key={i.name}
                            width="100%"
                            height="100%"
                            style={styles.floorplan}
                            fill={color}
                            // @ts-ignore
                            onPress={() => { setSelectedRoomId(i.name); navigation.navigate('Modal') }
                            }
                        />
                    })}

                </View>
                {/* </ScrollView> */}
            </ReactNativeZoomableView>
        </>
    );
}

const styles = StyleSheet.create({
    toolBar: {
        width: "100%",
        padding: 16,
        alignItems: "center",
        zIndex: 3,
        elevation: 3,
    },
    timeDisplay: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "700",
    },
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
        width: "120%",
        height: "80%",
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

import { StyleSheet, Switch } from 'react-native';
import { useContext, useState } from 'react';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Floorplan from '../assets/images/floorplan/base.svg';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import Rooms from "../components/Rooms"

import Slider from '@react-native-community/slider';
import CalendarContext from '../contexts/calendar.context';

import LinearGradient from 'react-native-linear-gradient';

import SkeletonLoader from "../assets/images/test.svg"

import ErrorTriangle from "../assets/images/errorTriangle.svg"

import dayjs from "dayjs"
import { RoomBookableData, RoomCategoryData, rooms } from '../data/rooms.data';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

    const { setSelectedRoom, startDate, selectedDate, setSelectedDate, roomSchedules } = useContext(CalendarContext)

    const [state, setState] = useState<"ERROR" | "SUCCESS" | "LOADING">("SUCCESS")

    if (state === "LOADING") return <View style={styles.dings}>
        <Floorplan
            width="100%"
            height="100%"
            style={styles.floorplan}
            fill="white"
        />
    </View>

    // return <SkeletonLoader fill="red" width="500" height="500" />

    const [displayMode, setDisplayMode] = useState<"ROOM_TYPE" | "ROOM_AVAILABILITY">("ROOM_AVAILABILITY")

    return (
        <>
            <LinearGradient colors={["rgba(0, 0, 0, 0.8)", "transparent"]} style={styles.toolBar}>

                <Text style={styles.timeDisplay}>{selectedDate.format("MMM D, H:mma")}</Text>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    step={1 / 12 / 4}
                    minimumTrackTintColor="#ff6961"
                    maximumTrackTintColor="white"
                    onValueChange={numberBetween0and1 => setSelectedDate(startDate.add(numberBetween0and1 * 12, "hours"))}
                />
                <Switch

                    onValueChange={e => {

                        setDisplayMode(e ? "ROOM_AVAILABILITY" : "ROOM_TYPE")
                    }}
                    trackColor={{
                        true: "#FF6961",

                    }}
                    value={displayMode === "ROOM_AVAILABILITY"}
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

                    {state === "SUCCESS" && Object.values(Rooms).map(i => {

                        const scheduleInfo = roomSchedules[i.name]

                        // @ts-ignore
                        const isUnavailable = scheduleInfo?.busyTimes?.some(i => {

                            const isUnavailable = selectedDate.isAfter(dayjs(i.start)) && selectedDate.isBefore(dayjs(i.end))

                            return isUnavailable
                        }) ?? true
                        const isAvailable = !isUnavailable

                        const color = (() => {

                            const roomCategory = RoomCategoryData[rooms[i.name].category]

                            const roomBookable = RoomBookableData[rooms[i.name].bookable]

                            if (displayMode === "ROOM_TYPE") return roomCategory?.color

                            if (displayMode === "ROOM_AVAILABILITY") {

                                if (scheduleInfo?.bookable === "BOOKABLE" && isAvailable) return "green"

                                if (scheduleInfo?.bookable === "BOOKABLE" && isUnavailable) return "red"

                                return roomBookable.color

                            }
                            return "#222"
                        })()

                        return <i.Component
                            key={i.name}
                            width="100%"
                            height="100%"
                            style={styles.floorplan}
                            fill={color}
                            // @ts-ignore
                            onPress={() => {

                                if (scheduleInfo == null) return

                                if (!scheduleInfo.isBookable) return

                                setSelectedRoom(scheduleInfo);

                                navigation.navigate('Modal')
                            }
                            }
                        />
                    })}

                </View>
                {state === "ERROR" && <View style={styles.staticOverlay}>
                    <ErrorTriangle fill="red" width="30%" height="30%" />
                </View>}

            </ReactNativeZoomableView>
        </>
    );
}

const styles = StyleSheet.create({
    staticOverlay: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
    },
    toolBar: {
        width: "100%",
        padding: 16,
        paddingTop: 32,
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


// import {
//     Animated,
//     useSharedValue,
//     useAnimatedProps,
//     withTiming
// } from 'react-native-reanimated';
// import Svg, { Path } from 'react-native-svg';

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// export default function App() {
//     const radius = useSharedValue(50);

//     const animatedProps = useAnimatedProps(() => {
//         // draw a circle
//         const path = `
//     M 100, 100
//     m -${radius}, 0
//     a ${radius},${radius} 0 1,0 ${radius * 2},0
//     a ${radius},${radius} 0 1,0 ${-radius * 2},0
//     `;
//         return {
//             d: path
//         };
//     });

//     return null

//     // attach animated props to an SVG path using animatedProps
//     // return <Svg><AnimatedPath animatedProps={animatedProps} fill="black" onPress={() => radius.value = withTiming(Math.random() * 180)} /></Svg>
// }
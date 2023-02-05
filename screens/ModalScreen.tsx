import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import CalendarContext from '../contexts/calendar.context';

export default function ModalScreen() {

  const { selectedRoomId, selectedDate, endDate, setEndDate } = useContext(CalendarContext)

  const DEFAULT_DURATION_MINS = 60
  const MIN_DURATION_MINS = 15
  const MAX_DURATION_MINS = 60 * 6

  useEffect(() => {
    setEndDate(selectedDate.add(DEFAULT_DURATION_MINS, "minutes"))
  }, [])

  // await createNewEvent(eventMock, busyRoomMock)

  return (
    <View style={styles.container}>

      <TextInput
        defaultValue={"Working session in " + selectedRoomId}
        placeholder="Meeting title"
        multiline
        style={styles.titleInput}
      />

      <Text style={styles.text}>[4.11.10] {selectedRoomId}</Text>

      <Text style={styles.text}>{selectedDate.format("H:mma")} - {endDate.format("H:mma")}</Text>

      <Text style={styles.lessText}>{endDate.diff(selectedDate, "minutes")} minutes</Text>



      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 32 }}>
        {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={MIN_DURATION_MINS}
          maximumValue={MAX_DURATION_MINS}
          value={DEFAULT_DURATION_MINS}
          step={15}
          minimumTrackTintColor="#ff6961"
          maximumTrackTintColor="#efefef"

          onValueChange={durationMinutes => setEndDate(selectedDate.add(durationMinutes, "minutes"))}
        />

        <Pressable
          // onPress={signIn}
          style={({ pressed }) => pressed ? [styles.button, styles.buttonPressed] : styles.button}
          accessibilityLabel="Book room"
        >
          <Text style={styles.buttonText}>Book room</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    fontSize: 25,
    fontWeight: "900",
    maxWidth: "66%",
    textAlign: "center",

    color: "#222",

    textDecorationColor: "#ccc",
    textDecorationLine: "underline",
  },
  lessText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  text: {
    color: "#222",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },
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
    width: '66%',
  },
  buttonPressed: {

    transform: [{ scale: 0.95 }],

    backgroundColor: "#fe746a",
  },
  button: {
    // paddingHorizontal: 32,
    height: 48,
    backgroundColor: "#FF6961",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 24,

    width: "100%",

    // borderColor: "black",
    // borderWidth: 1
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});


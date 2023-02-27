import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Switch } from 'react-native';

import PanelSelectInput from '../components/PanelSelectInput';
import { Text, View } from '../components/Themed';
import PreferencesContext from '../contexts/preferences.context';
import UserContext from '../contexts/user.context';
import userLoginController from '../controller/userLogin.controller';
import { TimePickerMode } from '../data/views.data';

export default function SettingsScreen() {
  const { signOut } = useContext(UserContext);
  const { fetchUserEvents } = userLoginController();

  const { user, about } = useContext(UserContext);

  const codeConnectVersion = Constants.manifest?.version ?? 'unknown build';

  const settings = useContext(PreferencesContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {/* <Text style={{ color: '#222', fontWeight: '700' }}>Signed in as </Text> */}
        <Text style={{ color: '#FF6961', fontWeight: '900', fontSize: 32 }}>
          {user?.name ?? 'Unknown'}
        </Text>
      </Text>
      <Text style={styles.text}>
        {about.isCodeMember ? 'Student' : 'External'}
      </Text>
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}

      <View
        style={{
          flexDirection: 'column',

          width: 9 * 16,

          flex: 0,

          backgroundColor: 'transparent',
        }}
      >
        <Image
          source={{ uri: user?.picture }}
          style={{
            width: '100%',
            aspectRatio: 1,
            marginVertical: 16,

            borderRadius: 999,

            backgroundColor: '#FF6961',
          }}
        />

        <Pressable
          onPress={signOut}
          style={({ pressed }) =>
            pressed ? [styles.button, styles.buttonPressed] : styles.button
          }
          accessibilityLabel="Sign out"
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          height: 32,
        }}
      />

      <View
        style={{
          flexDirection: 'column',

          width: '100%',
          paddingHorizontal: 16,

          backgroundColor: 'transparent',
        }}
      >
        <Text style={[styles.text, { marginLeft: 12 }]}>Time range</Text>
        <PanelSelectInput
          options={Object.values(TimePickerMode).map((i) => ({
            id: i.id,
            displayName: i.displayName,
            isSelected: settings.timePickerMode.id === i.id,
          }))}
          onOptionClick={(selected) => {
            settings.setTimePickerMode(TimePickerMode[selected.id]);
          }}
        />

        {/* <View
          style={{
            height: 16,

            backgroundColor: 'transparent',
          }}
        />

        <Text style={[styles.text, { marginLeft: 12 }]}>Map style</Text>
        <PanelSelectInput
          options={[
            {
              id: 'HALF_DAY',
              displayName: 'Accurate',
              isSelected: false,
            },
            {
              id: 'FULL_DAY',
              displayName: 'Functional',
              isSelected: false,
            },
          ]}
          onOptionClick={() => {}}
        /> */}
      </View>

      <Pressable
        onPress={() =>
          Linking.openURL('https://github.com/CODE-Review-Newspaper/mobile-app')
        }
        style={{
          position: 'absolute',

          bottom: 32,
        }}
      >
        <Text style={styles.link}>CODE Connect {codeConnectVersion}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
    color: '#7c7c7d',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  button: {
    paddingHorizontal: 32,
    height: 48,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#999',
    borderWidth: 2,
    borderRadius: 4,
  },
  buttonText: {
    color: '#999',

    fontSize: 16,
    fontWeight: '900',
  },
  link: {
    color: '#007acc',
    textDecorationColor: '#007acc',
    textDecorationLine: 'underline',

    fontSize: 16,
    fontWeight: '900',
  },
});

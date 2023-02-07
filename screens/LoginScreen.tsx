import React from 'react';
import { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Logo from '../assets/images/codeReviewLogo.svg';
import GoogleIcon from '../assets/images/googleIcon.svg';
import { Text, View } from '../components/Themed';
import UserContext from '../contexts/user.context';

export default function LoginScreen() {
  const { signIn } = useContext(UserContext);

  return (
    <View style={{ backgroundColor: '#222', height: '100%' }}>
      <View style={styles.sache}>
        {/* <Text style={{ color: "white" }}>Anbei die geile Sache</Text> */}

        <Logo
          fill="white"
          width="60%"
          style={{ width: 100, height: 100, fill: 'white' }}
        />

        <Pressable
          onPress={signIn}
          style={({ pressed }) =>
            pressed ? [styles.button, styles.buttonPressed] : styles.button
          }
          accessibilityLabel="Sign in with @code.berlin"
        >
          <GoogleIcon
            width="16"
            height="16"
            fill="white"
            style={{ marginBottom: 1 }}
          />
          <Text style={styles.buttonText}>Sign in with @code.berlin</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sache: {
    marginTop: '0%',

    paddingHorizontal: 16,

    backgroundColor: 'transparent',

    height: '90%',

    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 48,
    paddingHorizontal: 32,

    backgroundColor: '#FF6961',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],

    backgroundColor: '#fe746a',
  },
  buttonText: {
    paddingLeft: 10,

    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
});

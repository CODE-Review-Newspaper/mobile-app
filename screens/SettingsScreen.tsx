import { useContext } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import UserContext from '../contexts/user.context';
import userLoginController from '../controller/userLogin.controller';

export default function SettingsScreen() {
  const { signOut } = useContext(UserContext);
  const { fetchUserEvents } = userLoginController();

  const { user, about } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={{ color: '#222', fontWeight: '700' }}>Signed in as </Text>
        <Text style={{ color: '#FF6961', fontWeight: '900' }}>
          {user?.name ?? 'Unknown'}
        </Text>
      </Text>
      <Text style={styles.text}>
        {about.isCodeMember ? 'Student' : 'External'}
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
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

      <Pressable
        onPress={() =>
          Linking.openURL('https://github.com/CODE-Review-Newspaper/mobile-app')
        }
      >
        <Text
          style={{
            color: '#007acc',
            textDecorationColor: '#007acc',
            // textDecorationLine: 'underline',
            fontSize: 16,
            fontWeight: '900',
            marginTop: 128,
          }}
        >
          Contribute or open an issue
        </Text>
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
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
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
    fontWeight: '900',
    fontSize: 16,
  },
});

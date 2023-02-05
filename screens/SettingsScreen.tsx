import { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import UserContext from '../contexts/user.context';

export default function SettingsScreen() {

    const { signOut } = useContext(UserContext)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                <Text style={{ color: "#222", fontWeight: '700' }}>
                    Signed in as{" "}
                </Text>
                <Text style={{ color: "#FF6961", fontWeight: "900" }}>
                    Linus Bolls
                </Text>
            </Text>
            <Text style={styles.text}>
                Student
            </Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />


            <Pressable
                onPress={signOut}
                style={({ pressed }) => pressed ? [styles.button, styles.buttonPressed] : styles.button}
                accessibilityLabel="Sign out"
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </Pressable>
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
    },
    text: {
        color: "#222",
        fontSize: 16,
        fontWeight: "700",
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
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",

        borderColor: "#999",
        borderWidth: 2,
    },
    buttonText: {
        color: "#999",
        fontWeight: "900",
        fontSize: 16,
    },
});

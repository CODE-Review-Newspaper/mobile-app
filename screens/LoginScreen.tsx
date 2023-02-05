import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import Logo from '../assets/images/codeReviewLogo.svg';

export default function LoginScreen(signIn: () => unknown) {

    return function () {

        return (
            <View style={{ backgroundColor: "#222", height: "100%" }}>
                <View style={styles.sache}>
                    {/* <Text style={{ color: "white" }}>Anbei die geile Sache</Text> */}

                    <Logo
                        fill="white"
                        width="60%"
                        style={{ width: 100, height: 100, fill: "white" }}
                    />

                    <Pressable
                        onPress={signIn}
                        style={({ pressed }) => pressed ? [styles.button, styles.buttonPressed] : styles.button}
                        accessibilityLabel="Sign in with @code.berlin"
                    >
                        <Text style={styles.buttonText}>Sign in with @code.berlin</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonPressed: {

        // left: 4,
        // top: 4,
        // shadowOffset: { width: 0, height: 0 },

        transform: [{ scale: 0.95 }],

        backgroundColor: "#fe746a",
    },
    sache: {

        marginTop: "0%",

        paddingHorizontal: 16,

        backgroundColor: "transparent",

        height: "90%",

        justifyContent: "space-between",
    },
    button: {
        paddingHorizontal: 32,
        height: 48,
        backgroundColor: "#FF6961",
        alignItems: "center",
        justifyContent: "center",

        // shadowColor: '#000',
        // shadowOffset: { width: 4, height: 4 },
        // shadowOpacity: 1,
        // shadowRadius: 0,
    },
    buttonText: {
        color: "white",
        fontWeight: "900",
        fontSize: 16,
    },
});

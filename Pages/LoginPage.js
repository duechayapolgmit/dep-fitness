import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/core";

const MAX_LOGIN_ATTEMPTS = 3; // Max number of login attempts allowed
const LOGIN_TIMEOUT_DURATION = 60 * 1000; // Timeout duration (1 minute)
let loginAttempts = 0;
let lastLoginAttemptTime = 0;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                if (user.emailVerified) {
                    navigation.navigate("Home");
                } else {
                    setLoginError("Email not verified. Please verify your email before logging in.");
                }
            }
        });

        return unsubscribe;
    }, []);

    const handleRegister = () => {
        // Password requirements
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

        // Check if password meets requirements
        if (
            password.length < minLength ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasNumbers ||
            !hasSpecialChars
        ) {
            alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        // If password meets complexity requirements, proceed with registration
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                // Send verification email
                userCredentials.user.sendEmailVerification()
                    .then(() => {
                        alert("Verification email sent. Please verify your email before logging in.");
                    })
                    .catch(error => {
                        console.error("Error sending verification email:", error);
                    });
            })
            .catch(error => alert(error.message));
    };

    const handleLogin = () => {
        // Check if login attempts have exceeded the maximum limit
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - lastLoginAttemptTime < LOGIN_TIMEOUT_DURATION) {
            // Update error message each second
            const intervalId = setInterval(() => {
                const remainingTime = Math.ceil((lastLoginAttemptTime + LOGIN_TIMEOUT_DURATION - Date.now()) / 1000); // Convert milliseconds to seconds
                if (remainingTime <= 0) {
                    // Clear interval when timeout is over
                    clearInterval(intervalId);
                    setLoginError('');
                } else {
                    setLoginError(`Too many login attempts. Please try again in ${remainingTime} seconds.`);
                }
            }, 1000);
            return;
        }

        // Attempt login if email is verified
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                if (user.emailVerified) {
                    console.log("Logged in with: ", user.email);
                    // Reset login attempts if login is successful
                    loginAttempts = 0;
                    setLoginError('');
                    navigation.navigate("Home");
                } else {
                    setLoginError("Email not verified. Please verify your email before logging in.");
                }
            })
            .catch(error => {
                // Increment login attempts and update last login attempt time
                loginAttempts++;
                lastLoginAttemptTime = Date.now();
                setLoginError(error.message);
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.buttonOutline}>Register</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        width: '60%',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#3498db',
    },
    buttonOutlineText: {

    },
    buttonText: {
        color: '#fff',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

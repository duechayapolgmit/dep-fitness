import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Image } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/core";
import HomePageLogo from '../assets/HomePageLogo.png';
import '../App.css';

const MAX_LOGIN_ATTEMPTS = 3; // Max number of login attempts allowed
const LOGIN_TIMEOUT_DURATION = 60 * 1000; // Timeout duration (1 minute)
let loginAttempts = 0;
let lastLoginAttemptTime = 0;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showLogin, setShowLogin] = useState(false);


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

    const handleEnter = () => {
        setShowLogin(true);  // Hide the initial view and show the login form
    };

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
        <ImageBackground
            source={require('../assets/Background2.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                {!showLogin ? (
                    <View style={styles.welcomeContainer}>
                        <TouchableOpacity onPress={handleEnter} style={[styles.imageButton]}>
                            <Image source={HomePageLogo} style={styles.logo} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEnter} style={styles.button}>
                            <Text style={styles.buttonText}>Enter</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry
                        />
                        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    logo: {
        width: 200,
        height: 200,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        width: 200,
        height: 200,


    },
    imageButton: {
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        alignItems: 'center',
        color: 'white',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    enterButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, // Adjust the font size as needed
        fontFamily: 'Arial', // Change the font family to your preferred font
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add a text shadow for better visibility
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },

    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
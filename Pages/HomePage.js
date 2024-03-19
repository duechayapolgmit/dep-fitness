import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BrowsePage from './BrowsePage';
import ProfilePage from "./ProfilePage";
import AddPage from "./AddPage";
import HistoryPage from "./HistoryPage";

const Tab = createBottomTabNavigator();

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Home");
            })
            .catch((error) => alert(error.message));
    };

    const goToLogin = () => {
        navigation.navigate('Login'); 
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={goToLogin}>
                <Text style={styles.buttonText}>Login/Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const HomePage = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [rerender, setRerender] = useState(false); // State to trigger re-render

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsEmailVerified(user.emailVerified);
                setRerender(prevState => !prevState); // Trigger re-render on auth state change
            }
        });

        return unsubscribe;
    }, []);

    const isUserLoggedIn = !!auth.currentUser;

    return (
        <Tab.Navigator>
            {isEmailVerified && <Tab.Screen name="Profile" component={ProfilePage} />}
            {isUserLoggedIn && isEmailVerified && (
                <>
                    <Tab.Screen name="History" component={HistoryPage} />
                    <Tab.Screen name="Add" component={AddPage} />
                    <Tab.Screen name="Browse" component={BrowsePage} />
                </>
            )}
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 60,
    },
    buttonText: {
        color: '#fff',
    },
});

export default HomePage;

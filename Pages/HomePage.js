import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const ProfileScreen = () => {
    

    return (
        <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email}</Text>
        </View>
    );
};

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

    const goToBMI = () => {
        navigation.navigate('BMI');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={goToBMI}>
                <Text style={styles.buttonText}>BMI Calculator</Text>
            </TouchableOpacity>
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
    return (
        <Tab.Navigator>
            <Tab.Screen name="Profile" component={ProfileScreen} />
            {/* <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Add" component={AddScreen} />
            <Tab.Screen name="Browser" component={BrowserScreen} /> */}
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

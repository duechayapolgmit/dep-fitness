import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { auth } from '../firebase';

const ProfilePage = () => {
    const [progress, setProgress] = useState(0);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            // Progress update
            // Currently updates 0.1 every second for testing purposes
            setProgress((prevProgress) => (prevProgress < 1 ? prevProgress + 0.1 : 0));
        }, 1000);

        const counterInterval = setInterval(() => {
            // Streak counter
            // Currently updates every second(1000) for testing purposes
            setCounter((prevCounter) => prevCounter + 1);
        }, 1000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(counterInterval);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.emailText}>Email: {auth.currentUser?.email}</Text>

            <Progress.Bar progress={progress} width={200}/>

            <Text style={styles.counterText}>Counter: {counter}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 260,
    },
    progressBar: {
        width: '80%',
        marginTop: 20,
    },
    counterText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default ProfilePage;

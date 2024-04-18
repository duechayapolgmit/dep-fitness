import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfilePage = () => {
    const [progress, setProgress] = useState(0);
    const [totalSquats, setTotalSquats] = useState(0);
    const [totalJumpingJacks, setTotalJumpingJacks] = useState(0);
    const [totalPushUps, setTotalPushUps] = useState(0);
    const [totalPlanks, setTotalPlanks] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prevProgress => prevProgress < 1 ? prevProgress + 0.1 : 1);
        }, 1000);

        const fetchWorkoutTotals = async (collectionName, setter, countField) => {
            if (auth.currentUser) {
                const userEmail = auth.currentUser.email.toLowerCase();
                const ref = collection(db, collectionName);
                const q = query(ref, where('userEmail', '==', userEmail));

                try {
                    const querySnapshot = await getDocs(q);
                    let total = 0;
                    querySnapshot.forEach(doc => {
                        total += doc.data()[countField] || 0;
                    });
                    setter(total);
                    console.log(`Total ${collectionName}:`, total);
                } catch (error) {
                    console.error(`Error fetching ${collectionName}:`, error);
                }
            }
        };

        const authListener = auth.onAuthStateChanged(user => {
            setLoggedIn(!!user);
            if (user) {
                fetchWorkoutTotals('squatSessions', setTotalSquats, 'squatCount');
                fetchWorkoutTotals('jumpingJackSessions', setTotalJumpingJacks, 'jumpingJackCount');
                fetchWorkoutTotals('pushupSessions', setTotalPushUps, 'pushupCount');
                fetchWorkoutTotals('plankSessions', setTotalPlanks, 'duration'); // Adjust if your 'plank' has a different count field
            }
        });

        return () => {
            clearInterval(progressInterval);
            authListener(); // Unsubscribe from the auth state listener
        };
    }, []);

    return (
        <View style={styles.container}>
            {loggedIn && (
                <>
                    <Text style={styles.emailText}>Email: {auth.currentUser?.email}</Text>
                    <Progress.Bar progress={progress} width={200} />
                    <Text style={styles.totalSquatsText}>Total Squats: {totalSquats}</Text>
                    <Text style={styles.totalText}>Total Jumping Jacks: {totalJumpingJacks}</Text>
                    <Text style={styles.totalText}>Total Push Ups: {totalPushUps}</Text>
                    <Text style={styles.totalText}>Total Planks: {totalPlanks}</Text>
                </>
            )}
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
        marginBottom: 10,
    },
    totalSquatsText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ImageBackground } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

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
                fetchWorkoutTotals('pushUpSessions', setTotalPushUps, 'pushUpCount');
                fetchWorkoutTotals('plankSessions', setTotalPlanks, 'plankTime'); 
            }
        });

        return () => {
            clearInterval(progressInterval);
            authListener(); // Unsubscribe from the auth state listener
        };
    }, []);

    const data = {
        labels: ['Squats', 'Jumping Jacks', 'Push Ups', 'Planks'],
        datasets: [{
            data: [totalSquats, totalJumpingJacks, totalPushUps, totalPlanks],
        }],
    };

    return (
        <ImageBackground
            source={require('../assets/BlackBackground.png')}
            className="backgroundImage"
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <View style={styles.container}>

                {loggedIn && (
                    <>
                        <Text style={styles.emailText}>Email: {auth.currentUser?.email}</Text>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Overall Score</Text>
                        </View>
                        <Text style={styles.totalText}>Total Squats: {totalSquats}</Text>
                        <Text style={styles.totalText}>Total Jumping Jacks: {totalJumpingJacks}</Text>
                        <Text style={styles.totalText}>Total Push Ups: {totalPushUps}</Text>
                        <Text style={styles.totalText}>Total seconds doing plank: {totalPlanks}</Text>
                        <BarChart
                            data={data}
                            width={300}
                            height={200}
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundGradientFrom: '#1E2923',
                                backgroundGradientTo: '#08130D',
                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false // optional
                            }}
                            style={styles.chart}
                        />
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    progressBar: {
        marginVertical: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
    },
    chart: {
        marginTop: 20,
    },
});

export default ProfilePage;

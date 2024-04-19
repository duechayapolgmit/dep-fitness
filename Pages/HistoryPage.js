import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ImageBackground } from 'react-native';
import '../App.css';

const HistoryPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                console.log('User is logged in:', user);
                fetchWorkouts();
            } else {
                console.log('No user logged in');
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on component unmount
    }, []);

    const fetchWorkouts = async () => {
        setLoading(true);
        if (auth.currentUser) {
            const emailToQuery = auth.currentUser.email.trim().toLowerCase();
            const fetchFromCollection = async (collectionName) => {
                const ref = collection(db, collectionName);
                const q = query(ref, where('userEmail', '==', emailToQuery));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: collectionName, // differentiate between squat and jumping jack sessions
                    ...doc.data(),
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleString() : 'No Date'
                }));
            };

            try {
                // Fetch data in parallel
                const [squatSessions, jumpingJackSessions] = await Promise.all([
                    fetchFromCollection('squatSessions'),
                    fetchFromCollection('jumpingJackSessions'),
                    fetchFromCollection('pushupSessions'),
                    fetchFromCollection('plankSessions')
                ]);
                const workoutsData = [...squatSessions, ...jumpingJackSessions];
                setWorkouts(workoutsData);
                console.log('Fetched Workouts:', workoutsData);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
            setLoading(false);
        } else {
            console.log('Authentication user not found.');
            setLoading(false);
        }
    };

    const cardStyle = {
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        transition: "0.3s",
        width: "300px",
        padding: "10px",
        margin: "10px",
        borderRadius: "5px",
        backgroundColor: "#fff",
        textAlign: "center",
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ImageBackground
            source={require('../assets/BlackBackground.png')}
            className = "backgroundImage"
            resizeMode="cover"
        >
        <div style={{ padding: '20px', height: '100vh', overflowY: 'auto' }}>
            <h1>Workout History</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {workouts.map(workout => (
                    <div key={workout.id} style={cardStyle}>
                        <h2>{workout.type === 'squatSessions' ? 'Squat Session' : workout.type === 'jumpingJackSessions' ? 'Jumping Jack Session' : workout.type === 'plankSessions' ? 'Plank Session' : 'Pushup Session'}</h2>
                        {workout.type === 'squatSessions' ? (
                            <>
                                <p><strong>Squat Count:</strong> {workout.squatCount}</p>
                                <p><strong>Head Angle:</strong> {workout.headAngle}</p>
                                <p><strong>Knee Status:</strong> {workout.kneeStatus}</p>
                            </>
                        ) : workout.type === 'jumpingJackSessions' ? (
                            <>
                                <p><strong>Jump Count:</strong> {workout.jumpingJackCount}</p>
                                <p><strong>Feet Status:</strong> {workout.feetStatus}</p>
                            </>
                        ) : workout.type === 'plankSessions' ? (
                            <>
                                <p><strong>Duration:</strong> {workout.plankTime}</p>
                                <p><strong>Form Rating:</strong> {workout.bodyStraight}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Pushup Count:</strong> {workout.pushUpCount}</p>
                                <p><strong>Form Quality:</strong> {workout.conditions}</p>
                            </>
                        )}
                        <p><strong>Date:</strong> {workout.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
        </ImageBackground>
    );
}


export default HistoryPage;

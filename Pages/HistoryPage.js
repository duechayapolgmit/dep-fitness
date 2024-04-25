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
                    type: collectionName,
                    ...doc.data(),
                    createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : new Date() // Converting Firestore Timestamp to Date
                }));
            };

            try {
                // Fetch data in parallel
                const [squatSessions, jumpingJackSessions, pushupSessions, plankSessions] = await Promise.all([
                    fetchFromCollection('squatSessions'),
                    fetchFromCollection('jumpingJackSessions'),
                    fetchFromCollection('pushupSessions'),
                    fetchFromCollection('plankSessions')
                ]);
                const workoutsData = [...squatSessions, ...jumpingJackSessions, ...pushupSessions, ...plankSessions];
                // Sort workouts by createdAt date in descending order
                workoutsData.sort((a, b) => b.createdAt - a.createdAt);
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
            className="backgroundImage"
            resizeMode="cover"
        >
            <div style={{ padding: '20px', height: '100vh', overflowY: 'auto' }}>
                <h1>Workout History</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {workouts.map(workout => (
                        <div key={workout.id} style={cardStyle}>
                            <h2>{workout.type === 'squatSessions' ? 'Squat Session' :
                                workout.type === 'jumpingJackSessions' ? 'Jumping Jack Session' :
                                    workout.type === 'plankSessions' ? 'Plank Session' : 'Pushup Session'}</h2>
                            <p><strong>{workout.type === 'squatSessions' ? 'Squat Count' :
                                workout.type === 'jumpingJackSessions' ? 'Jump Count' :
                                    workout.type === 'plankSessions' ? 'Duration' : 'Pushup Count'}:
                            </strong> {workout[workout.type === 'squatSessions' ? 'squatCount' :
                                workout.type === 'jumpingJackSessions' ? 'jumpingJackCount' : workout.type === 'plankSessions' ? 'plankTime' :
                                    'pushUpCount']}</p>
                            <p><strong>Date:</strong> {workout.createdAt.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ImageBackground>
    );
}

export default HistoryPage;

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image, ImageBackground, ScrollView } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BrowsePage from './BrowsePage';
import ProfilePage from "./ProfilePage";
import PoseDetection from "./PoseDetection";
import HistoryPage from "./HistoryPage";
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

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
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Profile') {
                        iconName = 'user';
                    } else if (route.name === 'History') {
                        iconName = 'history';
                    } else if (route.name === 'Scan') {
                        iconName = 'camera';
                    } else if (route.name === 'Browse') {
                        iconName = 'search';
                    } else if (route.name === 'Settings') {
                        iconName = 'gear';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { paddingBottom: 5, height: 60 },
            })}
        >
            {isEmailVerified && <Tab.Screen name="Profile" component={ProfilePage} />}
            {isUserLoggedIn && isEmailVerified && (
                <>
                    <Tab.Screen name="History" component={HistoryPage} />
                    <Tab.Screen name="Scan" component={PoseDetection} />
                    <Tab.Screen name="Browse" component={BrowsePage} />
                </>
            )}
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch((error) => alert(error.message));
    };

    const goToLogin = () => {
        navigation.navigate('Login');
    };

    const goToBMI = () => {
        navigation.navigate('BMI');
    };

    return (
        <ImageBackground
            source={require('../assets/BlackBackground.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <CollapsibleSection title="Introduction">
                        <Text style={styles.description}>
                            Say hello to a fitness journey reimagined by Eoin, Due, and Pedro
                        </Text>
                        <Text style={styles.description}>United by a love for Fitness, Cybersecurity, and Tech.</Text>
                        <Text style={styles.description}>Our app isn't just any fitness tracker; it's a personal coach powered by a smart CNN model.
                        </Text>
                        <Text style={styles.description}>We've baked in some serious cybersecurity measures too, because your peace of mind matters to us. And yes, we're always getting better, thanks to Agile methodologies that let us evolve fast and keep things fresh.
                        </Text>
                    </CollapsibleSection>
                    <CollapsibleSection title="About the App">
                        <Text style={styles.description}>
                            Our app isn't just any fitness tracker; it's a personal coach powered by a smart CNN model.
                            We've baked in some serious cybersecurity measures too, because your peace of mind matters to us.
                        </Text>
                    </CollapsibleSection>
                    <View style={styles.horizontalContainer}>
                        <CollapsibleSection title="Eoin">
                            <Text style={styles.description}>
                                Hiya, I'm Eoin! I took care of the front-end of the project, the firestore storage, Api calls, Hosting and most importantly,
                                 the intergration of the CNN (Convolutional Nueral Network) Exercises!

                            </Text>
                        </CollapsibleSection>
                        <CollapsibleSection title="Pedro">
                            <Text style={styles.description}>
                            Heyo, My name is Pedro, I worked on the cybersecurity, ethical hacking, authorization of this project!
                            </Text>
                        </CollapsibleSection>
                        <CollapsibleSection title="Due">
                            <Text style={styles.description}>
                            Hello, I am Due. I took care of all the DevOps tasks relating to this project as well as planning 
                            out testing plans (and actual testing) for this project. I also handle some architecture relating to this project as well.
                            </Text>
                        </CollapsibleSection>
                    </View>
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
            </ScrollView>
        </ImageBackground>
    );
};

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={toggleSection} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.sectionContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sectionContainer: {
        width: '100%',
        marginTop: 10,
    },
    sectionHeader: {
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionContent: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    button: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
});

export default HomePage;

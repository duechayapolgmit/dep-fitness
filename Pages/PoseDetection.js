import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SquatLogo from '../assets/Squat.png'; // Make sure to adjust your import paths
import JumpingJack from '../assets/JumpingJack.png'; // Make sure to adjust your import paths
import Plank from '../assets/Plank.png'; // Make sure to adjust your import paths
import PushUp from '../assets/PushUp.png'; // Make sure to adjust your import paths

function PoseDetection() {
  const navigation = useNavigation();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => Dimensions.removeEventListener('change', updateLayout);
  }, []);

  const cardWidth = screenWidth / 2 - 100; // Adjusting for two cards per row with some padding

  const navigateToSquatCounter = () => {
    navigation.navigate('SquatDetection'); // Update with correct navigation if needed
  };

  const navigateToPushUpCounter = () => {
    navigation.navigate('PushUpDetection');
  };

  const navigateToJumpingJackCounter = () => {
    navigation.navigate('JumpingJackDetection');
  };

  const navigateToPlankTracker = () => {
    navigation.navigate('PlankDetection');
  };

  return (
    <ImageBackground
            source={require('../assets/BlackBackground.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your Exercise!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={navigateToSquatCounter}>
          <Image source={SquatLogo} style={styles.image} />
          <Text>Squats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={navigateToPushUpCounter}>
          <Image source={PushUp} style={styles.image} />
          <Text>Push-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={navigateToJumpingJackCounter}>
          <Image source={JumpingJack} style={styles.image} />
          <Text>Jumping Jacks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={navigateToPlankTracker}>
          <Image source={Plank} style={styles.image} />
          <Text>Plank</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%', // Ensure it covers the full height
  },
  
  header: {
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#e0e0e0',
  },
  cardContainer: {
    flexDirection: 'row', // Align items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'center', // Center items in the main axis
    padding: 10,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // Adjust spacing between items 
    backgroundColor: '#f0f0f0', // Optional: background color for cards
    borderRadius: 10, // Optional: rounded corners for cards
    padding: 20, // Adjust padding inside cards
  },
  image: {
    width: '100%', // Make the image fill the width of the card
    height: undefined, // Ensure the height adjusts to maintain aspect ratio
    aspectRatio: 1, // Adjust aspect ratio according to your images
    resizeMode: 'contain', // Keep the image within the bounds of the card
    marginBottom: 10, // Space between the image and the text below it
  },
});


export default PoseDetection;

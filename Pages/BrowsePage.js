import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, Alert, Modal, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import '../App.css';

const BrowsePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const bodyParts = ["back", "chest", "upper legs", "lower legs", "shoulders"]; // Reduced to 4 suggestions

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async (bodyPart = '') => {
        const url = bodyPart
            ? `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10`
            : 'https://exercisedb.p.rapidapi.com/exercises';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': `${process.env.RAPID_API_KEY}`,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('API call failed with status ' + response.status);
            }
            const result = await response.json();
            setSearchResults(result);
        } catch (error) {
            console.error('Fetch Exercises Error:', error);
            Alert.alert('Error', 'Something went wrong with the search.');
        }
    };

    const searchExercise = () => {
        if (!searchQuery) {
            fetchExercises();
        } else {
            fetchExercises(searchQuery);
        }
    };

    const handleSelectExercise = (exercise) => {
        if (exercise) {
            setSelectedExercise(exercise);
        }
    };

    const handleCloseModal = () => {
        setSelectedExercise(null);
    };

    const renderItem = ({ item }) => (
        <ImageBackground
            source={require('../assets/BlackBackground.png')}
            className="backgroundImage"
            resizeMode="cover"
            style={styles.container}
        >
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectExercise(item)}>
            <Image style={styles.itemImage} source={{ uri: item.gifUrl }} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Equipment: {item.equipment}</Text>
            <Text numberOfLines={1} style={styles.itemDetails}>Instructions: {item.instructions?.join(" ")}</Text>
        </TouchableOpacity>
        </ImageBackground>
    );

    const renderBodyPartButton = ({ item }) => (
        
        <TouchableOpacity style={styles.suggestionButton} onPress={() => fetchExercises(item)}>
            <Text style={styles.suggestionText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../assets/BlackBackground.png')}
            className="backgroundImage"
            resizeMode="cover"
            style={styles.container}
        >
            <TextInput
                style={styles.searchInput}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Type name of body part..."
            />
            <Button
                title="Search"
                onPress={searchExercise}
            />
            <FlatList
                horizontal
                data={bodyParts}
                renderItem={renderBodyPartButton}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.suggestionsContainer}
            />
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
    animationType="slide"
    transparent={true}
    visible={selectedExercise !== null}
    onRequestClose={handleCloseModal}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            {selectedExercise && (
                <>
                    <Image source={{ uri: selectedExercise.gifUrl }} style={styles.modalImage} />
                    <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                    <Text style={styles.modalText}>Equipment: {selectedExercise.equipment}</Text>
                    <Text style={styles.modalText}>Target Muscle: {selectedExercise.target}</Text>
                    <Text style={styles.modalText}>Body Part: {selectedExercise.bodyPart}</Text>
                    <Text style={styles.modalText}>Instructions: {selectedExercise.instructions?.join(" ")}</Text>
                    <Button title="Close" onPress={handleCloseModal} />
                </>
            )}
        </View>
    </View>
</Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    searchInput: {
        backgroundColor: '#e0e0e0',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    itemContainer: {
        backgroundColor: '#e0e0e0',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    itemName: {
        fontSize: 18,
    },
    itemDetails: {
        fontSize: 14,
    },
    itemImage: {
        justifyContent: 'center',
        width: 100,
        height: 100,
    },
    suggestionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 70,
    },
    suggestionButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionText: {
        fontSize: 15,
        color: '#333',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default BrowsePage;
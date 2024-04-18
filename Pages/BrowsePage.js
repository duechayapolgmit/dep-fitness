import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, Alert, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';

const BrowsePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const bodyParts = ["back", "chest", "upper legs", "shoulders"]; // Reduced to 4 suggestions

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
                'X-RapidAPI-Key': '96851120ccmshb39b41e6b1c0264p146630jsn5de326583dfe',
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

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => setSelectedExercise(item)}>
            <Image style={styles.itemImage} source={{ uri: item.gifUrl }} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Equipment: {item.equipment}</Text>
            <Text numberOfLines={1} style={styles.itemDetails}>Instructions: {item.instructions?.join(" ")}</Text>
        </TouchableOpacity>
    );

    const renderBodyPartButton = (part) => (
        <TouchableOpacity key={part} style={styles.suggestionButton} onPress={() => fetchExercises(part)}>
            <Text style={styles.suggestionText}>{part}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
                {bodyParts.map(part => renderBodyPartButton(part))}
            </ScrollView>
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedExercise !== null}
                onRequestClose={() => setSelectedExercise(null)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image style={styles.modalImage} source={{ uri: selectedExercise?.gifUrl }} />
                        <Text style={styles.modalText}>{selectedExercise?.name}</Text>
                        <Text style={styles.modalText}>Equipment: {selectedExercise?.equipment}</Text>
                        <Text style={styles.modalText}>Instructions: {selectedExercise?.instructions?.join(" ")}</Text>
                        <Button
                            title="Close"
                            onPress={() => setSelectedExercise(null)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    searchInput: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    itemContainer: {
        backgroundColor: '#f9c2ff',
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
        width: 100,
        height: 100,
    },
    suggestionsContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
    },
    suggestionButton: {
        marginHorizontal: 12,
        backgroundColor: '#e0e0e0',
        padding: 0,
        borderRadius: 40,
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

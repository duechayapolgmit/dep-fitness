import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const BrowsePage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Logic to handle search with 'searchQuery'
        console.log('Search query:', searchQuery);
        // Perform search operations using 'searchQuery'
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for Workout"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <Button title="Search" onPress={handleSearch} />
            {/* Display search results or other content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
});

export default BrowsePage;

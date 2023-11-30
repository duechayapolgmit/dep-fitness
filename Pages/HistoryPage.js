import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistoryPage = () => {
    // Placeholder Text
    const [previousTitles, setPreviousTitles] = useState([
        { id: '1', title: 'Workout 1' },
        { id: '2', title: 'Workout 2' },
        { id: '3', title: 'Workout 3' },
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Previous Workouts:</Text>
            <FlatList
                data={previousTitles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.title}</Text>
                )}
            />
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default HistoryPage;

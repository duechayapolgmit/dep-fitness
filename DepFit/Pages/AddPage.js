import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const AddPage = () => {
    
    const handleAdd = () => {
        // Add/Start workout feature for Eoin        
        console.log('Button pressed');
    };

    return (
        <View style={styles.container}>
            <Button title="Add/Start Workout" onPress={handleAdd} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddPage;

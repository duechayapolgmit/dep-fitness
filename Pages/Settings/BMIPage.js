import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { getBMI, getBMICategory } from "../../Services/BMIService";

const BMIPage = (props) => {
    const [height, setHeight] = React.useState();
    const [weight, setWeight] = React.useState();

    const [bmi, setBMI] = React.useState(-1);
    const [category, setCategory] = React.useState("Unknown");

    const calculateBMI = () => {
        let tempBMI = getBMI(height, weight)
        setBMI(tempBMI);
        setCategory(getBMICategory(tempBMI));
    }

    return (
        <View accessible={true}>
            <TextInput
                style={styles.input}
                onChangeText={text => setHeight(text)}
                value={height}
                placeholder="Height (metres)"
                keyboardType="numeric"
                accessibilityLabel="height input"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => setWeight(text)}
                value={weight}
                placeholder="Weight (kilograms)"
                keyboardType="numeric"
                accessibilityLabel="weight input"
            />
            <TouchableOpacity style={styles.button} onPress={calculateBMI}>
                <Text style={styles.buttonText}>Calculate BMI</Text>
            </TouchableOpacity>
            <Text accessibilityLabel="bmi output">Your BMI: {bmi.toFixed(1)}</Text>
            <Text accessibilityLabel="category output">Category: {category}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 60,
    },
    buttonText: {
        color: '#fff',
    },
});

export default BMIPage;
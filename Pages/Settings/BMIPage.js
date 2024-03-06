import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { getBMI, getBMICategory } from "../../Services/BMIService";

const BMIPage = (props) => {
    const [height, setHeight] = React.useState();
    const [weight, setWeight] = React.useState();

    const [bmi, setBMI] = React.useState(-1);
    const [category, setCategory] = React.useState("Unknown");

    const [showAlert, setShowAlert] = React.useState(false);

    const errorMessage = "ERROR: Invalid input! Please enter only numerical values in the fields.";

    const calculateBMI = () => {
        setShowAlert(false);
        let tempBMI = getBMI(height, weight)

        if (tempBMI == -1) {
            setShowAlert(true);
        }
        setBMI(tempBMI);
        setCategory(getBMICategory(tempBMI));
    }

    const alerter = () => {
        return (Alert.alert("yo"));
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
            <View accessibilityLabel="bmi info">
                {
                    showAlert && 
                    <Text accessibilityLabel="error msg">{errorMessage}</Text>
                }
                <BMIInfo bmi={bmi.toFixed(1)} category={category} />
            </View>
            
        </View>
    )
};

const BMIInfo = (props) => {
    const {bmi, category} = props;

    if (bmi != -1){
        return (
            <View>
                <Text accessibilityLabel="bmi output">Your BMI: {bmi}</Text>
                <Text accessibilityLabel="category output">Category: {category}</Text>
            </View>
        )
    } else {
        return;
    }
    
}

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
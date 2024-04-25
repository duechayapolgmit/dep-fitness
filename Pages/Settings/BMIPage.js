import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { getBMI, getBMICategory } from "../../Services/BMIService";

const BMIPage = () => {
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

export default BMIPage;
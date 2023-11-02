import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/core";


const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

   const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.navigate("Home")
            }
        }) 

        return unsubscribe
    }, [])

    const handleRegister = () => {
        auth.createUserWithEmailAndPassword(email, password).then(userCredentials =>
            {
            const user = userCredentials.user;
            console.log(user.email);
            
        }).catch(error => alert(error.message))
    }

    const handleLogin = () => { 
        auth.signInWithEmailAndPassword(email, password).then(userCredentials =>
            {
            const user = userCredentials.user;
            console.log("Logged in with: ", user.email);
            
        }).catch(error => alert(error.message))

    }

    return(
        <KeyboardAvoidingView style={styles.container} behavior="padding">

            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" 
                value={email} 
                onChangeText={text => setEmail(text)}
                style={styles.input}></TextInput>
                <TextInput placeholder="Password" 
                value={password} 
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry></TextInput>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.buttonOutline}>Register</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>

            
    )
}

export default LoginPage

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
    buttonContainer: {
        width: '60%',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#3498db',
    },
    buttonOutlineText: {
        
    },
    buttonText: {
        color: '#fff',
    },
})
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import SquatDetection from './Pages/Exercises/SquatDetection';
import PlankDetection from './Pages/Exercises/PlankDetection';
import JumpingJackDetection from './Pages/Exercises/JumpingJackDetection';
import PushUpDetection from './Pages/Exercises/PushUpDetection';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#FF6347',
    background: '#f0f0f0',
    text: '#666',
    disabled: 'gray',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomePage} /> 
          <Stack.Screen name="Login" component={LoginPage} /> 
          <Stack.Screen name="SquatDetection" component={SquatDetection} />
          <Stack.Screen name="JumpingJackDetection" component={JumpingJackDetection} />
          <Stack.Screen name="PlankDetection" component={PlankDetection} />
          <Stack.Screen name="PushUpDetection" component={PushUpDetection} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

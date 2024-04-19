import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import ProfilePage from "./Pages/ProfilePage";
import HistoryPage from "./Pages/HistoryPage";
import PoseDetection from "./Pages/PoseDetection";
import BrowsePage from './Pages/BrowsePage';
import SquatDetection from './Pages/Exercises/SquatDetection';
import PlankDetection from './Pages/Exercises/PlankDetection';
import JumpingJackDetection from './Pages/Exercises/JumpingJackDetection';
import PushUpDetection from './Pages/Exercises/PushUpDetection';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{
    tabBarActiveTintColor: '#3498db',
    tabBarInactiveTintColor: 'gray',
    tabBarLabelStyle: { fontSize: 12 },
    tabBarStyle: { paddingBottom: 5, height: 60 },
  }}>
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
    <Tab.Screen name="History" component={HistoryPage} />
    <Tab.Screen name="Scan" component={PoseDetection} />
    <Tab.Screen name="Browse" component={BrowsePage} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="SquatDetection" component={SquatDetection} />
          <Stack.Screen name="JumpingJackDetection" component={JumpingJackDetection} />
          <Stack.Screen name="PlankDetection" component={PlankDetection} />
          <Stack.Screen name="PushUpDetection" component={PushUpDetection} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

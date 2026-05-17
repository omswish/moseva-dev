import React, { useContext } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Providers
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import SubmitProposalScreen from './src/screens/SubmitProposalScreen';

const Stack = createNativeStackNavigator();

function NavigationStack() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#111827',
        },
      }}
    >
      {user ? (
        // MAIN APP STACK (Logged In)
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'MOSEVA Marketplace',
              headerTitleStyle: {
                fontWeight: '900',
                color: '#3b82f6', // Neon blue brand color
                letterSpacing: 1,
              }
            }} 
          />
          <Stack.Screen 
            name="JobDetails" 
            component={JobDetailsScreen} 
            options={{ title: 'Job Details' }} 
          />
          <Stack.Screen 
            name="PostJob" 
            component={PostJobScreen} 
            options={{ title: 'Post a New Job' }} 
          />
          <Stack.Screen 
            name="SubmitProposal" 
            component={SubmitProposalScreen} 
            options={{ title: 'Submit Proposal' }} 
          />
        </>
      ) : (
        // AUTHENTICATION STACK (Logged Out)
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <NavigationStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

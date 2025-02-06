import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigation/types/navigation.types';

export const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Function to handle navigating to LandingStack
  const navigateToLandingStack = (): void => {
    navigation.reset({
      index: 0,
      routes: [{name: 'CollectionStack'}],
    });
  };

  //Firebase Sign in Function
  const handleSignIn = async (): Promise<void> => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in!', userCredential.user);
      setError(null);
      navigateToLandingStack();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
    }
  };

  // Function to handle signing up a new user
  const handleSignUp = async (): Promise<void> => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User signed up!', userCredential.user);
      setError(null);
      navigateToLandingStack();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
    }
  };

  // Toggle between Sign In and Sign Up modes and clear any errors
  const toggleAuthMode = (): void => {
    setError(null);
    setIsSignUp(prevMode => !prevMode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={false}
        onChangeText={setPassword}
      />
      {isSignUp ? (
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpStyle}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signUpStyle}>Sign In</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={toggleAuthMode}>
        <Text style={styles.toggle}>
          {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121329',
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#f4f4f4',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f4f4f4',
  },

  signUpStyle: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
    textAlign: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'white',
  },

  toggle: {
    marginTop: 15,
    textAlign: 'center',
    color: '#f4f4f4',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {doc, setDoc, serverTimestamp, query, collection, where, getDocs} from 'firebase/firestore';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, User} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigation/types/navigation.types';
import {auth, db} from '../../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const AuthScreen = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  const navigateToCollectionStack = (user: User, folders: any[]): void => {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
    };
    navigation.reset({
      index: 0,
      routes: [{name: 'CollectionStack', params: {userData, folders}}],
    });
  };

  const handleInputFieldChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      if (!user) return;

      // Fetch user's music folders from Firestore
      const q = query(collection(db, 'folders'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      // Converts retrieved Firestore data to an array
      const folders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      navigateToCollectionStack(user, folders);
    } catch (error: any) {
      setError(error.message);
    }
  };
  const handleSignUp = async (): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: form.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      navigateToCollectionStack(user, []);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.wholeContainer}>
      <View style={styles.resonateContainer}>
        <Text style={styles.resonateText}>Resonate</Text>
      </View>

      <Text style={styles.title}>{isSigningUp ? 'Sign Up!' : 'Login'}</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {!isSigningUp ? (
        <>
          <View style={styles.inputAndIconRow}>
            <MaterialIcons name="email" style={{paddingHorizontal: 5}} size={30} color="#121329" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={text => handleInputFieldChange('email', text)}
            />
          </View>

          <View style={styles.inputAndIconRow}>
            <Ionicons style={{paddingHorizontal: 5}} name="lock-closed" size={30} color="#121329" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={form.password}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={text => handleInputFieldChange('password', text)}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.signUpContainer}>
            <View style={styles.inputAndIconRow}>
              <Ionicons style={{paddingHorizontal: 5}} name="person" size={30} color="#121329" />
              <TextInput
                style={styles.input}
                placeholder="Display Name"
                value={form.displayName}
                autoCapitalize="none"
                onChangeText={text => handleInputFieldChange('displayName', text)}
              />
            </View>

            <View style={styles.inputAndIconRow}>
              <MaterialIcons
                name="email"
                style={{paddingHorizontal: 5}}
                size={30}
                color="#121329"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={text => handleInputFieldChange('email', text)}
              />
            </View>

            <View style={styles.inputAndIconRow}>
              <MaterialIcons
                name="email"
                style={{paddingHorizontal: 5}}
                size={30}
                color="#121329"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Email"
                value={form.confirmEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={text => handleInputFieldChange('confirmEmail', text)}
              />
            </View>

            <View style={styles.inputAndIconRow}>
              <Ionicons
                style={{paddingHorizontal: 5}}
                name="lock-closed"
                size={30}
                color="#121329"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={form.password}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={text => handleInputFieldChange('password', text)}
              />
            </View>

            <View style={styles.inputAndIconRow}>
              <Ionicons
                style={{paddingHorizontal: 5}}
                name="lock-closed"
                size={30}
                color="#121329"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={text => handleInputFieldChange('confirmPassword', text)}
              />
            </View>
          </View>
        </>
      )}
      <View>
        {isSigningUp ? (
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpStyle}>Sign Up</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signUpStyle}>Sign In</Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomTextStyle}>
          <Text style={styles.acountText}>
            {isSigningUp ? 'Existing User? ' : 'Need an Account? '}
          </Text>
          <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
            <Text style={styles.underlineText}>{isSigningUp ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121329',
  },

  signUpContainer: {
    gap: 10,
  },

  resonateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  resonateText: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'Orbitron',
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#f4f4f4',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#f4f4f4',
    color: 'black',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  inputAndIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f4f4f4',
    color: 'black',
  },

  signUpStyle: {
    paddingVertical: 8,
    backgroundColor: '#007BFF',
    textAlign: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'white',
    fontSize: 20,
  },

  bottomTextStyle: {
    paddingTop: 10,
    alignItems: 'center',
  },

  acountText: {color: '#f4f4f4', fontSize: 18},
  underlineText: {
    color: '#f4f4f4',
    fontSize: 18,
    textDecorationLine: 'underline',
  },

  toggle: {
    alignItems: 'center',
    color: '#f4f4f4',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

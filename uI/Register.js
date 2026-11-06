// imports
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

// register endpoint (use the computer ip, the phone can't reach localhost)
const REGISTER_URL = 'http://YOUR_PC_IP:8888/social_media/register.php';

export default function Register({ onRegister, onGoToLogin }) {
  // state: typed username, passwords and the error to show
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  // create the account and pass the token to the app
  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !password2.trim()) {
      setError('All the fields are required');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post(REGISTER_URL, { username, password, password2 });
      setError('');
      onRegister(data.username, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Server not reachable');
    }
  };

  // register form
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7c6f94"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7c6f94"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor="#7c6f94"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      <Pressable onPress={onGoToLogin}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

// styles
export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
    paddingHorizontal: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f3e8ff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3b2a5c',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a1326',
    color: '#f3e8ff',
    fontSize: 14,
  },
  error: {
    color: '#fca5a5',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a855f7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  link: {
    color: '#d8b4fe',
    fontSize: 13,
    textAlign: 'center',
  },
});

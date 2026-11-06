// imports
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

// login endpoint (use the computer ip, the phone can't reach localhost)
const LOGIN_URL = 'http://YOUR_PC_IP:8888/social_media/login.php';

export default function Login({ onLogin, onGoToRegister }) {
  // state: typed username, password and the error to show
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // send the credentials and pass the token to the app
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    try {
      const { data } = await axios.post(LOGIN_URL, { username, password });
      setError('');
      onLogin(data.username, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Server not reachable');
    }
  };

  // login form
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable onPress={onGoToRegister}>
        <Text style={styles.link}>Create account</Text>
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
    width: 300,
    height: 160,
    alignSelf: 'center',
    resizeMode: 'stretch',
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

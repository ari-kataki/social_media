// imports
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import InputAndButton from './uI/inputAndButton';
import MessageFeed from './uI/MessageFeed';
import Login from './uI/Login';
import Register from './uI/Register';

// api url (use the computer ip, the phone can't reach localhost)
const API_URL = 'http://YOUR_PC_IP:8888/social_media';

// colors of the avatar: blue for my messages, yellow for the others
const MY_AVATAR = { avatarColor: '#bfdbfe', avatarText: '#1e40af' };
const OTHER_AVATAR = { avatarColor: '#fef08a', avatarText: '#854d0e' };

// convert a post of the api to the format used by the Message card
function toMessage(post, username) {
  const date = post.creation_date;
  return {
    id: String(post.id),
    username: post.username,
    text: post.content,
    time: `${date.slice(8, 10)}/${date.slice(5, 7)} ${date.slice(11, 16)}`,
    initials: post.username.charAt(0).toUpperCase(),
    ...(post.username === username ? MY_AVATAR : OTHER_AVATAR),
  };
}

export default function App() {
  // state: logged user (null until the login is done)
  const [user, setUser] = useState(null);

  // state: show the sign up screen instead of the login
  const [showRegister, setShowRegister] = useState(false);

  // state: messages loaded from the api, page to load and loading flag
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // state: counter, when it changes the effect loads the messages again
  const [reload, setReload] = useState(0);

  // state: true while the saved token is being checked at the start
  const [checking, setChecking] = useState(true);

  // header with the token of the logged user
  function authHeaders() {
    return { Authorization: `Bearer ${user.token}` };
  }

  // delete the saved token and go back to the login page
  function logout() {
    SecureStore.deleteItemAsync('token')
      .then(() => SecureStore.deleteItemAsync('username'))
      .catch(() => {})
      .finally(() => {
        setUser(null);
        setMessages([]);
        setPage(1);
      });
  }

  // show the error of a failed request, if the token is not valid go to the login
  function showError(err) {
    if (err.response?.status === 401) {
      Alert.alert('Session expired', 'Please login again');
      logout();
      return;
    }
    Alert.alert('Error', err.response?.data?.error || 'Server not reachable');
  }

  // effect: at the start read the saved token and check that it is still valid
  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('token'),
      SecureStore.getItemAsync('username'),
    ])
      .then(([token, username]) => {
        if (!token || !username) return;
        return axios
          .get(`${API_URL}/messages.php`, {
            params: { page: 1 },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => setUser({ username, token }));
      })
      .catch((err) => {
        // token not valid or expired, delete it and stay on the login
        if (err.response?.status === 401) {
          logout();
        }
      })
      .finally(() => setChecking(false));
  }, []);

  // effect: load the messages from the api when the user, the page or the counter change
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get(`${API_URL}/messages.php`, {
        params: { page },
        headers: authHeaders(),
      })
      .then((response) => {
        const { items, pagination } = response.data;
        const loaded = items.map((post) => toMessage(post, user.username));
        setMessages((prev) => (page === 1 ? loaded : [...prev, ...loaded]));
        setTotalPages(pagination.total_pages);
      })
      .catch(showError)
      .finally(() => setLoading(false));
  }, [user, page, reload]);

  // go back to the first page and load the messages again
  function refreshFeed() {
    if (page === 1) {
      setReload((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }

  // load the next page when the end of the feed is reached
  function loadMore() {
    if (!loading && page < totalPages) {
      setPage(page + 1);
    }
  }

  // create a new message on the server
  function addMessage(text) {
    if (!text.trim()) return;
    axios
      .post(
        `${API_URL}/create_post.php`,
        { content: text },
        { headers: authHeaders() }
      )
      .then(refreshFeed)
      .catch(showError);
  }

  // remove a message by id
  function deleteMessage(id) {
    axios
      .post(`${API_URL}/delete_post.php`, { id }, { headers: authHeaders() })
      .then(refreshFeed)
      .catch(showError);
  }

  // change the text of a message by id
  function editMessage(id, newText) {
    axios
      .post(
        `${API_URL}/edit_post.php`,
        { id, content: newText },
        { headers: authHeaders() }
      )
      .then(refreshFeed)
      .catch(showError);
  }

  // save the token in the secure store and open the app
  function handleLogin(username, token) {
    Promise.all([
      SecureStore.setItemAsync('token', token),
      SecureStore.setItemAsync('username', username),
    ])
      .catch(() => Alert.alert('Error', 'Could not save the login'))
      .finally(() => setUser({ username, token }));
  }

  // loading screen while the saved token is checked
  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#a855f7" size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  // login or sign up screen until the user is logged
  if (!user) {
    return (
      <View style={styles.container}>
        {showRegister ? (
          <Register
            onRegister={handleLogin}
            onGoToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onGoToRegister={() => setShowRegister(true)}
          />
        )}
        <StatusBar style="light" />
      </View>
    );
  }

  // screen layout
  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <Pressable onPress={logout}>
        <Text style={styles.logout}>Logout</Text>
      </Pressable>
      <InputAndButton
        buttonLabel="Send"
        inputLabel="Write here"
        onAddMessage={addMessage}
      />
      <MessageFeed
        messages={messages}
        username={user.username}
        loading={loading}
        onLoadMore={loadMore}
        onDelete={deleteMessage}
        onEdit={editMessage}
      />
      <StatusBar style="light" />
    </View>
  );
}

// styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#0f0a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginBottom: 8,
  },
  logout: {
    color: '#d8b4fe',
    fontSize: 13,
    marginBottom: 10,
  },
});

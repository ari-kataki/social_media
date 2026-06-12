import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InputAndButton from './uI/inputAndButton';
import MessageFeed from './uI/MessageFeed';

const queryClient = new QueryClient();

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', username: "paolo@gmail.com",  text: "first message",    time: "10:30 AM", initials: "P", avatarColor: "#d8b4fe", avatarText: "#6b21a8" },
    { id: '2', username: "franco@gmail.com", text: "second message",   time: "10:45 AM", initials: "F", avatarColor: "#bbf7d0", avatarText: "#166534" },
    { id: '3', username: "user3@gmail.com",  text: "third message",    time: "10:50 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '4', username: "user4@gmail.com",  text: "fourth message",   time: "10:55 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '5', username: "user5@gmail.com",  text: "fifth message",    time: "11:00 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '6', username: "user6@gmail.com",  text: "sixth message",    time: "11:05 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '7', username: "user7@gmail.com",  text: "seventh message",  time: "11:10 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '8', username: "user8@gmail.com",  text: "eighth message",   time: "11:15 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '9', username: "user9@gmail.com",  text: "ninth message",    time: "11:20 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '10', username: "user10@gmail.com", text: "tenth message",   time: "11:25 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '11', username: "user11@gmail.com", text: "eleventh message",time: "11:30 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '12', username: "user12@gmail.com", text: "twelfth message", time: "11:35 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '13', username: "user13@gmail.com", text: "thirteenth message", time: "11:40 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '14', username: "user14@gmail.com", text: "fourteenth message", time: "11:45 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '15', username: "user15@gmail.com", text: "fifteenth message", time: "11:50 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '16', username: "user16@gmail.com", text: "sixteenth message", time: "11:55 AM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '17', username: "user17@gmail.com", text: "seventeenth message", time: "12:00 PM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '18', username: "user18@gmail.com", text: "eighteenth message", time: "12:05 PM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '19', username: "user19@gmail.com", text: "nineteenth message", time: "12:10 PM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
    { id: '20', username: "user20@gmail.com", text: "twentieth message", time: "12:15 PM", initials: "U", avatarColor: "#fef08a", avatarText: "#854d0e" },
  ]);

  const addMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: String(Date.now()),
      username: "me@gmail.com",
      text,
      time,
      initials: "M",
      avatarColor: "#bfdbfe",
      avatarText: "#1e40af",
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const editMessage = (id, newText) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text: newText } : msg))
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <InputAndButton
          buttonLabel="Send"
          inputLabel="Write here"
          onAddMessage={addMessage}
        />
        <MessageFeed
          messages={messages}
          onDelete={deleteMessage}
          onEdit={editMessage}
        />
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'lavender',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

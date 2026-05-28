import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import rawMessages from '../data/messages.json';
import { userProfiles } from '../data/userProfiles';

// Enrich messages with user profile data
const messages = rawMessages.map(msg => ({
  ...msg,
  ...userProfiles[msg.username],
}));

export default function MessageFeed() {
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;
  
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.feed}>
        {currentMessages.map((msg) => (
          <View key={msg.id} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: msg.avatarColor }]}>
              <Text style={[styles.avatarText, { color: msg.avatarText }]}>
                {msg.initials}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.username}>{msg.username}</Text>
              <Text style={styles.text}>{msg.text}</Text>
              <Text style={styles.time}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        <Pressable
          style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={currentPage === 1}
        >
          <Text style={styles.buttonText}>← Previous</Text>
        </Pressable>

        <Text style={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </Text>

        <Pressable
          style={[styles.button, currentPage === totalPages && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.buttonText}>Next →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
  },
  feed: {
    width: '100%',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 30,
    maxHeight: 800,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  pageIndicator: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
});
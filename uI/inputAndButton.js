// imports
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function InputAndButton({ buttonLabel, inputLabel, onAddMessage }) {
  // state: text typed in the input
  const [inputText, setInputText] = useState('');

  // send the typed message and clear the input
  const handlePress = () => {
    if (inputText.trim()) {
      onAddMessage(inputText);
      setInputText('');
    }
  };

  // fetch a random post title from the api and add it as a message
  const handleDownload = async () => {
    const randomId = Math.floor(Math.random() * 100) + 1;
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
    onAddMessage(data.title);
  };

  // input row and download button
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={inputLabel}
          placeholderTextColor="#7c6f94"
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadText}>Download Message</Text>
      </Pressable>
    </View>
  );
}

// styles
export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3b2a5c',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a1326',
    color: '#f3e8ff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#a855f7',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  downloadButton: {
    borderWidth: 1,
    borderColor: '#3b2a5c',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  downloadText: {
    color: '#d8b4fe',
    fontSize: 13,
    fontWeight: '600',
  },
});

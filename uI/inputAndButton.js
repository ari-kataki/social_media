import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function InputAndButton({ buttonLabel, inputLabel, onAddMessage }) {
  const [inputText, setInputText] = useState('');

  const handlePress = () => {
    if (inputText.trim()) {
      onAddMessage(inputText);
      setInputText('');
    }
  };

  const handleDownload = async () => {
    const randomId = Math.floor(Math.random() * 100) + 1;
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
    onAddMessage(data.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={inputLabel}
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title={buttonLabel} onPress={handlePress} />
      </View>
      <Button title="Download Message" onPress={handleDownload} />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#c084fc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'white',
    fontSize: 14,
  },
});

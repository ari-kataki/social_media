import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import InputAndButton from './uI/inputAndButton';
import MessageFeed from './uI/MessageFeed';

export default function App() {
  return (
    <View style={styles.container}>
      <InputAndButton buttonLabel='click' inputLabel='Write here' ></InputAndButton>
      <MessageFeed />
      <Text style={styles.text}>Hello World!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'violet',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smiley: {
    fontSize: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import InputAndButton from './uI/inputAndButton';
import MessageFeed from './uI/MessageFeed';

export default function App() {
  return (
    <View style={styles.container}>
      <InputAndButton buttonLabel='click' inputLabel='Write here' ></InputAndButton>
      <MessageFeed />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'violet',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

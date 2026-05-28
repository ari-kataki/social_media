import { View, TextInput, Button } from 'react-native'

export default function InputAndButton(props) {
  return (
    <View style={{flexDirection: 'row', gap: 7, alignItems: 'center'}} >
      <TextInput placeholder={props.inputLabel} />
      <Button title={props.buttonLabel} />
    </View>
  );
}
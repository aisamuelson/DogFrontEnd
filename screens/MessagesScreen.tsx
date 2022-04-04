import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { collection, addDoc, getFirestore, onSnapshot, setDoc, doc } from "firebase/firestore"
import ChatRoomListCell from '../components/ChatRoomListCell'
import { RootTabScreenProps } from '../types';

export default function MessagesScreen({ navigation }: RootTabScreenProps<'TabFour'>) {

  const db = getFirestore()
  try {
    setDoc(doc(db, "test", "testdoc"), {
      messages: [
        {
          inbound: true,
          message: "some message"
        }
      ]
    })
    onSnapshot(doc(db, "test", "testdoc"), (doc) => {
      console.log("data: ", doc.data().messages);
    })
  } catch (e) {

  }
  

  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatRoom', {user: "xricxy1314"})}
      >
        <ChatRoomListCell/>
      </TouchableOpacity>
      <TouchableOpacity>
        <ChatRoomListCell/>
      </TouchableOpacity>
      <TouchableOpacity>
        <ChatRoomListCell/>
      </TouchableOpacity>
      <TouchableOpacity>
        <ChatRoomListCell/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

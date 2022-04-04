import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { collection, addDoc, getFirestore, onSnapshot, setDoc, doc, query, getDocs } from "firebase/firestore"
import ChatRoomListCell from '../components/ChatRoomListCell'
import { RootTabScreenProps } from '../types';
import { useEffect, useLayoutEffect, useState } from 'react';

export default function MessagesScreen({ navigation }: RootTabScreenProps<'TabFour'>) {

  const db = getFirestore()
  const myself = global.email
  const q = query(collection(db, myself));
  const [chatlist, setChatlist] = useState([])
  
  useEffect(() => {
    getDocs(q).then((docs) => {
      var chats = []
      docs.forEach((doc) => {
        chats.push({
          email: doc.id
        })
      })
      setChatlist(chats)
    })
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      var chats = []
      snapshot.docChanges().forEach((change) => {
        chats.push({
          email: change.doc.id
        })
      })
      // var newChats = [...chatlist, ...chats]
      setChatlist((prev) => [...prev, ...chats])
    })
    return () => unsub()
  }, [])

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatRoom', { user: item.email })}
    >
      <ChatRoomListCell
        email={item.email}
      />
    </TouchableOpacity>
  )
  

  return (
    <FlatList
      data={chatlist}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.email}
    />
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

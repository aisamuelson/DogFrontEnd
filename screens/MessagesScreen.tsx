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
  
  // useEffect(() => {
  //   getDocs(q).then((docs) => {
  //     var chats = []
  //     docs.forEach((doc) => {
  //       chats.push({
  //         email: doc.id
  //       })
  //     })
  //     setChatlist(chats)
  //   })
  // }, [])

  useLayoutEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      var chats = []
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          chats.push({
            email: change.doc.id,
            full_name: change.doc.data().full_name,
            avatar: change.doc.data().avatar,
            postid: change.doc.data().postid
          })
        }
      })
      // var newChats = [...chatlist, ...chats]
      setChatlist((prev) => [...prev, ...chats])
    })
    return () => unsub()
  }, [])

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatRoom', { user: item.email, full_name: item.full_name, avatar: item.avatar, postid: item.postid })}
    > 
      <ChatRoomListCell
        email={item.email}
        full_name={item.full_name}
        avatar={item.avatar}
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

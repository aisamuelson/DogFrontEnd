import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { collection, addDoc, getFirestore, onSnapshot, setDoc, doc, query, getDoc, getDocs } from "firebase/firestore"
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList } from '../types';

export default function ChatScreen() {
    const [messages_, setMessages] = useState([]);
    const route = useRoute<RouteProp<RouteParamList, "ChatRoom">>();
    const user_ = route.params.user
    const db = getFirestore()
    const q = query(collection(db, "testuser", user_, "messages"));
    var messageList = []
    useLayoutEffect(() => {
        let unsub = onSnapshot(q, (snapshot) => {
            var messages = []
            snapshot.docChanges().forEach((change) => {
                // console.log(change.type)
                messages.push(change.doc.data().message)
            })
            setMessages(messages)
            // console.log(doc.docChanges())
        })
        console.log("mounted!")
        return unsub()
    }, [messages_])

    useEffect(() => {
        getDocs(q).then((docs) => {
            var messages = []
            docs.forEach((doc) => {
                messages.push(doc.data().message)
            })
            setMessages(messages)
        })
    }, [])

    // useEffect(() => {

    //     getDoc(doc(db, "testuser", user_)).then((docRef) => {
    //         if (!docRef.exists()) {
    //             setDoc(doc(db, "testuser", user_), {
    //                 dummy: ""
    //             })
    //         }
    //         addDoc(collection(db, "testuser", user_, "messages"), {
    //             message: messages_[0],
    //             createdAt: messages_[0].createdAt
    //         })
    //     })

    //     getDoc(doc(db, user_, "testuser")).then((docRef) => {
    //         if (!docRef.exists()) {
    //             setDoc(doc(db, user_, "testuser"), {
    //                 dummy: ""
    //             })
    //         }

    //         addDoc(collection(db, user_, "testuser", "messages"), {
    //             message: messages_[0],
    //             createdAt: messages_[0].createdAt
    //         })
    //     })
    //     // console.log(messages_[0].text)

    // }, [messages_])

    // useEffect(() => {
    //     setMessages(messageList)
    // }, [messageList])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        setDoc(doc(db, 'testuser', user_), {
            dummy: ""
        })
        addDoc(collection(db, "testuser", user_, "messages"), {
            message: messages[0],
            createdAt: messages[0].createdAt
        })
        addDoc(collection(db, user_, "testuser", "messages"), {
            message: messages[0],
            createdAt: messages[0].createdAt
        })
          setDoc(doc(db, user_, 'testuser', 'messages', (new Date()).getTime().toString()), {
            message: messages[0]
          })
    }, [])

    return (
        <GiftedChat
            messages={messages_}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: 'testuser',
                name: 'testuser',
                avatar: 'placeholder.com'
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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

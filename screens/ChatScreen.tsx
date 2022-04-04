import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { collection, addDoc, getFirestore, onSnapshot, setDoc, doc, query, getDoc, getDocs, orderBy } from "firebase/firestore"
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList } from '../types';

export default function ChatScreen() {
    const [messages_, setMessages] = useState([]);
    const route = useRoute<RouteProp<RouteParamList, "ChatRoom">>();
    const user_ = route.params.user
    const myself = global.email
    const db = getFirestore()
    const q = query(collection(db, myself, user_, "messages"), orderBy("createdAt", "desc"));
    var messageList = []

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages_]
    )

    useLayoutEffect(() => {
        let unsub = onSnapshot(q, (snapshot) => {
            var messages = []
            console.log(`${myself} received a message`)
            snapshot.docChanges().forEach((change) => {
                // console.log(change.type)
                let msg = change.doc.data().message
                appendMessages([{
                    _id: msg._id,
                    createdAt: msg.createdAt.toDate(),
                    text: msg.text,
                    user: {
                        _id: msg.user._id,
                        avatar: msg.user.avatar,
                        name: msg.user.name
                    }
                }])
                // console.log("changed!")
            })
            // console.log(doc.docChanges())
        })
        // console.log("mounted!")
        return () => unsub()
    }, [])

    useEffect(() => {
        getDocs(q).then((docs) => {
            var messages = []
            docs.forEach((doc) => {
                // messages.push(doc.data().message)
                let msg = doc.data().message
                // console.log(msg.createdAt.toDate())
                messages.push( {
                    _id: msg._id,
                    createdAt: msg.createdAt.toDate(),
                    text: msg.text,
                    user: {
                        _id: msg.user._id,
                        avatar: msg.user.avatar,
                        name: msg.user.name
                    }
                })
            })
            setMessages(messages)
        })
    }, [])

    const onSend = useCallback((messages = []) => {

        setDoc(doc(db, myself, user_), {
            dummy: ""
        })
        addDoc(collection(db, myself, user_, "messages"), {
            message: messages[0],
            createdAt: messages[0].createdAt
        })
        setDoc(doc(db, user_, myself), {
            dummy: ""
        })
        addDoc(collection(db, user_, myself, "messages"), {
            message: messages[0],
            createdAt: messages[0].createdAt
        })
    }, [])

    return (
        <GiftedChat
            messages={messages_}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: myself,
                name: myself,
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

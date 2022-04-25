import { ScrollView, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { collection, addDoc, getFirestore, onSnapshot, setDoc, doc, query, getDoc, getDocs, orderBy } from "firebase/firestore"
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList } from '../types';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChatScreen() {
    const [messages_, setMessages] = useState([]);
    const route = useRoute<RouteProp<RouteParamList, "ChatRoom">>();
    const user_ = route.params.user;
    const user_full_name = route.params.full_name;
    const user_avatar = route.params.avatar;
    const myself = global.email;
    const myname = global.full_name;
    const post = route.params.postid;
    const [petdata, setPetdata] = useState(null)
    console.log(post)
    let myavatar = global.avatar;
    if (myavatar === undefined) {
        myavatar = null
    }
    const db = getFirestore()
    const q = query(collection(db, myself, user_, "messages"), orderBy("createdAt", "desc"));
    var messageList = []

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages_]
    )

    const maleComponent = () => {
        return (
          <View style={styles.hstack}>
            <MaterialCommunityIcons name="gender-male" size={24} color="black" />
            <Text style={styles.petListItem}>&nbsp;
              <Text>Male</Text>
            </Text>
          </View>
        )
    }
    
    const femaleComponent = () => {
        return (
            <View style={styles.hstack}>
                <MaterialCommunityIcons name="gender-female" size={24} color="black" />
                <Text style={styles.petListItem}>&nbsp;
                    <Text>Female</Text>
                </Text>
            </View>
        )
    }

    const renderPostCard = ( postid: number ) => {
        if (petdata !== null) {
            let genderComponent;
            if (petdata?.petid.gender === "M") {
                genderComponent = maleComponent
            } else {
                genderComponent = femaleComponent
            }
            return (
                <View style={styles.petCardContainer}>
                    <Image
                        source={{ uri: petdata?.image ?? "" }}
                        style={{ height: "100%", aspectRatio: 1, borderRadius: 20 }}
                    />
                    <View style={styles.flexV}>
                        <View style={styles.hstack}>
                            <Text> {petdata?.petid.petname} - {petdata?.petid.breed} </Text>
                        </View>
                        <View style={styles.spacer}/>
                        {genderComponent()}
                    </View>
                </View>
            )
        }
        else {
            return (
                <View><Text>Didn't get it</Text></View>
            )
        }
    }

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
            })
        })
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

    useEffect(() => {
        let mounted = true
        const petHeaderConfig = {
            headers: {
            'Authorization': `Bearer ${global.token}`,
            }
        }
        const url = `http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/${post}`
        axios.get(url, petHeaderConfig).then((response) => {
            setPetdata(response.data)
        }).catch((error) => {
            console.log(error)
        })
        return () => { mounted = false }

    }, [])

    const onSend = useCallback((messages = []) => {

        console.log(messages)

        setDoc(doc(db, myself, user_), {
            full_name: user_full_name,
            avatar: user_avatar,
            postid: post
        })
        addDoc(collection(db, myself, user_, "messages"), {
            message: messages[0],
            createdAt: messages[0].createdAt
        })
        setDoc(doc(db, user_, myself), {
            full_name: myname,
            avatar: myavatar,
            postid: post
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
                name: myname,
                avatar: myavatar
            }}
            renderChatFooter={() => renderPostCard(post)}
            showUserAvatar={true}
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

    petCardContainer: {
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10
    },
    
    flexV: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "baseline",
        marginLeft: 20
        // borderWidth: 2,
    },

    spacer: {
      flex: 1,
    },

    hstack: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      padding: 5
    },
});

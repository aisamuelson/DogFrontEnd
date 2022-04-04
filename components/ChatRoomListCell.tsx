import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function ChatRoomListCell(prop) {
  
  return (
    <View style={styles.cell}>
      <View style={styles.icon}></View>
      <View style={styles.content}>
        <Text style={styles.title}>{prop.email}</Text>
        {/* <Text style={styles.snippet} numberOfLines={2}>Snippet of the messageSnippet of the messageSnippet of the messageSnippet of the message</Text> */}
      </View>
      {/* <View style={styles.mark}></View> */}
    </View>
  )
}
  
  const styles = StyleSheet.create({
    cell: {
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      marginBottom: 20,
    },
  
    content: {
      // borderWidth: 2,
      marginLeft: 20,
      flex: 1
    },
  
    icon: {
      height: 80,
      width: 80,
      backgroundColor: "#818181",
      borderRadius: 10
    },
  
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  
    snippet: {
      fontSize: 18,
      fontWeight: "normal",
      color: "#818181",
      marginTop: 8,
    },
  
    mark: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "red"
    }
  });
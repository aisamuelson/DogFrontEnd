import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ListRenderItem, Image } from 'react-native';
import appstyles from '../app-styles'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList, ListingProps } from '../types';

export default function DetailScreen() {
  const route = useRoute<RouteProp<RouteParamList, 'Detail'>>();
  const data = route.params.item;
  //console.log(data);

  return (
    <SafeAreaView>
      <View style={styles.imageContainerStyle}>
        <Image style={styles.imageStyle}
          source={{uri:data.avatar}}
        />
      </View>
      <View style={
        styles.textContainerStyle
      }>
        <Text style={styles.petListItemName}>{data.name}</Text>
        <Text style={styles.petListItem}>Breed:&nbsp;
          <Text>{data.breed}</Text>
        </Text>
        <Text style={styles.petListItem}>Info:&nbsp;
          <Text></Text>
        </Text>
        <Text style={styles.petListItem}>Info:&nbsp;
          <Text></Text>
        </Text>
        <Text style={styles.petListItem}></Text>
        <Text style={styles.petListItem}>Owner Contact Info:&nbsp;
          <Text></Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  petListItemName: {
    fontWeight:'bold',
    fontSize:30,
    marginBottom:10
  },

  petListItem: {
    fontSize:16,
    marginBottom:5
  },

  imageContainerStyle: {
    height: 350,
    alignItems: 'center'
  },

  textContainerStyle: {
    padding: 15
  },

  imageStyle:{
    width: '100%',
    height:'100%',
  },
});
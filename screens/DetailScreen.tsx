import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList, ListingProps, PetInfo, PostInfo } from '../types';
import axios from 'axios';
import APIs from '../constants/APIs';

export default function DetailScreen() {
  const route = useRoute<RouteProp<RouteParamList, 'Detail'>>();
  const data = route.params.item;
  const id = data.id;

  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);

  const headerConfig = {
    headers: {
      'Authorization': APIs.tempAuth
    }
  }

  useEffect(() => {
    axios.get<PostInfo[]>(APIs.myPosts, headerConfig)
    .then((response) => {
      const posts = response.data;
      posts.forEach(post => {
        if(post.petid.petid + '' == id){
          setPetInfo(post.petid);
        }
      });
    })
    .catch((error) =>{
      console.log(error);
    })
  }, [])

  if (petInfo == null) return null;
  //console.log(petInfo);
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
        <Text style={styles.petListItem}>Species:&nbsp;
          <Text>{petInfo.pettype}</Text>
        </Text>
        <Text style={styles.petListItem}>Breed:&nbsp;
          <Text>{petInfo.breed}</Text>
        </Text>
        <Text style={styles.petListItem}>Age:&nbsp;
          <Text>{petInfo.age_year}</Text>
        </Text>
        <Text style={styles.petListItem}>Birthday:&nbsp;
          <Text>{petInfo.birthday}</Text>
        </Text>
        <Text style={styles.petListItem}>Sex:&nbsp;
          <Text>{petInfo.gender}</Text>
        </Text>
        <Text style={styles.petListItem}>Neutered:&nbsp;
          <Text>{petInfo.neutered ? 'Yes' : 'No'}</Text>
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
    alignItems: 'center',
  },

  textContainerStyle: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  imageStyle:{
    width: '100%',
    height:'100%',
  },
});
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ListRenderItem, Image } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootTabScreenProps, ListingProps, PostInfo } from '../types';
import { PetListingCard } from "../components/PetListingCard";
import APIs from '../constants/APIs';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export default function ProfileScreen({ navigation }: RootTabScreenProps<'TabFive'>) {
  const textColor = Colors[useColorScheme()].text;

  // Profile Info //
  const [imageURL, setImageURL] = useState<string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageURL(result.uri);
    }
  };

  let userEmail = global.email;

  // Posts //
  const [posts, setPosts] = useState<PostInfo[]>([]);

  useEffect(() => {
    axios.get<PostInfo[]>(APIs.myPosts, APIs.getParams(global.token))
    .then((response) => {
      setPosts(response.data);
      //console.log(posts);
    })
    .catch((error) =>{
      console.log(error);
    })
  }, [])
  //console.log(posts);



  const handleAdd = (id: number) => {
    const petaddFavURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/favorites/add';
    const petaddFavHeader = {
      headers: {
        'Authorization': `Bearer ${global.token}`,
        'content-type': 'application/json'
      }
    }
    const data = JSON.stringify( {
      postid: id
    })
    axios.post(
      petaddFavURL,
      data,
      petaddFavHeader
    ).then(( response ) => {
      Alert.alert("Success", "", [{text: "OK"}])
    }).catch(( error ) => {
      Alert.alert("Failed", "You've already added this pet to favorite!", [{text: "OK"}])
    })
  }

  const listings = posts.map((post) => {
    const listing: ListingProps = {
      id: '' + post.postid,
      name: post.petid.petname,
      breed: post.petid.breed,
      avatar: post.image,
    }
    return listing;
  })

  const renderItem: ListRenderItem<ListingProps> = ({item}) => (
    <TouchableOpacity
      onPress={()=>navigation.navigate('Detail', {item})}
    >
      <PetListingCard
          id = {item.id}
          name = {item.name}
          breed = {item.breed}
          avatar = {item.avatar}
          handleAdd = {handleAdd}
          // description = {item.description}
      />
    </TouchableOpacity>
  );

  // const{name, email} = route.params;
  
  return (
    <SafeAreaView style={[styles.container,{
      flexDirection:"column"
    }]}>
      <View style={{ 
        flex: 1,
        flexDirection:"row",
        alignItems:"center"
      }}>
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity 
            style={styles.roundButton}
            onPress={pickImage}>
            {imageURL == '' 
              ? <Text>Picture</Text>
              : <Image
                  source={{uri:imageURL}}
                  style={{ width: "130%", aspectRatio: 1 }}
                />
            }
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "transparent"
        }}>
          <Text style={{
            fontSize: 18,
            marginBottom: 10,
            color: textColor
          }}>{userEmail}</Text>
          {false && //TODO: add more user info. Perhaps edit profile?
          <Text style={{
            color: textColor
          }}>About me...</Text>
          }
        </View>
      </View>
      <View style={{ 
        flex: 4, 
        //backgroundColor: "green"
      }}>
        {
        <FlatList
          data = {listings}
          renderItem = {renderItem}
          keyExtractor = {item => item.id}
        />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  roundButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'grey',
    overflow: 'hidden'
  },
  pillButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#FB6565',
    margin: 10
  }
});

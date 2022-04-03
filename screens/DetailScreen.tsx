import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RouteParamList, ListingProps, PetInfo, PostInfo } from '../types';
import axios from 'axios';
import APIs from '../constants/APIs';
import { FontAwesome, MaterialCommunityIcons, Foundation } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
/**
 * 
 * Improvements to be made:
 * 1. Display more information on detail page
 * 2. Styling looks too simple
 * 3. should be able to add to favorite in detail page
 */
export default function DetailScreen() {
  const route = useRoute<RouteProp<RouteParamList, 'Detail'>>();
  const data = route.params.item;
  const id = data.id;

  const [postInfo, setPostInfo] = useState<PostInfo>();

  useEffect(() => {
    axios.get<PostInfo>(APIs.postAPI + '/' + `${id}`, APIs.getParams(global.token))
      .then((response) => {
        const post = response.data;
        setPostInfo(post)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  if(postInfo == null) return null;

  const petInfo = postInfo.petid;

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

  let genderComponent;

  if (petInfo == null) return null;
  if (petInfo.gender === "M") {
    genderComponent = maleComponent
  } else {
    genderComponent = femaleComponent
  }
  //console.log(petInfo);
  return (
    <SafeAreaView>
      <View style={styles.imageContainerStyle}>
        <Image style={styles.imageStyle}
          source={{ uri: data.avatar }}
        />
      </View>
      <View style={
        styles.textContainerStyle
      }>
        <View style={styles.titleContainer}>
          <Text style={styles.petListItemName}>{data.name}</Text>
          <Text style={styles.subtitle}>{petInfo.pettype} - {petInfo.breed}</Text>
        </View>
        <View style={styles.hstack}>
          <MaterialCommunityIcons name="candle" size={24} color="black" />
          <Text style={styles.petListItem}>&nbsp;
            <Text>{petInfo.age_year} yo</Text>
          </Text>
        </View>
        <View style={styles.hstack}>
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.petListItem}>&nbsp;
            <Text>{petInfo.birthday}</Text>
          </Text>
        </View>
        {genderComponent()}
        <View style={styles.hstack}>
          <MaterialCommunityIcons name="bandage" size={24} color="black" />
          <Text style={styles.petListItem}>&nbsp;
            <Text>{(petInfo.neutered ? '' : 'Not ') + (petInfo.gender == 'M' ? 'Neutered' : 'Spayed')}</Text>
          </Text>
        </View>
        <View style={styles.hstack}>
          <FontAwesome name="question-circle-o" size={24} color="black" />
          <Text style={styles.petListItem}>&nbsp;
            <Text>{postInfo.desc}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, {marginTop: 10}]}
          onPress={() => handleAdd(id)}
        >
          <Text style={styles.buttonText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  petListItemName: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 5
  },

  petListItem: {
    fontSize: 16,
    // marginBottom:5
    marginLeft: 8
  },

  imageContainerStyle: {
    height: 350,
    alignItems: 'center',
  },

  textContainerStyle: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  imageStyle: {
    width: '100%',
    height: '100%',
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },

  subtitle: {
    fontSize: 20
  },

  hstack: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 5
  },
  addButton: {
    borderRadius: 10,
    backgroundColor: "dodgerblue",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "white",
    fontWeight: "800"
  },
});
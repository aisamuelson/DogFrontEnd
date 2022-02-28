import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ListRenderItem, Image,
} from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React, {useState} from "react";



type listingProps = {
  id: string,
  name: string,
  breed: string,
  avatar: string
};


const testPetList: listingProps[] = [
  {id:'dog1',
    name: 'Dog',
    breed:'dog',
    avatar:'https://i.insider.com/5484d9d1eab8ea3017b17e29?width=600&format=jpeg&auto=webp'},
  {id:'dog2',
    name: 'DogDog',
    breed:'dog',
    avatar:'https://imageio.forbes.com/specials-images/imageserve/5db4c7b464b49a0007e9dfac/Photo-of-Maltese-dog/960x0.jpg?fit=bounds&format=jpg&width=960'},
  {id: 'dog3',
    name: 'DogDogDog',
    breed:'dog',
    avatar:'https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-732x549-thumbnail-732x549.jpg'},
  {id: 'cat1',
    name: 'Cat',
    breed:'cat',
    avatar:'https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg'},
  {id: 'cat2',
    name: 'CatCat',
    breed:'cat',
    avatar:'https://www.cathealth.com/images/cat_with_two_different_eye_colors.jpg'},
  {id: 'ferret1',
    name: 'Ferret',
    breed:'ferret',
    avatar:'https://www.gardeningknowhow.com/wp-content/uploads/2016/09/ferret.jpg'},
];


const PetListing = (prop: listingProps) => (
    <View style={styles.petListContainer}>
      <View style={styles.petListItemContainer}>
        <Image
            style={styles.imageStyle}
            source={{uri:prop.avatar}}
        />
      </View>
        <View style={{padding:20}}>
          <Text style={styles.petListItemName}>{prop.name}</Text>
          <Text style={styles.petListItemBreed}>Breed:&nbsp;
            <Text>{prop.breed}</Text>
          </Text>
        </View>
        <TouchableOpacity
            style={styles.viewMoreStyle}
            onPress={()=>alert("Remove Pet")}>
          <Text style={styles.viewMoreFont}>View more {'>'} </Text>
        </TouchableOpacity>
    </View>
);

export default function HomeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const renderItem: ListRenderItem<listingProps> = ({item}) => (
      <PetListing
          id = {item.id}
          name = {item.name}
          breed = {item.breed}
          avatar = {item.avatar}
      />);

  return (
    <SafeAreaView>
      <FlatList
          data={testPetList}
          renderItem={renderItem}
      />
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    flexDirection:'column',
  },

  petListContainer:{
    flex:1,
    flexDirection: "column",
    marginHorizontal: 5,
    marginBottom: 10,
    height: 400,
  },

  petListItemContainer:{
    alignItems:'center',
    flex:7,
  },

  petListItemName: {
    fontWeight:'bold',
    fontSize:30,
    marginBottom:10
  },
  petListItemBreed: {
    fontSize:16,
    marginBottom:2},
  imageStyle:{
    width: '100%',
    height:'100%',
  },

  viewMoreStyle:{
    position:'absolute',
    bottom:0,
    right:0,
  },
  viewMoreFont: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});

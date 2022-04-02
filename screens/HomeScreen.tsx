import { SafeAreaView,  FlatList,  TouchableOpacity,  ListRenderItem, Image, Button, Platform, Text, View, StyleSheet } from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, {useState, useEffect} from "react";
import axios from 'axios';
import SearchBar from "../components/SearchBar";
import { PetListingCard } from "../components/PetListingCard";
import * as Location from 'expo-location';

const petListURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/posts';
const petListConfig = {
  headers:{
    'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InhyaWN4eTEzMTRAZ21haWwuY29tIiwiZXhwIjoxNjQ5MTIzNjg4fQ.aVqzYNBNTBCQYwdcakDWdZ2ZZQC4fPWn2YQYKCzobGo",
    'accept': 'application/json',
    'content-type': 'application/json'
  }
}

function parseListRes(data){
  let parsedData: { id: string; name: string; breed: string; avatar: string; description: string; }[] = [];
  data.forEach((item) =>{
    console.log("this post is:", item);
    let post ={
      id: item.postid,
      name: item.petid.petname,
      breed: item.petid.breed,
      avatar:item.image,
      description: item.desc
    }
    parsedData.push(post);
  });
  console.log("inside parseListRes:",parsedData);
  return parsedData;
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [petList, setPetList] = useState([]);


  console.log("hey!");

  useEffect(() => {
    axios
        .get(petListURL, petListConfig)
        .then(async function (response) {
          let parsedData = parseListRes(response.data);
          // console.log('parsedData is: ',parsedData);

          setPetList(parsedData);
          // console.log('the petlist is:', petList);

        })
        .catch(function (error) {
          console.log(error)
        });
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  },[]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  console.log("location is:" + text);

  const renderItem: ListRenderItem<ListingProps> = ({item}) => (
      <TouchableOpacity
          onPress={()=>navigation.navigate('Detail', {item})}
          // onLongPress={()=>navigation.navigate('GoogleMap',{item})}
      >
        <PetListingCard
            id = {item.id}
            name = {item.name}
            breed = {item.breed}
            avatar = {item.avatar}
            // description = {item.description}
        />
      </TouchableOpacity>);

  return (
      <SafeAreaView style = {{flex:1}}>
        {!clicked}
        <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
            setClicked={setClicked}
        />
        <FlatList
            data={petList}
            renderItem={renderItem}
            keyExtractor={(item, index) => 'key' + index}
        />
      </SafeAreaView>);
}

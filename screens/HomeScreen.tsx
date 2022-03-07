import { SafeAreaView,  FlatList,  TouchableOpacity,  ListRenderItem, Image, Button, RefreshControl } from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, {useState, useEffect} from "react";
import axios from 'axios';
import SearchBar from "../components/SearchBar";
import { PetListingCard } from "../components/PetListingCard";

// const testPetList: ListingProps[] = [
//   {id:'dog1',
//     name: 'Dog',
//     breed:'dog',
//     avatar:'https://i.insider.com/5484d9d1eab8ea3017b17e29?width=600&format=jpeg&auto=webp'},
//   {id:'dog2',
//     name: 'DogDog',
//     breed:'dog',
//     avatar:'https://imageio.forbes.com/specials-images/imageserve/5db4c7b464b49a0007e9dfac/Photo-of-Maltese-dog/960x0.jpg?fit=bounds&format=jpg&width=960'},
//   {id: 'dog3',
//     name: 'DogDogDog',
//     breed:'dog',
//     avatar:'https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-732x549-thumbnail-732x549.jpg'},
//   {id: 'cat1',
//     name: 'Cat',
//     breed:'cat',
//     avatar:'https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg'},
//   {id: 'cat2',
//     name: 'CatCat',
//     breed:'cat',
//     avatar:'https://www.cathealth.com/images/cat_with_two_different_eye_colors.jpg'},
//   {id: 'ferret1',
//     name: 'Ferret',
//     breed:'ferret',
//     avatar:'https://www.gardeningknowhow.com/wp-content/uploads/2016/09/ferret.jpg'},
// ];

function parseListRes(data){
    let parsedData: { id: string; name: string; breed: string; avatar: string; description: string; }[] = [];
    data.forEach((item) =>{
        // console.log("this post is:", item);
        let post ={
            id: item.postid,
            name: item.petid.petname,
            breed: item.petid.breed,
            avatar:item.image,
            description: item.desc
        }
        parsedData.push(post);
    });
    // console.log("inside parseListRes:",parsedData);
    return parsedData;
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {



  const petListURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/posts';
  const petListConfig = {
    headers:{
      'Authorization': `Bearer ${global.token}`,
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  }

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [petList, setPetList] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    axios
        .get(petListURL, petListConfig)
        .then(function (response) {
          let parsedData = parseListRes(response.data);
          // console.log('parsedData is: ',parsedData);

          setPetList(parsedData);
          setRefreshing(false);
          // console.log('the petlist is:', petList);

        })
        .catch(function (error) {
          console.log(error)
          setRefreshing(false)
        })
  }, [])

  useEffect(() => {
    axios
        .get(petListURL, petListConfig)
        .then(function (response) {
          let parsedData = parseListRes(response.data);
          // console.log('parsedData is: ',parsedData);
          
          setPetList(parsedData);
          // console.log('the petlist is:', petList);

        })
        .catch(function (error) {
          console.log(error)
        })
  },[])

  const renderItem: ListRenderItem<ListingProps> = ({item}) => (
      <TouchableOpacity
        onPress={()=>navigation.navigate('Detail', {item})}
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
      {/* <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
      /> */}
      <FlatList
          data={petList}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'key' + index}
          refreshControl= {
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
      />
    </SafeAreaView>);
}

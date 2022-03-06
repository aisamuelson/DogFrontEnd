import { StyleSheet, ScrollView, TouchableOpacity, ListRenderItem, FlatList } from 'react-native';
import { Text, View } from '../components/Themed';
import { FavoritePetCard } from '../components/FavoritePetCard';
import * as React from 'react';
import { RootStackParamList, RootTabParamList, RootTabScreenProps, FavCardProp } from '../types';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import axios from 'axios';


let testFavListData: FavCardProp[] = [
  {
    id: "1",
    name: "Orange",
    avatar: "https://picsum.photos/200/300",
    breed: "Domestic Short Hair",
    sex: "M",
    age: 5,
    neutered: "Yes"
  },

  {
    id: "2",
    name: "Pearl",
    avatar: "https://picsum.photos/200/300",
    breed: "Domestic Short Hair",
    sex: "F",
    age: 6,
    neutered: "Yes"
  }
]

function getData(onDone: any, onError: any) {
  const urlFav = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/favorites/';
  const petHeaderConfig = {
    headers: {
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InhyaWN4eTEzMTRAZ21haWwuY29tIiwiZXhwIjoxNjQ5MTIzNjg4fQ.aVqzYNBNTBCQYwdcakDWdZ2ZZQC4fPWn2YQYKCzobGo",
    }

  }

  axios.get(urlFav, petHeaderConfig)
    .then((response) => {
      onDone(response.data)
    })
    .catch((error) => {
      onError(error.response)
    })
}

function parseResp(data: any) {
  let parsedData = []
  data.forEach((item, index) => {
    let post = item.postid
    let prop = {
      id: post.petid.petowner,
      name: post.petid.petname,
      age: post.petid.age_year,
      neutered: post.petid.neutered ? "Yes" : "No",
      sex: post.petid.gender,
      breed: post.petid.breed,
      avatar: post.image
    }
    parsedData.push(prop)
  });
  return parsedData;
}


export default function FavoritesScreen( { navigation }: RootTabScreenProps<'TabTwo'> ) {

  const [data, setData] = React.useState([])

  React.useEffect(() => {
    getData(
      (data: any) => {
        let parsedData = parseResp(data)
        setData(parsedData)
      },
      (err: any) => {
        console.log(err)
      }
    )
  }, [])

  const renderItem: ListRenderItem<FavCardProp> = ({item}) => (
    <TouchableOpacity
      onPress={()=>navigation.navigate('Detail', {item})}
    >
      <FavoritePetCard 
            id = {item.id}
            name = {item.name}
            avatar = {item.avatar}
            breed = {item.breed}
            sex = {item.sex}
            age = {item.age}
            neutered = {item.neutered}
          />
    </TouchableOpacity>);

  return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        >
        </FlatList>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: 'flex-start',
  }
});

import { StyleSheet, ScrollView, TouchableOpacity, ListRenderItem, FlatList, RefreshControl } from 'react-native';
import { Text, View } from '../components/Themed';
import { FavoritePetCard } from '../components/FavoritePetCard';
import * as React from 'react';
import { RootStackParamList, RootTabParamList, RootTabScreenProps, FavCardProp } from '../types';
import axios from 'axios';

function getData(onDone: any, onError: any) {
  const urlFav = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/favorites/';
  const petHeaderConfig = {
    headers: {
      'Authorization': `Bearer ${global.token}`,
    }
  }

  axios.get(urlFav, petHeaderConfig)
    .then((response) => {
      onDone(response.data)
      console.log("fav page response:", response.data)
    })
    .catch((error) => {
      onError(error)
    })
}

function parseResp(data: any) {
  let parsedData = []
  data.forEach((item, index) => {
    let post = item.postid
    let prop = {
      id: post.postid,
      name: post.petid.petname,
      age: post.petid.age_year,
      neutered: post.petid.neutered ? "Yes" : "No",
      sex: post.petid.gender,
      breed: post.petid.breed,
      avatar: post.image,
    }
    parsedData.push(prop)
  });
  return parsedData;
}


export default function FavoritesScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {

  const [data, setData] = React.useState([])
  console.log(global.token)
  const handleRefresh = () => {
    getData(
      (data: any) => {
        let parsedData = parseResp(data)
        setData(parsedData)
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  const handleRemove = (id) => {
    const urlRemoveFav = `http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/favorites/remove/${id}`;
    console.log(urlRemoveFav)
    const petHeaderConfig = {
      headers: {
        'Authorization': `Bearer ${global.token}`,
      }
    }
    axios.delete(urlRemoveFav, petHeaderConfig)
      .then((response) => {
        handleRefresh()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData(
      (data: any) => {
        let parsedData = parseResp(data)
        setData(parsedData)
        setRefreshing(false)
      },
      (err: any) => {
        console.log(err)
        setRefreshing(false)
      }
    )
  }, [])

  React.useEffect(() => {
    handleRefresh()
  }, [])
  // handleRefresh();

  //refresh when page is in focus
  const unsubscribe = navigation.addListener('focus', handleRefresh);

  const renderItem: ListRenderItem<FavCardProp> = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail', { item })}
    >
      <FavoritePetCard
        id={item.id}
        name={item.name}
        avatar={item.avatar}
        breed={item.breed}
        sex={item.sex}
        age={item.age}
        neutered={item.neutered}
        handleRemove={handleRemove}
      />
    </TouchableOpacity>);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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

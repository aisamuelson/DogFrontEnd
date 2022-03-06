import { StyleSheet, ScrollView, TouchableOpacity, ListRenderItem, FlatList } from 'react-native';
import { Text, View } from '../components/Themed';
import { FavoritePetCard } from '../components/FavoritePetCard';
import * as React from 'react';
import { RootStackParamList, RootTabParamList, RootTabScreenProps, FavCardProp } from '../types';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';


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


export default function FavoritesScreen( { navigation }: RootTabScreenProps<'TabTwo'> ) {

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
          data={testFavListData}
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

// use email instead of username
// make display name optional 
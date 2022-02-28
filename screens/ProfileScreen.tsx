import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ListRenderItem, Image } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type profileProps = {
  id: string,
  name: string,
  age: number,
  sex: string
};

const DATA: profileProps[] = [
  {
    id: 'pet1',
    name: 'Pet 1',
    age: 0,
    sex: "F"
  },
  {
    id: 'pet2',
    name: 'Pet 2',
    age: 99,
    sex: "M"
  }
];

const PetListing = (prop: profileProps) => (
  <View style={{
    flexDirection: "column",
    marginHorizontal: 5,
    marginBottom: 10,
    height: 400
  }}>
    <View style={{
      alignItems:'center',
      flex:7,
      //borderColor:'red',
      //borderWidth:5
    }}>
      <Image
        style={{
          height: '100%',
          width: '100%'
        }}
        source={require('../assets/images/dog-placeholder.jpeg')}
      />
    </View>
    <View style={{
      backgroundColor: "#65D7FB",
      flex:4,
      flexDirection:'row',
    }}>
      <View style={{
        padding:20
      }}>
        <Text style={styles.listingName}>{prop.name}</Text>
        <Text style={styles.listingDetail}>Age:&nbsp;
          <Text>{prop.age}</Text>
        </Text>
        <Text style={styles.listingDetail}>Sex:&nbsp;
          <Text>{prop.sex}</Text>
        </Text>
      </View>
      <TouchableOpacity 
            style={[styles.pillButton, {
              position:'absolute',
              bottom:0,
              right:0
            }]}
            onPress={()=>alert("Remove Pet")}>
            <Text>Remove</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProfileScreen() {
  const textColor = Colors[useColorScheme()].text;

  const renderItem: ListRenderItem<profileProps> = ({item}) => (
    <PetListing 
      id = {item.id}
      name = {item.name}
      age = {item.age}
      sex = {item.sex}
    />
  );
  
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
            onPress={()=>alert("Profile Pic")}>
            <Text>Picture</Text>
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
          }}>Username</Text>
          <Text style={{
            color: textColor
          }}>About me...</Text>
        </View>
      </View>
      <View style={{ 
        flex: 4, 
        //backgroundColor: "green"
      }}>
        <FlatList
          data = {DATA}
          renderItem = {renderItem}
          keyExtractor = {item => item.id}
        />
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
  },
  listingName: {
    fontWeight:'bold',
    fontSize:30,
    marginBottom:10
  }, 
  listingDetail: {
    fontSize:16,
    marginBottom:2
  }
});

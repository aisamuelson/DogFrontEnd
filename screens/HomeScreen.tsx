import { SafeAreaView, FlatList, TouchableOpacity, ListRenderItem, Image, Button, RefreshControl, Alert } from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import * as Location from 'expo-location';
import { Searchbar } from 'react-native-paper';
// import SearchBar from "../components/SearchBar";
import { PetListingCard } from "../components/PetListingCard";


function parseListRes(data) {
    let parsedData: { id: string; name: string; breed: string; avatar: string; description: string; }[] = [];
    data.forEach((item) => {
        let post = {
            id: item.postid,
            name: item.petid.petname,
            breed: item.petid.breed,
            avatar: item.image,
            description: item.desc
        }
        parsedData.push(post);
    });
    return parsedData;
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

    const petListURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/posts';
    const petListConfig = {
        headers: {
            'Authorization': `Bearer ${global.token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
    }

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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

        // if (searchPhrase != null){
        //   let searchURL = petListURL + "?name=" + searchPhrase;
        //   let pulledData = pullData(searchURL);
        //   setPetList(pulledData);
        // }
        // let pulledData = pullData(petListURL);
        // setPetList(pulledData);


        axios
            .get(petListURL + "?name=" + searchPhrase, petListConfig)
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
    // console.log("You searched: " + searchPhrase);

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

    const renderItem: ListRenderItem<ListingProps> = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { item })}
        >
            <PetListingCard
                id={item.id}
                name={item.name}
                breed={item.breed}
                avatar={item.avatar}
                handleAdd={handleAdd}
                // description = {item.description}
            />
        </TouchableOpacity>);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {!clicked}
            {/* <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
      /> */}
            <Searchbar
                placeholder="Search"
                onChangeText={(query) => setSearchPhrase(query)}
                value={searchPhrase}
            />



            <FlatList
                data={petList}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'key' + index}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>);
}

import {
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ListRenderItem,
    RefreshControl,
    Alert,
    View,
    Text,
    Modal,
} from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
// import * as Location from 'expo-location';
import { Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger,} from 'react-native-popup-menu';
// import SearchBar from "../components/SearchBar";
import { PetListingCard } from "../components/PetListingCard";


const filterOptions= [
    {key:0,
     optionType:"Type",
     // options:
     //    {option1:"Cat",
     //     option2:"Dog",
     //     optionKey:0}
    },
    {key:1,
     optionType:"Gender",
     // options:
     //    {option1:"Male",
     //     option2:"Female",
     //     optionKey:1}
    },
    {key:2,
     optionType:"Neutered/Spayed",
     // options:
     //     {option1:"Yes",
     //      option2:"No",
     //     optionKey:2}
    }];

const option1 = ["Cat","Dog"];
const option2 = ["Male","Female"];
const option3 = ["Yes","No"];

function parseListRes(data: any[]) {
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
    const [modalVisible, setModalVisible] = useState(false);
    const [filterMenu, setFilterMenu] = useState([]);

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
        // (async () => {
        //     let { status } = await Location.requestForegroundPermissionsAsync();
        //     if (status !== 'granted') {
        //         setErrorMsg('Permission to access location was denied');
        //         return;
        //     }
        //
        //     let location = await Location.getCurrentPositionAsync({});
        //     setLocation(location);
        // })();
    },[]);

    // let text = 'Waiting..';
    // if (errorMsg) {
    //     text = errorMsg;
    // } else if (location) {
    //     text = JSON.stringify(location);
    // }
    // console.log("location is:" + text);

    console.log("You searched: " + searchPhrase);

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

    const renderSelectionMenu = ({item}) => {
        setFilterMenu(option${item.key});
        return(
        <View>
            <Text>{filterMenu.option1}</Text>
            <Text>{filterMenu.option2}</Text>
        </View>)
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
                placeholder="Breed..."
                onEndEditing={(query) => setSearchPhrase(query.nativeEvent.text)}
                // value={searchPhrase}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}>
                <View style={{flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 22}}>
                    <View style={{margin: 20,
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5}}>
                        <FlatList
                            data={filterOptions}
                            keyExtractor={(item) => item.key}
                            renderItem={renderSelectionMenu}> </FlatList>

                        <MaterialIcons
                            name='close'
                            size={24}
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

                <FlatList
                style={{ flexGrow: 0 }}
                data={filterOptions}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingLeft: 10 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item, index: fIndex }) => {
                    return (
                        <TouchableOpacity onPress={setModalVisible}>
                            <View
                                style={{
                                    height:36,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    marginRight: 10,
                                    marginTop: 10,
                                    marginBottom: 18,
                                    padding: 10,
                                    // borderWidth: 2,
                                    // borderColor: _colors.active,
                                    borderRadius: 12,
                                    backgroundColor: `#DCDCDC`,
                                }}>
                                <Text style={{ color: "black", fontWeight: '500' }}>
                                    {item.optionType}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
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

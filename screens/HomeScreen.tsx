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
    StyleSheet, ScrollView, Button, Pressable,
} from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { PetListingCard } from "../components/PetListingCard";
import {MaterialIcons} from "@expo/vector-icons";
// import {BasicButton} from '@phomea/react-native-buttons';
import GradientButton from 'react-native-gradient-buttons';

const filterOptions= [
    {key:0,
     optionType:"Type"},
    {key:1,
     optionType:"Gender"},
    {key:2,
     optionType:"Neutered/Spayed"}];

let options = [{option: "", key:1}, {option: "", key:2}];
let options1 = ["",""];

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

    // let pullURL = petListURL;

    const [refreshing, setRefreshing] = useState(false);
    const [petList, setPetList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionTriggered, setActionTriggered] = useState("");

    const [searchBreed, setSearchBreed] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchSex, setSearchSex] = useState("");
    const [searchNeuter, setSearchNeuter] = useState("");

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        // handleSearchPhrase(searchPhrase);
        // let pullURL = petListURL +
        //     "?breed=" + searchBreed +
        //     "&type=" + searchType +
        //     "&sex=" + searchSex +
        //     "&neutered=" + searchNeuter;
        //
        // console.log("current pullURL is:" + pullURL);
        axios
            .get(buildURL(), petListConfig)
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
    }, [searchBreed, searchType, searchSex, searchNeuter])

    useEffect(() => {

        // let pullURL = petListURL +
        //     "?breed=" + searchBreed +
        //     "&type=" + searchType +
        //     "&sex=" + searchSex +
        //     "&neutered=" + searchNeuter;
        //
        // console.log("current pullURL is:" + pullURL);
        axios
            .get(buildURL(), petListConfig)
            .then(async function (response) {
                let parsedData = parseListRes(response.data);
                // console.log('parsedData is: ',parsedData);

                setPetList(parsedData);
                // console.log('the petlist is:', petList);

            })
            .catch(function (error) {
                console.log(error)
            });
    },[searchBreed, searchType, searchSex, searchNeuter]);

    const buildURL = () => {
        let pullURL = petListURL +
            "?breed=" + searchBreed
        if (searchType != ""){
            pullURL = pullURL + "&type=" + searchType
        } else if (searchSex != ""){
            pullURL = pullURL + "&sex=" + searchSex
        } else if (searchNeuter != ""){
            pullURL = pullURL + "&neutered=" + searchNeuter}
        console.log("current pullURL is:" + pullURL);
        return pullURL;
    }

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

    // console.log("Your option is:", option);
    // console.log("Your filter phrase is:", filterPhrase);
    //
    // console.log("Your breed is:" + searchBreed);
    // console.log("Your type is:" + searchType);
    // console.log("Your sex is:" + searchSex);
    // console.log("Your neuter is:" + searchNeuter);

    const renderItem: ListRenderItem<ListingProps> = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { item })}>
            <PetListingCard
                id={item.id}
                name={item.name}
                breed={item.breed}
                avatar={item.avatar}
                handleAdd={handleAdd}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Searchbar
                placeholder="Breed..."
                onChangeText={(query) => setSearchBreed(query)}
                // onEndEditing={() => onRefresh()}
                clearTextOnFocus = {true}
                value={searchBreed}
            />

            <ScrollView
                style={{ flexGrow: 0 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 10 }}>

                <Pressable
                    style={styles.optionList}
                    onPress={() => {setModalVisible(true)
                                    setActionTriggered('ACTION_1');}}>
                    <Text style={styles.optionText}>Type</Text>
                </Pressable>

                <Pressable
                    style={styles.optionList}
                    onPress={() => {setModalVisible(true)
                        setActionTriggered('ACTION_2');}}>
                    <Text style={styles.optionText}>Sex</Text>
                </Pressable>

                <Pressable
                    style={styles.optionList}
                    onPress={() => {setModalVisible(true)
                        setActionTriggered('ACTION_3');}}>
                    <Text style={styles.optionText}>Neutered/Spayed</Text>
                </Pressable>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <SafeAreaView style={styles.ModalWrapper}>
                    {actionTriggered === 'ACTION_1' ?
                        <View style={styles.ModalView}>
                            <Pressable onPress={() => {setSearchType("Cat")
                                                        setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Cat</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("Dog")
                                setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Dog</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("")
                                setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Cancel</Text>
                                </View>
                            </Pressable>
                        </View>
                        :
                        actionTriggered === 'ACTION_2' ?
                            <View style={styles.ModalView}>
                                <Pressable onPress={() => {setSearchSex("m")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Male</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchSex("f")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Female</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchSex("")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Cancel</Text>
                                    </View>
                                </Pressable>
                            </View>
                            :
                            <View style={styles.ModalView}>
                                <Pressable onPress={() => {setSearchNeuter("true")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Yes</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("false")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>No</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Cancel</Text>
                                    </View>
                                </Pressable>
                            </View>
                    }
                </SafeAreaView>
            </Modal>

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

const styles = StyleSheet.create({
    optionList:{
        height:36,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginRight: 10,
        marginTop: 15,
        marginBottom: 4,
        padding: 10,
        borderRadius: 12,
        backgroundColor: `#DCDCDC`,
    },
    optionText:{
        color: '#36303F',
        fontWeight: '500',
    },
    ModalWrapper:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    ModalView:{
        // margin: 150,
        height: 350,
        width: 300,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    ModalMenuView:{
        // height:36,
        width: 224,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 18,
        marginBottom: 18,
        padding: 15,
        borderRadius: 12,
        backgroundColor: `#F5F5F5`,
    },
    })

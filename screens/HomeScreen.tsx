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
    StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { RootTabScreenProps, ListingProps } from '../types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { PetListingCard } from "../components/PetListingCard";
import {getPreciseDistance} from 'geolib';


let myLatitude = 0;
let myLongitude = 0;

function parseListRes(data) {
    let parsedData: { id: string; name: string; breed: string; avatar: string; description: string; ownerEmail: string; distance: number }[] = [];
    data.forEach((item) => {
        let post = {
            id: item.postid,
            name: item.petid.petname,
            breed: item.petid.breed,
            weight: item.petid.weight,
            hairlength: item.petid.hairlength,
            avatar: item.image,
            description: item.desc,
            owner: item.petid.petowner.email,
            owner_full_name: item.petid.petowner.full_name,
            owner_avatar: item.petid.petowner.profilePhoto,
            distance: calculateDistance(myLatitude, myLongitude,
                                        item.petid.petowner.latitude, item.petid.petowner.longitude),
        }
        parsedData.push(post);
    });
    return parsedData.sort((a,b)=> a.distance - b.distance);
    // return parsedData;
}

function calculateDistance(myLatitude: number, myLongitude: number,
                           targetLatitude: number, targetLongitude: number){
    if (myLatitude == 0 || myLongitude == 0){
        return 0;
    }
    const myCoords = {latitude: myLatitude, longitude: myLongitude};
    const targetCoords = {latitude: targetLatitude, longitude: targetLongitude};
    let distance = getPreciseDistance(myCoords, targetCoords) / 1000 * 0.621371;
    return distance.toFixed(2);
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

    const petListURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/posts?breed=';
    const petListConfig = {
        headers: {
            'Authorization': `Bearer ${global.token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
    }

    const [page, setPage] = useState(5);

    const [refreshing, setRefreshing] = useState(false);
    const [petList, setPetList] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [actionTriggered, setActionTriggered] = useState("");
    const [buttonTypeText, setButtonTypeText] = useState("Type");
    const [buttonGenderText, setButtonGenderText] = useState("Gender");
    const [buttonNeuterText, setButtonNeuterText] = useState("Neutering");

    const [searchBreed, setSearchBreed] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [searchNeuter, setSearchNeuter] = useState("");

    const userURL = "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/user"

    axios
        .get(userURL, petListConfig)
        .then(function (response){
            myLatitude = response.data.latitude;
            myLongitude = response.data.longitude;
        })
        .catch(function (error){
            console.log(error)
        });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        axios
            .get(buildURL(), petListConfig)
            .then(function (response) {
                let parsedData = parseListRes(response.data.results);
                setPetList(petList.concat(parsedData));

                setRefreshing(false);
            })
            .catch(function (error) {
                console.log(error)
                setRefreshing(false)
            })
    }, [searchBreed, searchType, searchGender, searchNeuter,page])

    useEffect(() => {
        axios
            .get(buildURL(), petListConfig)
            .then(async function (response) {
                let parsedData = parseListRes(response.data.results);
                setPetList(petList.concat(parsedData));
            })
            .catch(function (error) {
                console.log(error)
            });
    },[searchBreed, searchType, searchGender, searchNeuter, page]);

    const buildURL = () => {
        let pullURL = petListURL
        if (searchBreed != ""){
            pullURL = pullURL + searchBreed
        }
        if (searchType != ""){
            pullURL = pullURL + "&type=" + searchType
        }
        if (searchGender != ""){
            pullURL = pullURL + "&gender=" + searchGender
        }
        if (searchNeuter != ""){
            pullURL = pullURL + "&neutered=" + searchNeuter
        }
        // if (searchHair != ""){
        //     pullURL = pullURL + "&hairlength=" + searchHair
        // }
        pullURL = pullURL + "&limit=5&offset=" + page;
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

    // const handlePagination = async() => {
    //     setRenderList(petList.slice(0,page));
    //     setPage(page + 5);
    // }

    const renderItem: ListRenderItem<ListingProps> = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { item })}>
            <PetListingCard
                id={item.id}
                name={item.name}
                weight={item.weight}
                hairlength={item.hairlength}
                breed={item.breed}
                avatar={item.avatar}
                owner={item.owner}
                owner_full_name={item.owner_full_name}
                owner_avatar={item.owner_avatar}
                distance = {item.distance}
                handleAdd={handleAdd}
            />
        </TouchableOpacity>
    );

    // console.log("current pet list is:" + petList);
    // console.log("current render list is:" + renderList);
    // console.log("we are at page:" + page);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Searchbar
                placeholder="Breed..."
                onChangeText={(query) => {setSearchBreed(query)
                    setPetList([])
                    setPage(0)
                }}
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
                    <Text style={styles.optionText}>{buttonTypeText}</Text>
                </Pressable>

                <Pressable
                    style={styles.optionList}
                    onPress={() => {setModalVisible(true)
                        setActionTriggered('ACTION_2');}}>
                    <Text style={styles.optionText}>{buttonGenderText}</Text>
                </Pressable>

                <Pressable
                    style={styles.optionList}
                    onPress={() => {setModalVisible(true)
                        setActionTriggered('ACTION_3');}}>
                    <Text style={styles.optionText}>{buttonNeuterText}</Text>
                </Pressable>

                {/*<Pressable*/}
                {/*    style={styles.optionList}*/}
                {/*    onPress={() => {setModalVisible(true)*/}
                {/*        setActionTriggered('ACTION_4');}}>*/}
                {/*    <Text style={styles.optionText}>{buttonHairText}</Text>*/}
                {/*</Pressable>*/}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <SafeAreaView style={styles.ModalWrapper}>
                    {actionTriggered === 'ACTION_1' ?
                        <View style={styles.ModalView}>
                            <Pressable onPress={() => {setSearchType("Cat")
                                                        setButtonTypeText("Cat")
                                                        setPetList([])
                                                        setPage(0)
                                                        setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Cat</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("Dog")
                                setButtonTypeText("Dog")
                                setPetList([])
                                setPage(0)
                                setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Dog</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("")
                                setButtonTypeText("Type")
                                setPetList([])
                                setPage(0)
                                setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Reset</Text>
                                </View>
                            </Pressable>
                        </View>
                        :
                        actionTriggered === 'ACTION_2' ?
                            <View style={styles.ModalView}>
                                <Pressable onPress={() => {setSearchGender("m")
                                    setButtonGenderText("Male")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Male</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchGender("f")
                                    setButtonGenderText("Female")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Female</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchGender("")
                                    setButtonGenderText("Gender")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Reset</Text>
                                    </View>
                                </Pressable>
                            </View>
                            :
                            // actionTriggered === 'ACTION_3' ?
                            <View style={styles.ModalView}>
                                <Pressable onPress={() => {setSearchNeuter("true")
                                    setButtonNeuterText("Neurtered/Spayed")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Yes</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("false")
                                    setButtonNeuterText("Not Neurtered/Spayed")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>No</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("")
                                    setButtonNeuterText("Neutering")
                                    setPetList([])
                                    setPage(0)
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Reset</Text>
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
                onEndReached={() => {setPage(page + 5)}}
                onEndReachedThreshold={0}
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
        marginBottom: 10,
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

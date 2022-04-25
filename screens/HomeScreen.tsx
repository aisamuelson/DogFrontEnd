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
            distance: calculateDistance(myLatitude, myLongitude, item.petid.petowner.latitude, item.petid.petowner.longitude),
            // latitude: item.petid.petowner.latitude,
            // longitude: item.petid.petowner.longitude
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

    const petListURL = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/posts?limit=5&offset=';
    const petListConfig = {
        headers: {
            'Authorization': `Bearer ${global.token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
    }

    let nextPageURL = "";

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [petList, setPetList] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [actionTriggered, setActionTriggered] = useState("");
    const [buttonTypeText, setButtonTypeText] = useState("Type");
    const [buttonGenderText, setButtonGenderText] = useState("Gender");
    const [buttonNeuterText, setButtonNeuterText] = useState("Neutering");
    const [buttonHairText, setButtonHairText] = useState("Hair Length");

    const [searchBreed, setSearchBreed] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [searchNeuter, setSearchNeuter] = useState("");
    const [searchHair, setSearchHair] = useState("");

    const userURL = "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/user"

    axios
        .get(userURL, petListConfig)
        .then(function (response){
            // console.log("response is:", response.data);
            myLatitude = response.data.latitude;
            myLongitude = response.data.longitude;

            // console.log("My location is: Latitude = ", myLatitude, "Longitude = ", myLongitude);
        })
        .catch(function (error){
            console.log(error)
        });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        axios
            // .get(petListURL, petListConfig)
            .get(buildURL(), petListConfig)
            .then(function (response) {
                // let parsedData = parseListRes(response.data);
                let parsedData = parseListRes(response.data.results);
                // console.log('parsedData is: ',parsedData);

                nextPageURL = response.data.next;

                setPetList(petList.concat(parsedData));
                setRefreshing(false);
                setLoading(false);
                // console.log('the petlist is:', petList);

            })
            .catch(function (error) {
                console.log(error)
                setRefreshing(false)
            })
    }, [searchBreed, searchType, searchGender, searchNeuter, page])

    useEffect(() => {
        axios
            // .get(petListURL, petListConfig)
            .get(buildURL(), petListConfig)
            .then(async function (response) {
                setLoading(true);
                // console.log("respond is: " + JSON.stringify(response.data));
                // let parsedData = parseListRes(response.data);
                let parsedData = parseListRes(response.data.results);

                // console.log('parsedData is: ',parsedData);

                // nextPageURL = response.data.next;

                // setPetListURL(response.data.next);
                setPetList(petList.concat(parsedData));
                setLoading(false);
                // console.log('the petlist is:', petList);

            })
            .catch(function (error) {
                console.log(error)
            });
    },[searchBreed, searchType, searchGender, searchNeuter, page]);

    const buildURL = () => {
        let pullURL = petListURL + page + "&breed=" + searchBreed
        if (searchType != ""){
            pullURL = pullURL + "&type=" + searchType
        }
        if (searchGender != ""){
            pullURL = pullURL + "&gender=" + searchGender
        }
        if (searchNeuter != ""){
            pullURL = pullURL + "&neutered=" + searchNeuter
        }
        if (searchHair != ""){
            pullURL = pullURL + "&hairlength=" + searchHair
        }
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Searchbar
                placeholder="Breed..."
                onChangeText={(query) => setSearchBreed(query)}
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
                                                        setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Cat</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("Dog")
                                setButtonTypeText("Dog")
                                setModalVisible(false)}}>
                                <View style={styles.ModalMenuView}>
                                    <Text style={{fontSize:25}}>Dog</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {setSearchType("")
                                setButtonTypeText("Type")
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
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Male</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchGender("f")
                                    setButtonGenderText("Female")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Female</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchGender("")
                                    setButtonGenderText("Gender")
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
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Yes</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("false")
                                    setButtonNeuterText("Not Neurtered/Spayed")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>No</Text>
                                    </View>
                                </Pressable>

                                <Pressable onPress={() => {setSearchNeuter("")
                                    setButtonNeuterText("Neutering")
                                    setModalVisible(false)}}>
                                    <View style={styles.ModalMenuView}>
                                        <Text style={{fontSize:25}}>Reset</Text>
                                    </View>
                                </Pressable>
                            </View>
                            // :
                            //     <View style={styles.ModalView}>
                            //         <Pressable onPress={() => {setSearchHair("short")
                            //             setButtonHairText("Short")
                            //             setModalVisible(false)}}>
                            //             <View style={styles.ModalMenuView}>
                            //                 <Text style={{fontSize:25}}>Short</Text>
                            //             </View>
                            //         </Pressable>
                            //
                            //         <Pressable onPress={() => {setSearchHair("M")
                            //             setButtonHairText("Medium")
                            //             setModalVisible(false)}}>
                            //             <View style={styles.ModalMenuView}>
                            //                 <Text style={{fontSize:25}}>Medium</Text>
                            //             </View>
                            //         </Pressable>
                            //
                            //         <Pressable onPress={() => {setSearchHair("L")
                            //             setButtonHairText("Long")
                            //             setModalVisible(false)}}>
                            //             <View style={styles.ModalMenuView}>
                            //                 <Text style={{fontSize:25}}>Long</Text>
                            //             </View>
                            //         </Pressable>
                            //
                            //         <Pressable onPress={() => {setSearchHair("")
                            //             setButtonHairText("Hair Length")
                            //             setModalVisible(false)}}>
                            //             <View style={styles.ModalMenuView}>
                            //                 <Text style={{fontSize:25}}>Reset</Text>
                            //             </View>
                            //         </Pressable>
                            //     </View>
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
                onEndReached={() => {setPage(page+5)}}
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

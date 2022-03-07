import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native'
import {ListingProps} from "../types";
// import { color } from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

export function PetListingCard( item: ListingProps) {
    console.log(item)
    return (
        <View style={styles.cardView}>
            <View style={styles.petListItemContainer}>
                <Image
                    style={styles.imageStyle}
                    source={{uri:item.avatar}}
                />
            </View>
            <View style={{padding:20}}>
                <Text style={styles.petListItemName}>{item.name}</Text>
                <Text style={styles.petListItemBreed}>Breed:&nbsp;
                    <Text>{item.breed}</Text>
                </Text>
                {/*<Text style={styles.description}>{item.description}</Text>*/}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardView: {
        flex:1,
        flexDirection: "column",
        marginHorizontal: 5,
        marginBottom: 10,
        height: 400,
        backgroundColor: 'white',
        margin: width * 0.03,
        shadowColor: '#000',
        shadowOffset: { width:0.5, height: 0.5 },
        shadowOpacity: 0.5,
    },
    title: {
        marginHorizontal: width * 0.05,
        marginVertical: width * 0.03,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'

    },
    description: {
        marginVertical: width * 0.05,
        marginHorizontal: width * 0.02,
        color: 'gray',
        fontSize: 18
    },
    image: {
        // height: height / 6,
        // marginLeft: width * 0.05,
        // marginRight: width * 0.05,
        // marginVertical: height * 0.02
        width: '100%',
        height:'100%',
    },
    breed: {
        marginBottom: width * 0.0,
        marginHorizontal: width * 0.05,
        fontSize: 15,
        color: 'gray'

    },
        pettitle: {
            width: "100%",
            marginTop: 20,
            fontSize: 25,
            fontWeight: "bold",
            marginLeft: "10%",
        },
        petListContainer:{
            flex:1,
            flexDirection: "column",
            marginHorizontal: 5,
            marginBottom: 10,
            height: 400,
        },

        petListItemContainer:{
            alignItems:'center',
            flex:7,
        },

        petListItemName: {
            fontWeight:'bold',
            fontSize:30,
            marginBottom:10
        },

        petListItemBreed: {
            fontSize:16,
            marginBottom:2
        },

        imageStyle:{
            width: '100%',
            height:'100%',
        },
})

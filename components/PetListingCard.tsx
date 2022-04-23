import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { ListingCardProp } from "../types";
// import { color } from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

export function PetListingCard(item: ListingCardProp) {
    return (
        <View style={styles.cardView}>
            <View style={styles.petListItemContainer}>
                <Image
                    style={styles.imageStyle}
                    source={{ uri: item.avatar }}
                />
            </View>

            <View style={{ padding: 20, flexDirection: "row" }}>
                <View >
                    <Text style={styles.petListItemName}>{item.name}</Text>
                    <Text style={styles.petListItemBreed}>Breed:&nbsp;
                        <Text>{item.breed}</Text>
                    </Text>
                    <Text style={styles.petListItemBreed}>Distance:&nbsp;
                        <Text>{item.distance} Mile</Text>
                    </Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => item.handleAdd(item.id)}
                >
                    <Text style={styles.buttonText}>Favorite</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 5,
        marginBottom: 20,
        height: 400,
        backgroundColor: 'white',
        margin: width * 0.03,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
    },
    description: {
        marginVertical: width * 0.05,
        marginHorizontal: width * 0.02,
        color: 'gray',
        fontSize: 18
    },
    breed: {
        marginBottom: width * 0.0,
        marginHorizontal: width * 0.05,
        fontSize: 15,
        color: 'gray'

    },
    petListItemContainer: {
        alignItems: 'center',
        flex: 7,
    },

    petListItemName: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 10
    },

    petListItemBreed: {
        fontSize: 16,
        marginBottom: 2
    },

    imageStyle: {
        width: '100%',
        height: '100%',
    },


    addButton: {
        borderRadius: 10,
        backgroundColor: "dodgerblue",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },


    buttonText: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: "white",
        fontWeight: "800"
    },
})

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { RootTabScreenProps, ListingProps, PostInfo } from "../types";
import { PetListingCard2 } from "../components/PetListingCard2";
import APIs from "../constants/APIs";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { Line } from "../components/LogStyles";
import { Icon } from "react-native-elements";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"TabFive">) {
  const textColor = Colors[useColorScheme()].text;

  // Profile Info //
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    axios
      .get(APIs.profilePhoto, APIs.getParams(global.token))
      .then((response) => {
        console.log(response.data);
        const uri = response.data.profilePhoto;
        console.log(uri);
        setImageUri(uri == null ? "" : APIs.address + uri);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      const photoUri = result.uri;
      //setImageUri(photoUri);

      const photoData = new FormData();
      photoData.append("photo", {
        uri: photoUri,
        type: "image/*",
        name: "profile_photo.jpg",
      });
      //console.log('POSTING');
      //console.log(APIs.profilePhoto);
      //console.log(photoData);

      fetch(APIs.profilePhoto, {
        method: "post",
        body: photoData,
        headers: {
          Authorization: `Bearer ${global.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          //console.log('UPLOADED');
          //console.log(response);
          setImageUri(APIs.address + response.profilePhoto);
        })
        .catch((response) => {
          //console.log(response);
          Alert.alert("Profile Photo Not Uploaded");
        });
    }
  };

  let userEmail = global.email;

  // Posts //
  const [posts, setPosts] = useState<PostInfo[]>([]);

  function updatePosts() {
    axios
      .get<PostInfo[]>(APIs.myPosts, APIs.getParams(global.token))
      .then((response) => {
        setPosts(response.data);
        //console.log(posts);
      })
      .catch((error) => {
        //console.log(error);
      });
  }

  useEffect(updatePosts, []);
  //console.log(posts);

  const unsubscribe = navigation.addListener("focus", updatePosts);

  const handleAdd = (id: number) => {
    const petaddFavUri =
      "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/";
    const petaddFavHeader = {
      headers: {
        Authorization: `Bearer ${global.token}`,
        "content-type": "application/json",
      },
    };
    const data = JSON.stringify({
      postid: id,
    });
    const removeUrl = petaddFavUri + id;
    axios
      .delete(removeUrl, petaddFavHeader)
      .then((response) => {
        Alert.alert("Success", "", [{ text: "OK" }]);
      })
      .catch((error) => {
        console.log(error);
        console.log(removeUrl);
        Alert.alert("Failed", "We are having trouble removing this post", [
          { text: "OK" },
        ]);
      });
  };

  const listings = posts.map((post) => {
    const listing: ListingProps = {
      id: "" + post.postid,
      name: post.petid.petname,
      breed: post.petid.breed,
      avatar: post.image,
    };
    return listing;
  });

  const renderItem: ListRenderItem<ListingProps> = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Detail", { item })}>
      <PetListingCard2
        id={item.id}
        name={item.name}
        breed={item.breed}
        avatar={item.avatar}
        handleAdd={handleAdd}
        // description = {item.description}
      />
    </TouchableOpacity>
  );

  // const{name, email} = route.params;
  // console.log(imageUri);
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.roundButton} onPress={pickImage}>
            {imageUri == "" ? (
              <Icon name="plus" type="font-awesome" />
            ) : (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "130%", aspectRatio: 1 }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: textColor,
            }}
          >
            {global.full_name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              color: textColor,
            }}
          >
            {userEmail}
          </Text>
          {false && ( //TODO: add more user info. Perhaps edit profile?
            <Text
              style={{
                color: textColor,
              }}
            >
              About me...
            </Text>
          )}
        </View>
      </View>
      <Line></Line>
      <View
        style={{
          flex: 4,
          //backgroundColor: "green"
        }}
      >
        {
          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  roundButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.brand,
    overflow: "hidden",
  },
  pillButton: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "#FB6565",
    margin: 10,
  },
});

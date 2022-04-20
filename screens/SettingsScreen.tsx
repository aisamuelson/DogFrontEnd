import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Component, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { RootStackParamList } from "../types";
import Colors from "../constants/Colors";
import * as Location from "expo-location";

export default function SettingsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.brand }]}
          onPress={() => {
            navigation.navigate("AdoptPrefs");
          }}
        >
          <Text style={styles.buttonText}>Adoption Preferences</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.green }]}
          onPress={() => {
            // (async () => {
            //   let { status } = await Location.requestForegroundPermissionsAsync();
            //   if (status !== 'granted') {
            //       setErrorMsg('Permission to access location was denied');
            //       console.log("Permission to access location was denied");
            //       return;
            //   }
            //   let location = await Location.getCurrentPositionAsync({});
            //   console.log("hi ", location);

            //   setLocation(location);
            //   let longitude = location.coords.longitude;
            //   let latitude = location.coords.latitude;
            const url =
              "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/update_location";
            const jsonData = JSON.stringify({
              // longitude: longitude,
              // latitude: latitude,
            });
            // axios
            //   .put(url, jsonData)
            //   .then((response) => {
            //     console.log(response.data);
            Alert.alert("Location Updated", "", [{ text: "OK" }]);
            //     navigation.navigate("Root", { screen: "HomeScreen" });
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //     handleMessage("Error - Please Try Again");
            //   });

            // })
          }}
        >
          <Text style={styles.buttonText}>Update Location</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.red }]}
        onPress={() => {
          global.token = null;
          global.email = null;
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 15,
    backgroundColor: "#6D28D9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 60,
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

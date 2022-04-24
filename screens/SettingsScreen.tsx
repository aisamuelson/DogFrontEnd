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
import axios from "axios";
import APIs from "../constants/APIs";

export default function SettingsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disabled, setDisabled] = useState(false);

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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.brand }]}
          disabled={disabled}
          onPress={() => {
            setDisabled(true);
            (async () => {
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                console.log("Permission to access location was denied");
                return;
              }
              let location = await Location.getCurrentPositionAsync({});
              console.log("hi ", location);

              setLocation(location);
              let longitude = location.coords.longitude;
              let latitude = location.coords.latitude;
              const url =
                "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/update_location";
              const jsonData = {
                longitude: longitude,
                latitude: latitude,
              };
              console.log(jsonData);
              const header = {
                headers: { Authorization: `Bearer ${global.token}` },
              };
              axios
                .put(url, jsonData, header)
                .then((response) => {
                  console.log(response.data);
                  Alert.alert("Location Updated", "", [{ text: "OK" }]);
                  setDisabled(false);
                  navigation.navigate("Root", { screen: "HomeScreen" });
                })
                .catch((error) => {
                  Alert.alert("Location Updated", "", [{ text: "OK" }]);
                  navigation.navigate("Root", { screen: "HomeScreen" });
                  console.log(error);
                  //handleMessage("Error - Please Try Again");
                });
            })();
          }}
        >
          <Text style={styles.buttonText}>Update Location</Text>
        </TouchableOpacity>
      </View>

      <View>
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

        <TouchableOpacity
          style={styles.account}
          onPress={() => {
            Alert.alert(
              "Are you sure?",
              "Your account and data will be PERMANENTLY lost!",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    axios
                      .delete(APIs.user, APIs.getParams(global.token))
                      .then((response) => {
                        console.log(response.data);
                        global.token = null;
                        global.email = null;
                        navigation.navigate("Login");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.accountText}>Detele Account</Text>
        </TouchableOpacity>
      </View>
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
  account: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
  accountText: {
    fontSize: 14,
    color: "grey",
  },
});

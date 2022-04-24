import { StyleSheet, TouchableOpacity } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import React, { useState, useEffect } from 'react';
import { Button, Image, Platform, TextInput, Alert, AlertButton } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StyledTextInput, Colors } from './../components/LogStyles'
import DropDownPicker from 'react-native-dropdown-picker';
import { InputTextRowProp } from '../types';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Icon } from 'react-native-elements'
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePicker, Picker, PickerItem } from 'react-native-woodpicker';

const { brand, darkLight, primary } = Colors;
/**
 * 1. Before the server's response, the user should not be able to make another post
 *
 */
function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export default function PostScreen({navigation}) {

  const onHandleSubmit = (parameter: any) => (e: any) => {
    const urlPet = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/mypet';
    const urlPosts = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/myposts';
    const petHeaderConfig = {
      headers: {
        'Authorization': `Bearer ${global.token}`,
        'Content-Type': "application/json"
      }
    }

    setDisabled(true)

    let neutered;
    if (!parameter.neutered) {
      setDisabled(false)
      Alert.alert("Field Error(Neutered)", 'Is your pet neutered? Please indicate \"Yes\" or \"No\"', [{ text: "OK" }])
      return
    }

    if (!parameter.weight) {
      setDisabled(false)
      Alert.alert("Field Error(Weight)", 'How much does your pet weight?', [{ text: "OK" }])
      return
    }

    let weight = parseInt(parameter.weight)

    if (!parameter.hairlength) {
      setDisabled(false)
      Alert.alert("Field Error(Hair Length)", 'How long is your pet\'s hair?', [{ text: "OK" }])
    }

    if (!parameter.name) {
      setDisabled(false)
      Alert.alert("Field Missing", "Please give you furry friend a nice name", [{ text: "OK" }])
      return
    }

    if (!parameter.petType) {
      setDisabled(false)
      Alert.alert("Field Missing", "Please specify the species of your pet", [{ text: "OK" }])
    }
    let breed: string;
    if (!parameter.breed) {
      breed = "N/A"
    } else {
      breed = parameter.breed
    }
    let date = parameter.birthday
    let now = new Date()
    if (isNaN(date) || !date) {
      setDisabled(false)
      Alert.alert("Field Missing", "Invalid date for birthday. Please enter the birthday in format \"YYYY-MM-DD\"(e.g. 2015-03-25)", [{ text: "OK" }])
      return
    } else {
      console.log(monthDiff(date, now))
    }

    if (!parameter.image) {
      setDisabled(false)
      Alert.alert("Field Missing", "Pick a nice photo for your pet please", [{ text: "OK" }])
    }

    if (!parameter.gender) {
      setDisabled(false)
      Alert.alert("Field Missing", "Is your pet a boy or a girl?", [{ text: "OK" }])
    }
    const jsonData = JSON.stringify({
      petname: parameter.name,
      pettype: parameter.petType["value"],
      breed: breed,
      age_year: Math.floor(monthDiff(date, now) / 12),
      age_month: monthDiff(date, now) % 12,
      birthday: parameter.birthday.toISOString().substring(0, 10),
      neutered: parameter.neutered["value"],
      gender: parameter.gender["value"],
      hairlength: parameter.hairlength["value"],
      weight: weight
    })
    console.log(jsonData)
    axios.post(
      urlPet,
      jsonData,
      petHeaderConfig,
    ).then((response) => {
      console.log(response.data)
      const postsData = new FormData()

      const postsHeaderConfig = {
        'Accept': '*/*',
        'Authorization': `Bearer ${global.token}`,
        // 'Content-Type': "multipart/form-data"
      }
      postsData.append('image', {
        uri: parameter.image,
        type: "image/*",
        name: "petphoto.jpg"
      })
      postsData.append('desc', parameter.reason)
      postsData.append('petid', response.data.petid)
      fetch(urlPosts, {
        method: "post",
        body: postsData,
        headers: postsHeaderConfig
      }).then(response => {response.json()
        navigation.navigate("Root", {screen:"HomeScreen"})})
        .then(response => {
          setDisabled(false)
          setImage(null)
          onChangeName(undefined)
          onChangeBirthday(null)
          onChangeBreed(undefined)
          onChangeReason(undefined)
          Alert.alert("Success", "", [{ text: "OK" }])
        })
        .catch(function (response) {
          setDisabled(false)
          //handle error
          console.log(response)
          //Alert.alert("Error", "Please fill out all fields", [{ text: "OK" }])
        });
    })
      .catch((error) => {
        setDisabled(false)
        Alert.alert("Error", "Please fill out all fields", [{ text: "OK" }])
      })
  }

  const [image, setImage] = useState<string | null>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  let [name, onChangeName] = React.useState<string | undefined>(undefined)
  // const [birthday, onChangeBirthday] = React.useState<string | undefined>(undefined)
  let [birthday, onChangeBirthday] = React.useState<Date | null>(null)
  let [neutered, onChangeNeutered] = React.useState<PickerItem>({ label: "Select...", value: true })
  let [breed, onChangeBreed] = React.useState<string | undefined>(undefined)
  let [reason, onChangeReason] = React.useState<string | undefined>(undefined)
  let [petType, setPetType] = useState<PickerItem>({ label: "Select...", value: '' });
  let [hairlength, setHairlength] = useState<PickerItem>()
  let [weight, setWeight] = useState<string>()

  const [disabled, setDisabled] = useState<boolean>(false);
  // const [petTypes, setPetTypes] = useState([
  //   { label: 'Cat', value: 'CAT' },
  //   { label: 'Dog', value: 'DOG' }
  // ]);

  const hairlengths: Array<PickerItem> = [
    { label: "Short", value: "S"},
    { label: "Medium", value: "M"},
    { label: "Long", value: "L"}
  ]

  const neuteredStatus: Array<PickerItem> = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ]

  const petTypes: Array<PickerItem> = [
    { label: "Cat", value: 'CAT' },
    { label: "Dog", value: 'DOG' }
  ]
  const [gender, setGender] = useState<PickerItem>({ label: 'Select...', value: '' });
  const genders: Array<PickerItem> = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' }
  ];
  const handleText = (): string => birthday
    ? birthday.toLocaleDateString()
    : "Set Birthday";
  let imageIcon;
  if (image == undefined) {
    imageIcon = <Icon name="plus" type="font-awesome" />
  } else {
    imageIcon = <Image
      source={{ uri: image }}
      style={{ width: "100%", aspectRatio: 1 }}
    />
  }
  return (
    <KeyboardWrapper>
      <View style={styles.container}>
        <View style={styles.basicInfo}>
          <View style={styles.basicInfoLeft1}>
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
            >
              {imageIcon}
            </TouchableOpacity>
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.basicInfoRight}>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Name:</Text>
              <TextInput
                placeholder="Ex. Oreo"
                onChangeText={onChangeName}
                value={name}
                style={styles.inputBox}
              />
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Species:</Text>
              <Picker
                item={petType}
                items={petTypes}
                onItemChange={setPetType}
                placeholder="Select a Species..."
                style={styles.inputBox}
              // textInputStyle={{color: "#C4C4C4"}}
              />
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Gender:</Text>
              <Picker
                item={gender}
                items={genders}
                onItemChange={setGender}
                placeholder="Select a gender..."
                style={styles.inputBox}
              // textInputStyle={{color: "#C4C4C4"}}
              />
            </View>
          </View>
        </View>
        <View style={styles.detailInfo}>
          <View style={styles.basicInfoLeft}>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Weight:</Text>
              <TextInput
                placeholder="in lb."
                onChangeText={setWeight}
                value={weight}
                style={[styles.inputBox]}
                keyboardType={"numeric"}
              />
            </View>

          </View>
          <View style={styles.spacer}></View>
          <View style={styles.basicInfoRight}>
            <View style={[styles.flexV]}>
              <Text style={{ fontSize: 10 }}>Hair Length:</Text>
              <Picker
                item={hairlength}
                items={hairlengths}
                onItemChange={setHairlength}
                placeholder="..."
                style={styles.inputBox}
              />
            </View>
          </View>
        </View>
        <View style={styles.detailInfo}>
          <View style={styles.basicInfoLeft}>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Birthday:</Text>
              <DatePicker
                value={birthday}
                onDateChange={onChangeBirthday}
                text={handleText()}
                style={styles.inputBox}
              // textInputStyle={{color: "#C4C4C4"}}
              />
            </View>

          </View>
          <View style={styles.spacer}></View>
          <View style={styles.basicInfoRight}>
            <View style={[styles.flexV]}>
              <Text style={{ fontSize: 10 }}>Neutered/Spayed:</Text>
              <Picker
                item={neutered}
                items={neuteredStatus}
                onItemChange={onChangeNeutered}
                placeholder="Select Yes or No"
                style={styles.inputBox}
              />
            </View>
          </View>
        </View>
        <View style={styles.flexV}>
          <Text style={{ fontSize: 10 }}>Breed:</Text>
          <TextInput
            placeholder="Ex. Domestic Short Hair, Husky..."
            onChangeText={onChangeBreed}
            value={breed}
            style={[styles.inputBox]}
          />
        </View>
        <View style={styles.flexV}>
          <Text style={{ fontSize: 10 }}>Reason for Putting Up for Adoption:</Text>
          <TextInput
            placeholder="..."
            onChangeText={onChangeReason}
            value={reason}
            style={[styles.inputBox, { height: 200 }]}
            multiline={true}
          />
        </View>
        <View style={styles.reasonInput}></View>
        <View style={[styles.flexV, { alignItems: "center" }]}>
          <TouchableOpacity
            style={styles.button}
            onPress={onHandleSubmit({
              name: name,
              gender: gender,
              birthday: birthday,
              breed: breed,
              neutered: neutered,
              petType: petType,
              reason: reason,
              weight: weight,
              hairlength: hairlength,
              image: image
            })}
            disabled={disabled}
            >
            <Text style={{ color: "white", fontSize: 24 }}>Make Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  basicInfo: {
    // borderWidth: 2,
    flexDirection: "row",
    marginBottom: 20
  },

  basicInfoLeft: {
    width: "40%"
  },

  basicInfoLeft1: {
    width: "40%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 10
  },

  basicInfoRight: {
    width: "50%",
    // borderWidth: 3,
  },

  detailInfo: {
    flexDirection: "row",
    marginTop: 0
  },

  detailLeft: {
    width: "50%",
  },

  detailRight: {
    width: "50%"
  },

  reasonInput: {

  },

  flexV: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    marginBottom: 20,
    // borderWidth: 2,
  },

  spacer: {
    flex: 1,
  },

  inputBox: {
    height: 30,
    borderWidth: 0,
    width: "100%",
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    paddingLeft: 5,
    shadowRadius: 5,
    marginTop: 3
  },

  picker: {
    height: 30,
    borderWidth: 1,
    alignItems: "stretch",
    width: "100%",
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    shadowRadius: 5,
    marginTop: 3
  },

  button: {
    backgroundColor: Colors.brand,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15
  },

  dropdownContainer: {
    backgroundColor: '#E5E5E5',
    borderWidth: 0,
    zIndex: 10,
    elevation: 10
  },

  dropdownListContainer: {
    borderWidth: 0,
    borderRadius: 5
  }
});

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

const { brand, darkLight, primary } = Colors;

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

const onHandleSubmit = (parameter: any) => (e: any) => {
  const urlPet = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/mypet';
  const urlPosts = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/posts/myposts';
  const petHeaderConfig = {
    headers: {
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InhyaWN4eTEzMTRAZ21haWwuY29tIiwiZXhwIjoxNjQ5MTIzNjg4fQ.aVqzYNBNTBCQYwdcakDWdZ2ZZQC4fPWn2YQYKCzobGo",
      'Content-Type': "application/json"
    }
  }

  let neutered;
  if (parameter.neutered.toLowerCase() == 'yes') {
    neutered = true
  } else if (parameter.neutered.toLowerCase() == 'no') {
    neutered = false
  } else {
    Alert.alert("Field Error(Neutered)", 'Is your pet neutered? Please indicate \"Yes\" or \"No\"', [{text: "OK"}])
    return
  }

  if (!parameter.name) {
    Alert.alert("Field Missing", "Please give you furry friend a nice name", [{text: "OK"}])
    return
  }
  if (!parameter.petType) {
    Alert.alert("Field Missing", "Dog? Cat? Please specify it.", [{text: "OK"}])
  }
  let breed: string;
  if (!parameter.breed) {
    breed = "N/A"
  } else {
    breed = parameter.breed
  }
  let date = new Date(parameter.birthday)
  let now = new Date()
  if (isNaN(date)) {
    Alert.alert("Field Missing", "Invalid date for birthday. Please enter the birthday in format \"YYYY-MM-DD\"(e.g. 2015-03-25)", [{text: "OK"}])
    return
  } else {
    console.log(monthDiff(date, now))
  }

  if (!parameter.image) {
    Alert.alert("Field Missing", "Pick a nice photo for your pet please", [{text: "OK"}])
  }

  const jsonData = JSON.stringify({
    petname: parameter.name,
    pettype: parameter.petType,
    breed: parameter.breed,
    age_year: monthDiff(date, now) % 12,
    age_month: Math.floor(monthDiff(date, now)/12),
    birthday: parameter.birthday,
    neutered: neutered
  })
  axios.post(
    urlPet,
    jsonData,
    petHeaderConfig,
  ).then((response) => {
    console.log(response.data)
    const postsData = new FormData()

    const postsHeaderConfig = {
      'Accept': '*/*',
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InhyaWN4eTEzMTRAZ21haWwuY29tIiwiZXhwIjoxNjQ5MTIzNjg4fQ.aVqzYNBNTBCQYwdcakDWdZ2ZZQC4fPWn2YQYKCzobGo",
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
    }).then(response => response.json())
    .then(response => {
      Alert.alert("Success", "", [{text: "OK"}])
    })
    .catch(function (response) {
        //handle error
        console.log(response)
        Alert.alert("Error", "There is an error on our end", [{text: "OK"}])
    });
  })
    .catch((error) => {
      Alert.alert("Error", "There is an error on our end", [{text: "OK"}])
    })
}

export default function PostScreen() {

  const [image, setImage] = useState<string | null>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const [name, onChangeName] = React.useState<string | undefined>(undefined)
  const [ageYear, onChangeAgeYear] = React.useState<string | undefined>(undefined)
  const [ageMonth, onChangeAgeMonth] = React.useState<string | undefined>(undefined)
  const [birthday, onChangeBirthday] = React.useState<string | undefined>(undefined)
  const [neutered, onChangeNeutered] = React.useState<string | undefined>(undefined)
  const [breed, onChangeBreed] = React.useState<string | undefined>(undefined)
  const [reason, onChangeReason] = React.useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false);
  const [petType, setPetType] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState([
    { label: 'Cat', value: 'CAT' },
    { label: 'Dog', value: 'DOG' }
  ]);

  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)
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
          <View style={styles.basicInfoLeft}>
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
                placeholder="Oreo"
                onChangeText={onChangeName}
                value={name}
                style={styles.inputBox}
              />
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Type:</Text>
              <View style={{ position: "relative", zIndex: 10 }}>
                <DropDownPicker
                  open={open}
                  value={petType}
                  items={petTypes}
                  setOpen={setOpen}
                  setValue={setPetType}
                  setItems={setPetTypes}
                  style={styles.inputBox}
                  listItemContainerStyle={styles.dropdownContainer}
                  dropDownContainerStyle={styles.dropdownListContainer}
                  listMode="SCROLLVIEW"
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.detailInfo}>
          <View style={styles.basicInfoLeft}>
            <View style={styles.flexV}>
              <Text style={{ fontSize: 10 }}>Birthday:</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                onChangeText={onChangeBirthday}
                value={birthday}
                style={styles.inputBox}
              />
            </View>

          </View>
          <View style={styles.spacer}></View>
          <View style={styles.basicInfoRight}>
            <View style={[styles.flexV]}>
              <Text style={{ fontSize: 10 }}>Neutered:</Text>
              <TextInput
                placeholder="Yes/No"
                onChangeText={onChangeNeutered}
                value={neutered}
                style={styles.inputBox}
              />
            </View>
          </View>
        </View>
        <View style={styles.flexV}>
          <Text style={{ fontSize: 10 }}>Breed:</Text>
          <TextInput
            placeholder="Domestic Short Hair, Husky..."
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
              ageYear: ageYear,
              ageMonth: ageMonth,
              birthday: birthday,
              breed: breed,
              neutered: neutered,
              petType: petType,
              reason: reason,
              image: image
            })}>
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
    flexDirection: "row"
  },

  basicInfoLeft: {
    width: "40%"
  },

  basicInfoRight: {
    width: "50%",
    // borderWidth: 3,
  },

  detailInfo: {
    flexDirection: "row",
    marginTop: 60
  },

  detailLeft: {
    width: "50%"
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
    marginBottom: 20
    // borderWidth: 2
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

  button: {
    backgroundColor: "dodgerblue",
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

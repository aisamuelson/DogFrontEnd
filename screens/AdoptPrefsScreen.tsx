import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useState, useEffect } from 'react';
import { Colors } from '../components/LogStyles'
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { DatePicker, Picker, PickerItem } from 'react-native-woodpicker';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * 1. Before the server's response, the user should not be able to make another post
 * 
 */

export default function AdoptPrefsScreen() {

  
  const [petType, setPetType] = useState<PickerItem>({ label: "Cat", value: 'CAT' });
  const [gender, setGender] = useState<PickerItem>({ label: 'Male', value: 'M' });
  const [neutered, onChangeNeutered] = React.useState<PickerItem>({ label: "Yes", value: true })
  const [ageGroup, onChangeAgeGroup] = React.useState<PickerItem>({ label: "< 6 Months Old", value: 0.5 })

  const [disabled, setDisabled] = useState<boolean>(false);

  const ageGroups: Array<PickerItem> = [
    {label: "< 6 Months Old", value: 0.5},
    {label: "6 Months ~ 1 Year Old", value: 1},
    {label: "1 Year ~ 6 Years Old", value: 6},
    {label: "> 6 Years Old", value: 10},
  ]
  
  const neuteredStatus: Array<PickerItem> = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ]

  const petTypes: Array<PickerItem> = [
    { label: "Cat", value: 'CAT' },
    { label: "Dog", value: 'DOG' }
  ]
  
  const genders: Array<PickerItem> = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexV}>
        <Text style={{ fontSize: 10 }}>Type:</Text>
        <Picker
          item={petType}
          items={petTypes}
          onItemChange={setPetType}
          placeholder="Select a type..."
          style={styles.inputBox}
        // textInputStyle={{color: "#C4C4C4"}}
        />
      </View>
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
      <View style={[styles.flexV]}>
        <Text style={{ fontSize: 10 }}>Neutered/Spayed:</Text>
        <Picker
          item={neutered}
          items={neuteredStatus}
          onItemChange={onChangeNeutered}
          placeholder="Is your pet Neutered/Spayed?"
          style={styles.inputBox}
        />
      </View>
      <View style={[styles.flexV]}>
        <Text style={{ fontSize: 10 }}>Age Group:</Text>
        <Picker
          item={ageGroup}
          items={ageGroups}
          onItemChange={onChangeAgeGroup}
          placeholder="How old is the pet you are looking for?"
          style={styles.inputBox}
        />
      </View>
      <TouchableOpacity 
          style={[styles.button, {backgroundColor: Colors.brand}]}
          disabled={disabled}
          onPress={() => {
            //navigation.navigate('Edit');
          }}
      >
          <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },

  flexV: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    marginBottom: 20,
    // borderWidth: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 60,
    marginVertical: 20,
  },
  buttonText: {
      fontSize: 16,
      color: 'white'
  },
});

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import KeyboardWrapper from "../components/KeyboardWrapper";

import {
  StyledContainer,
  InnerContainer,
  SignLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel2,
  StyledTextInput2,
  Colors,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from "./../components/LogStyles";
import { ActivityIndicator } from "react-native";

import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { Picker, PickerItem } from "react-native-woodpicker";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

const { brand, darkLight, primary } = Colors;

const Signup2 = ({ navigation }) => {
  const url =
    "http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/preference";
  const header = { headers: { Authorization: `Bearer ${global.token}` } };
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const [petType, setPetType] = useState<PickerItem>({
    label: "Select...",
    value: "N",
  });
  const [gender, setGender] = useState<PickerItem>({
    label: "Select...",
    value: "N",
  });
  const [ageGroup, onChangeAgeGroup] = React.useState<PickerItem>({
    label: "Select...",
    value: "N",
  });
  const [size, onChangeSize] = React.useState<PickerItem>({
    label: "Select...",
    value: "N",
  });
  const [hairlength, onChangeHairlength] = React.useState<PickerItem>({
    label: "Select...",
    value: "N",
  });

  const petTypes: Array<PickerItem> = [
    { label: "Cat", value: "CAT" },
    { label: "Dog", value: "DOG" },
    { label: "No Preference", value: "N" },
  ];

  const genders: Array<PickerItem> = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "No Preference", value: "N" },
  ];

  const ageGroups: Array<PickerItem> = [
    { label: "< 6 Months Old", value: "K" },
    { label: "6 Months ~ 1 Year Old", value: "J" },
    { label: "1 Year ~ 6 Years Old", value: "A" },
    { label: "> 6 Years Old", value: "S" },
    { label: "No Preference", value: "N" },
  ];

  const sizes: Array<PickerItem> = [
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" },
    { label: "No Preference", value: "N" },
  ];

  const hairlengths: Array<PickerItem> = [
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" },
    { label: "No Preference", value: "N" },
  ];

  //   const handleSignup = (credentials, setSubmitting) => {
  //     axios
  //       .post(url, credentials)
  //       .then((response) => {
  //         navigation.navigate("Root", { screen: "HomeScreen" });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setSubmitting(false);
  //         //handleMessage("Please fill out all fields");
  //       });
  //   };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const onHandleSubmit = (parameter: any) => (e: any) => {
    const jsonData = JSON.stringify({
      pettype: parameter.petType["value"],
      age: parameter.ageGroup["value"],
      gender: parameter.gender["value"],
      hairlength: parameter.hairlength["value"],
      weight: parameter.size["value"],
    });
    console.log(jsonData);
    axios
      .post(url, jsonData, header)
      .then((response) => {
        console.log(response.data);
        navigation.navigate("Root", { screen: "HomeScreen" });
      })
      .catch((error) => {
        console.log(error);
        handleMessage("Error - Please Try Again");
      });
  };

  return (
    <KeyboardWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SignLogo></SignLogo>
          <PageTitle>Pet Adoption App</PageTitle>
          <SubTitle>Adoption Preferences</SubTitle>
          <Formik
            initialValues={{
              petType: "N",
              gender: "N",
              ageGroup: "N",
              size: "N",
              hairlength: "N",
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              //handleSignup(values, setSubmitting);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                {/* // */}
                <SafeAreaView style={styles.container}>
                  <View style={styles.flexV}>
                    <Text style={{ fontSize: 15 }}>Species:</Text>
                    <Picker
                      item={petType}
                      items={petTypes}
                      onItemChange={setPetType}
                      placeholder="Select a species..."
                      style={styles.inputBox}
                      // textInputStyle={{color: "#C4C4C4"}}
                    />
                  </View>
                  <View style={styles.flexV}>
                    <Text style={{ fontSize: 15 }}>Gender:</Text>
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
                    <Text style={{ fontSize: 15 }}>Age Group:</Text>
                    <Picker
                      item={ageGroup}
                      items={ageGroups}
                      onItemChange={onChangeAgeGroup}
                      placeholder="How old is the pet you are looking for?"
                      style={styles.inputBox}
                    />
                  </View>
                  <View style={[styles.flexV]}>
                    <Text style={{ fontSize: 15 }}>Size:</Text>
                    <Picker
                      item={size}
                      items={sizes}
                      onItemChange={onChangeSize}
                      placeholder="How big is the pet you are looking for?"
                      style={styles.inputBox}
                    />
                  </View>
                  <View style={[styles.flexV]}>
                    <Text style={{ fontSize: 15 }}>Hairlength:</Text>
                    <Picker
                      item={hairlength}
                      items={hairlengths}
                      onItemChange={onChangeHairlength}
                      placeholder="What hairlength are you looking for?"
                      style={styles.inputBox}
                    />
                  </View>
                </SafeAreaView>

                {/* // */}

                <MsgBox type={messageType}>{message}</MsgBox>
                {/* {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Save</ButtonText>
                  </StyledButton>
                )} */}

                {!isSubmitting && (
                  <StyledButton
                    style={styles.button}
                    onPress={onHandleSubmit({
                      petType: petType,
                      gender: gender,
                      ageGroup: ageGroup,
                      size: size,
                      hairlength: hairlength,
                    })}
                    //disabled={disabled}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <Line />
                <ExtraView>
                  <ExtraText>Skip this step? </ExtraText>
                  <TextLink
                    onPress={() =>
                      navigation.navigate("Root", { screen: "HomeScreen" })
                    }
                  >
                    <TextLinkContent>Skip</TextLinkContent>
                  </TextLink>
                </ExtraView>
                <SignLogo></SignLogo>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 3,
    backgroundColor: "white",
    paddingTop: -20,
    marginBottom: -20,
  },

  flexV: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    marginBottom: 15,
  },

  inputBox: {
    height: 40,
    borderWidth: 0,
    width: "100%",
    backgroundColor: "#E5E5E5",
    paddingLeft: 5,
    shadowRadius: 5,
    marginTop: 3,
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
    marginTop: 3,
  },

  button: {
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

export default Signup2;

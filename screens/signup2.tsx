import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import {Ionicons, FontAwesome5 } from "@expo/vector-icons";
import KeyboardWrapper from "../components/KeyboardWrapper";

import { StyledContainer, InnerContainer, SignLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput, Colors, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent} from './../components/LogStyles';
import {View, ActivityIndicator} from 'react-native';

import axios from "axios";

const{brand, darkLight, primary} = Colors;

const Signup2 = ({navigation, route}) =>{
    const fullname = route.params.fullname;
    const email = route.params.email;
    const password = route.params.password;

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleSignup = (credentials, setSubmitting) =>{
        handleMessage(null);
        const url = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/register';
        
        axios
            .post(url, credentials)
            .then((response)=>{
                const result = response.data;
                const {email} = result;
                console.log(credentials)
                //if(email !== 'user with this email address already exists.'){
                    navigation.navigate("Login")
                // }else{
                //     handleMessage(email);
                // }
                // setSubmitting(false);
            })
            .catch(error =>{
            console.log(error);
            setSubmitting(false);
            handleMessage("A user with this email address already exists");
        })
    }

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }

    return (
        <KeyboardWrapper>
            <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
            <SignLogo></SignLogo>
                <PageTitle>Pet Adoption App</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik initialValues={{full_name:fullname, email: email, password:password, addressLine:'',city:'',state:'',zipcode:''}} 
                    onSubmit={(values, {setSubmitting}) => {
                        // console.log(values); navigation.navigate("Root", {screen:"HomeScreen"})
                        if(values.addressLine == '' || values.city == '' || values.state == '' || values.zipcode == ''){
                            handleMessage("Please fill out all fields");
                            setSubmitting(false);
                        }else{
                            console.log(values)
                            handleSignup(values, setSubmitting);
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting})=> (<StyledFormArea>
                        <MyTextInput
                            label="Address"
                            icon = "home"
                            placeholder = "1 Dog Ln"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('addressLine')}
                            onBlur = {handleBlur('addressLine')}
                            value = {values.addressLine}
                        />
                        <MyTextInput
                            label="City"
                            icon = "city"
                            placeholder = "Petsville"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('city')}
                            onBlur = {handleBlur('city')}
                            value = {values.city}
                        />
                        <MyTextInput
                            label="State"
                            icon = "globe"
                            placeholder = "AL"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('state')}
                            onBlur = {handleBlur('sate')}
                            value = {values.state}
                        />
                        <MyTextInput
                            label="Zip Code"
                            icon = "map-pin"
                            placeholder = "12345"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('zipcode')}
                            onBlur = {handleBlur('zipcode')}
                            value = {values.zipcode}
                        />
                        <MsgBox type={messageType}>
                            {message}
                        </MsgBox>
                        {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText>Signup</ButtonText>
                        </StyledButton>}

                        {isSubmitting && <StyledButton disabled={true}>
                            <ActivityIndicator size="large" color={primary}/>
                        </StyledButton>}
                        <Line/>
                        <ExtraView>
                            <ExtraText>Already have an account? </ExtraText>
                            <TextLink onPress={() => navigation.navigate("Login")}><TextLinkContent>Login</TextLinkContent></TextLink>
                        </ExtraView>
                        <SignLogo></SignLogo>
                    </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardWrapper>
        
    );
}
const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <FontAwesome5 name={icon} size={30} color={brand}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (<RightIcon onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight}/>
            </RightIcon>)}
        </View>
    );
}
export default Signup2;
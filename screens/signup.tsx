import React, {useState, useContext} from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardWrapper from "../components/KeyboardWrapper";

import { StyledContainer, InnerContainer, SignLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput, Colors, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent} from './../components/LogStyles';
import {View, ActivityIndicator} from 'react-native';

import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';

const{brand, darkLight, primary} = Colors;

const Signup = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleSignup = (credentials, setSubmitting) =>{
        handleMessage(null);
        const url = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/register';
        
        axios
            .post(url, credentials)
            .then((response)=>{
                global.email = credentials.email;

                //log in after registering
                const url = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/login';
                axios
                    .post(url, credentials)
                    .then((response)=>{
                        const result = response.data;
                        const {message, token} = result;
                        global.token = token
                        navigation.navigate("Root", {screen:"HomeScreen"})
                    })
                    .catch(error =>{
                    console.log(error);
                    handleMessage("An error has occurred. Please check your network and try again");
                })

                //const result = response.data;
                //const {email} = result;
                //console.log(credentials)
                //if(email !== 'user with this email address already exists.'){
                    //navigation.navigate("Login")
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

    const persistLogin = (credentials, message, status) =>{
        AsyncStorage.setItem('credentials', JSON.stringify(credentials))
        .then(()=>{
            handleMessage(message, status);
            setStoredCredentials(credentials);
        })
        .catch((error)=>{
            console.log(error);
            handleMessage('Persisting login failed');
        })
    }

    return (
        <KeyboardWrapper>
            <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
            <SignLogo></SignLogo>
                <PageTitle>Pet Adoption App</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik initialValues={{fullname:'',email:'',password:'',confirmPassword:''}} 
                    onSubmit={(values, {setSubmitting}) => {
                        if(values.fullname == '' || values.email == '' || values.password == '' || values.confirmPassword == ''){
                            handleMessage("Please fill out all fields");
                            setSubmitting(false);
                        }else{
                            if(values.password != values.confirmPassword){
                                handleMessage("Passwords do not match");
                                setSubmitting(false);
                            }else{
                                console.log(values)
                                handleSignup(values, setSubmitting);
                            }
                        }  
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting})=> (<StyledFormArea>
                        <MyTextInput
                            label="Email"
                            icon = "mail"
                            placeholder = "example@email.com"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('email')}
                            onBlur = {handleBlur('email')}
                            value = {values.email}
                            keyboardType="email-address"
                        />
                        <MyTextInput
                            label="Full Name"
                            icon = "user"
                            placeholder = "Dog Lover"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('fullname')}
                            onBlur = {handleBlur('fullname')}
                            value = {values.fullname}
                        />
                        <MyTextInput
                            label="Password"
                            icon = "lock"
                            placeholder = "* * * * * *"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('password')}
                            onBlur = {handleBlur('password')}
                            value = {values.password}
                            secureTextEntry={hidePassword}
                            isPassword={true}
                            hidePassword = {hidePassword}
                            setHidePassword = {setHidePassword}
                        />
                        <MyTextInput
                            label="Confirm Password"
                            icon = "lock"
                            placeholder = "* * * * * *"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('confirmPassword')}
                            onBlur = {handleBlur('confirmPassword')}
                            value = {values.confirmPassword}
                            secureTextEntry={hidePassword}
                            isPassword={true}
                            hidePassword = {hidePassword}
                            setHidePassword = {setHidePassword}
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
                <Feather name={icon} size={30} color={brand}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (<RightIcon onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight}/>
            </RightIcon>)}
        </View>
    );
}
export default Signup;
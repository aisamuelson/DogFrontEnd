import React, {useState, useContext} from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardWrapper from "../components/KeyboardWrapper";

import { StyledContainer, InnerContainer, PageLogo, SignLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput, Colors, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent} from './../components/LogStyles';
import {View, ActivityIndicator} from 'react-native';

import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';

const{brand, darkLight, primary} = Colors;

const Login = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = (credentials, setSubmitting) =>{
        handleMessage(null);
        const url = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/auth/login';
        axios
            .post(url, credentials)
            .then((response)=>{
                const result = response.data;
                const {message, token} = result;
                global.token = token
                global.email = credentials.email;
                console.log("result: ", result, " token:", token, " message: ", message)
                if(message !== 'Wrong username or password'){
                    navigation.navigate("Root", {screen:"HomeScreen"})
                    //persistLogin(credentials, token);
                }else{
                    navigation.navigate("Root", {screen:"HomeScreen"}, {...data[0]})
                    //persistLogin(credentials, token);
                }
                setSubmitting(false);
            })
            .catch(error =>{
            console.log(error);
            setSubmitting(false);
            handleMessage("An error has occurred. Please check your network and try again");
        })
    }

    const handleMessage = (message, type = 'FAILED') =>{
        setMessage(message);
        setMessageType(type);
    }

    //INSIDE LOGIN?????
    // const handleGoogleSignIn = () =>{
    //     const config = {}
    // }

    const persistLogin = (credentials, token) =>{
        AsyncStorage.setItem('credentials', JSON.stringify(credentials))
        .then(()=>{
            //handleMessage(message, status);
            global.token = token;
            setStoredCredentials(credentials);
        })
        .catch((error)=>{
            console.log(error);
            handleMessage('Persisting login failed');
        })
    }
/////////// 

    return (
        <KeyboardWrapper>
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
                <ExtraView/>
                <PageLogo resizeMode="cover" source={require('./../assets/images/SaddyDog.png')}/>
                <PageTitle>Pet Adoption App</PageTitle>
                <SubTitle>Account Login</SubTitle>
                <Formik initialValues={{email:'',password:''}} 
                    onSubmit={
                        (values, {setSubmitting}) => {
                            if(values.email == '' || values.password == ''){
                                handleMessage("Please fill out all fields");
                                setSubmitting(false);
                            }else{
                                handleLogin({email: values.email.trim(), password: values.password}, setSubmitting);
                            }
                        }
                    }
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
                        <MsgBox type={messageType}>
                            {message}
                        </MsgBox>
                        {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText>Login</ButtonText>
                        </StyledButton>}

                        {isSubmitting && <StyledButton disabled={true}>
                            <ActivityIndicator size="large" color={primary}/>
                        </StyledButton>}
                        <Line/>
                        {/* <StyledButton google={true} onPress={handleSubmit}>
                            <Fontisto name="google" color={primary} size={25} />
                            <ButtonText google={true}>Sign in with Google</ButtonText>
                        </StyledButton> */}
                        <ExtraView>
                            <ExtraText>Don't have an account already? </ExtraText>
                            <TextLink onPress={() => navigation.navigate("Signup")}><TextLinkContent>Signup</TextLinkContent></TextLink>
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
export default Login;
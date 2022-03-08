import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardWrapper from "../components/KeyboardWrapper";

import { StyledContainer, InnerContainer, SignLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput, Colors, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent} from './../components/LogStyles';
import {View} from 'react-native';

const{brand, darkLight, primary} = Colors;

const Signup = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

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
                <Formik initialValues={{fullname:'',email:'',password:'',confirmPassword:''}} 
                    onSubmit={(values) => {
                        if(values.fullname == '' || values.email == '' || values.password == '' || values.confirmPassword == ''){
                            handleMessage("Please fill out all fields");
                        }else{
                            if(values.password != values.confirmPassword){
                                handleMessage("Passwords do not match");
                            }else{
                                console.log(values); 
                                navigation.navigate("Signup2", {fullname: values.fullname, email: values.email.trim(), password: values.password});
                            }
                        }  
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values})=> (<StyledFormArea>
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
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>Continue</ButtonText>
                        </StyledButton>
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
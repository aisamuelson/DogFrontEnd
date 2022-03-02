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

    return (
        <KeyboardWrapper>
            <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
            <SignLogo></SignLogo>
                <PageTitle>Pet Adoption App</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik initialValues={{username:'',email:'',password:'',confirmPassword:''}} onSubmit={(values) => {console.log(values); navigation.naviage("Root", {screen:"HomeScreen"})}}>
                    {({handleChange, handleBlur, handleSubmit, values})=> (<StyledFormArea>
                        <MyTextInput
                            label="Username"
                            icon = "user"
                            placeholder = "Username"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('username')}
                            onBlur = {handleBlur('username')}
                            value = {values.username}
                        />
                        <MyTextInput
                            label="Email"
                            icon = "mail"
                            placeholder = "Email"
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
                        <MsgBox>
                            ...
                        </MsgBox>
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>Login</ButtonText>
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
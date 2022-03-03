import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardWrapper from "../components/KeyboardWrapper";

import { StyledContainer, InnerContainer, SignLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput, Colors, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent} from './../components/LogStyles';
import {View} from 'react-native';

const{brand, darkLight, primary} = Colors;

const Signup2 = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);

    return (
        <KeyboardWrapper>
            <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
            <SignLogo></SignLogo>
                <PageTitle>Pet Adoption App</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik initialValues={{adr1:'',city:'',state:'',zip:''}} onSubmit={(values) => {console.log(values); navigation.navigate("Root", {screen:"HomeScreen"})}}>
                    {({handleChange, handleBlur, handleSubmit, values})=> (<StyledFormArea>
                        <MyTextInput
                            label="Address Line 1"
                            icon = "mail"
                            placeholder = "1 Dog Ln"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('adr1')}
                            onBlur = {handleBlur('adr1')}
                            value = {values.adr1}
                        />
                        <MyTextInput
                            label="City"
                            icon = "mail"
                            placeholder = "Catsville"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('city')}
                            onBlur = {handleBlur('city')}
                            value = {values.city}
                        />
                        <MyTextInput
                            label="State"
                            icon = "mail"
                            placeholder = "1 Dog Ln"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('state')}
                            onBlur = {handleBlur('sate')}
                            value = {values.state}
                        />
                        <MyTextInput
                            label="Zip Code"
                            icon = "mail"
                            placeholder = "1 Dog Ln"
                            placeholderTextColor = {darkLight}
                            onChangeText = {handleChange('zip')}
                            onBlur = {handleBlur('zip')}
                            value = {values.zip}
                        />
                        <MsgBox>
                            ...
                        </MsgBox>
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>Signup</ButtonText>
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
export default Signup2;
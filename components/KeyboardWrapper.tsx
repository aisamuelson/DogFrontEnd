import React from "react";
import {Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Platform} from 'react-native';

const KeyboardWrapper = ({children}) => {
    return(
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
            <ScrollView onScroll={Keyboard.dismiss} scrollEventThrottle={1}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
export default KeyboardWrapper;
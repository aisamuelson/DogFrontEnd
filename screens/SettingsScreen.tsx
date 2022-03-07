import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { Component, useState } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types'

export default function SettingsScreen({ navigation }: NativeStackScreenProps<RootStackParamList>) {
  return (
    <SafeAreaView style={{
        flex: 1,
        justifyContent: 'flex-end'
    }}>
        <TouchableOpacity 
            style={[styles.button, {backgroundColor: 'red'}]}
            onPress={() => {
              global.token = null;
              global.email = null;
              navigation.navigate('Login');
            }}
        >
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 15,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 60,
    marginVertical: 20,
  },
  buttonText: {
      fontSize: 16,
      color: 'white'
  }
});
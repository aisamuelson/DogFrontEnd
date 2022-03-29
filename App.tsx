import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './components/CredentialsContext';
import {useState} from 'react';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () =>{
    AsyncStorage
      .getItem('credentials')
      .then((result)=>{
        if (result !== null){
          setStoredCredentials(JSON.parse(result));
        }else{
          setStoredCredentials(null);
        }
      })
      .catch(error=>console.log(error))
  }

  if(!appReady){
    return(
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={()=> setAppReady(true)}
        onError={console.warn}
    />)
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </CredentialsContext.Provider>
      </SafeAreaProvider>
    );
  }
}

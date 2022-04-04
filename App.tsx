import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyCVq0GMdw9SRXaF82s3rnNm5Jfk6hKVRd0",
  authDomain: "petadoptionchat.firebaseapp.com",
  projectId: "petadoptionchat",
  storageBucket: "petadoptionchat.appspot.com",
  messagingSenderId: "874977282544",
  appId: "1:874977282544:web:de62f72f6bec855b4b3535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

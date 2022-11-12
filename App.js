import { NavigationContainer } from "@react-navigation/native"
import axios from "axios";
import { StatusBar } from 'expo-status-bar';
import { Navigation } from './src/navigation/Navigation';

axios.defaults.baseURL="http:/10.37.61.150:4000"


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light"/>
      <Navigation/>
    </NavigationContainer>
  )
 
}

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

 import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
 import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
 import { NativeStackScreenProps } from '@react-navigation/native-stack';
 
 declare global {
   namespace ReactNavigation {
     interface RootParamList extends RootStackParamList {}
   }
 }
 
 export type RootStackParamList = {
   Root: NavigatorScreenParams<RootTabParamList> | undefined;
   Modal: undefined;
   NotFound: undefined;
   Detail: undefined | {id: string} | {item: ListingProps};
   Login: undefined;
   Signup: undefined;
   Signup2: undefined;
   Settings: undefined;
 };
 
 export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
   RootStackParamList,
   Screen
 >;
 
 export type RootTabParamList = {
   TabOne: undefined;
   TabTwo: undefined;
   TabThree: undefined;
   TabFour: undefined;
   TabFive: undefined;
 };
 
 export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
   BottomTabScreenProps<RootTabParamList, Screen>,
   NativeStackScreenProps<RootStackParamList>
 >;
 
 export type ListingProps = {
   id: string,
   name: string,
   breed: string,
   avatar: string
 };
 
 export type RouteParamList = {
   Detail: {
     item: ListingProps;
   }
 }
 
 export type FavCardProp = ListingProps & {
   sex: string,
   age: number,
   neutered: string
 }
 
 export type InputTextRowProp = {
   label: string,
   placeholder: string
 }
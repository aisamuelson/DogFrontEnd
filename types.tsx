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
   ChatRoom: undefined;
   AdoptPrefs: undefined;
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
   weight: number,
   hairlength: string,
   avatar: string,
   owner: string,
   owner_full_name: string,
   owner_avatar: string,
   distance: number,
 };

 export type RouteParamList = {
   Detail: {
     item: ListingProps,
   }

   ChatRoom: {
     user: string
     full_name: string
     avatar: string
     postid: number
   }
 }

 export type ListingCardProp = ListingProps & {
   handleAdd: (id: any) => void
 }

 export type FavCardProp = ListingProps & {
   sex: string,
   age: number,
   neutered: string,
   handleRemove: (id: any) => void
 }

 export type InputTextRowProp = {
   label: string,
   placeholder: string
 }

export type PetInfo = {
    age_month: number,
    age_year: number,
    birthday: string,
    breed: string,
    gender: string,
    weight: number,
    hairlength: string,
    neutered: boolean,
    petid: number,
    petname: string,
    petowner: number,
    pettype: string
}

export type PostInfo = {
    desc: string,
    image: string,
    petid: PetInfo,
    postid: number
}

export type filterMenu={
     option1: string;
     option2: string;
     optionKey: number
}

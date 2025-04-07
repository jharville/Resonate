import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootNavigatorParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  CollectionStack: NavigatorScreenParams<CollectionStackParamList>;
};

export type AuthStackParamList = {
  AuthScreen: undefined;
};

export type CollectionStackParamList = {
  CollectionScreen: undefined;
  SubFolderScreen: {folderId: string; name: string; artistName: string};
  PlayerScreen: {folderId: string; subFolderName: string; artistName: string};
};

export type RootNavigatorScreenProps<T extends keyof RootNavigatorParamList> =
  NativeStackScreenProps<RootNavigatorParamList, T>;

export type CollectionStackScreenProps<T extends keyof CollectionStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CollectionStackParamList, T>,
    RootNavigatorScreenProps<keyof RootNavigatorParamList>
  >;

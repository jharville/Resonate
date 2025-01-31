import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootNavigatorParamList = {
  LandingStack: NavigatorScreenParams<LandingStackParamList>;
  MainStack: NavigatorScreenParams<MainStackParamList>;
  // ResultStack: NavigatorScreenParams<ResultStackParamList>;
};

export type LandingStackParamList = {
  LandingScreen: undefined;
};

export type MainStackParamList = {
  ResultScreen: {searchTerm: string};
};

export type RootNavigatorScreenProps<T extends keyof RootNavigatorParamList> =
  NativeStackScreenProps<RootNavigatorParamList, T>;

export type LandingStackScreenProps<T extends keyof LandingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LandingStackParamList, T>,
    RootNavigatorScreenProps<keyof RootNavigatorParamList>
  >;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, T>,
    RootNavigatorScreenProps<keyof RootNavigatorParamList>
  >;

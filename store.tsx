import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './src/redux/authSlice';
import {playerReducer} from './src/redux/playerSlice';
import {songUploadReducer} from './src/redux/songProgressSlice';
import {profileModalReducer} from './src/redux/profileModalSlice';

//The Redux Store
//`configureStore` is a Redux Toolkit function that automatically combines multiple reducers into a single root reducer.

export const store = configureStore({
  // The `reducer` field is an object {} that defines the different slices of state.
  reducer: {
    auth: authReducer, //for tracking who's signed in
    player: playerReducer, //for conditionally displaying song player at bottom of "CollectionStack"
    upload: songUploadReducer, //for displaying song upload progress bar
    profileModal: profileModalReducer, //for conditionally displaying the profile modal on click
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

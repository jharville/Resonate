import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './src/redux/authSlice';
import {playerReducer} from './src/redux/playerSlice';
import {songUploadReducer} from './src/redux/songProgressSlice';
import {profileModalReducer} from './src/redux/profileModalSlice';

import {subFolderOptionsModalReducer} from './src/redux/subFolderOptionsModalSlice.ts';
import {renameParentFolderReducer} from './src/redux/renameParentFolderSlice.ts';
import {renameSubFolderReducer} from './src/redux/renameSubFolderSlice.ts';
import {parentFolderOptionsModalReducer} from './src/redux/parentFolderOptionsModalSlice.ts';

//The Redux Store
//`configureStore` is a Redux Toolkit function that automatically combines multiple reducers into a single root reducer.

export const store = configureStore({
  // The `reducer` field is an object {} that defines the different slices of state.
  reducer: {
    auth: authReducer, //for tracking who's signed in
    player: playerReducer, //for conditionally displaying song player at bottom of "CollectionStack"
    upload: songUploadReducer, //for displaying song upload progress bar
    profileModal: profileModalReducer, //for conditionally displaying the profile modal on press
    ParentFolderOptionsModal: parentFolderOptionsModalReducer, //for conditionally displaying the folder Options Modal on vertical 3 dot press
    subFolderOptionsModal: subFolderOptionsModalReducer, //for conditionally displaying the folder Options Modal on vertical 3 dot press
    renameParentFolder: renameParentFolderReducer, //for conditionally displaying the rename folder modal and naming/renaming the parent folders
    renameSubFolder: renameSubFolderReducer, //for conditionally displaying the rename folder modal and naming/renaming the Subfolders
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

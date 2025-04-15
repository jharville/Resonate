import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './src/redux/authSlice';
import {playerReducer} from './src/redux/playerSlice';
import {songUploadReducer} from './src/redux/songProgressSlice';
import {profileModalReducer} from './src/redux/profileModalSlice';
import {subFolderOptionsModalReducer} from './src/redux/subFolderOptionsModalSlice.ts';
import {renameParentFolderReducer} from './src/redux/renameParentFolderSlice.ts';
import {renameSubFolderReducer} from './src/redux/renameSubFolderSlice.ts';
import {parentFolderOptionsModalReducer} from './src/redux/parentFolderOptionsModalSlice.ts';
import {songOptionsModalReducer} from './src/redux/songOptionsModalSlice.ts';
import {selectedSongReducer} from './src/redux/selectedSongSlice.ts';
import {renameSongReducer} from './src/redux/renameSongSlice.ts';
import {audioPlayerModalReducer} from './src/redux/audioPlayerModalSlice.ts';
import {playerScreenMainOptionsModalReducer} from './src/redux/playerScreenMainOptionsModalSlice.ts';
import {routeParamsReducer} from './src/redux/routeParamsSlice.ts';
import {reorderSongsModalReducer} from './src/redux/reorderSongsModalSlice.ts';

//The Redux Store
//`configureStore` is a Redux Toolkit function that automatically combines multiple reducers into a single root reducer.

export const store = configureStore({
  // The `reducer` field is an object {} that defines the different slices of state.
  reducer: {
    auth: authReducer, //for tracking who's signed in

    player: playerReducer, //for conditionally displaying song player at bottom of "CollectionStack"

    routeParams: routeParamsReducer, //for storing route params for use in modals like ReorderSongsModal

    upload: songUploadReducer, //for displaying song upload progress bar

    profileModal: profileModalReducer, //for conditionally displaying the profile modal on press

    ParentFolderOptionsModal: parentFolderOptionsModalReducer, //for conditionally displaying the folder Options Modal on vertical 3 dot press
    subFolderOptionsModal: subFolderOptionsModalReducer, //for conditionally displaying the folder Options Modal on vertical 3 dot press
    renameParentFolder: renameParentFolderReducer, //for conditionally displaying the rename folder modal and naming/renaming the parent folders
    renameSubFolder: renameSubFolderReducer, //for conditionally displaying the rename folder modal and naming/renaming the Subfolders
    songOptionsModal: songOptionsModalReducer, //for conditionally displaying the song Options Modal in PlayerScreen on vertical 3 dot press
    selectedSong: selectedSongReducer, // for tracking the selected song for deleting, renaming, etc.

    renameSong: renameSongReducer, //for conditionally displaying the rename song modal and naming/renaming the songs
    audioPlayerModal: audioPlayerModalReducer, //for conditionally displaying the expanded audio player modal on press of the ^ button
    playerScreenMainOptionsModal: playerScreenMainOptionsModalReducer, //for conditionally displaying the main options modal in PlayerScreen vertical 3 dot press

    reorderSongsModal: reorderSongsModalReducer, //for conditionally displaying the reorder songs modal
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

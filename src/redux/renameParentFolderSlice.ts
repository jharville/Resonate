import {createSlice} from '@reduxjs/toolkit';

export const renameParentFolderSlice = createSlice({
  name: 'renameFolder',
  initialState: {
    folderID: '',
    folderName: '',
    artistName: '',
    isRenameParentModalVisible: false,
  },
  reducers: {
    setParentFolderID: (state, action) => {
      state.folderID = action.payload;
    },
    setParentFolderName: (state, action) => {
      state.folderName = action.payload;
    },
    setArtistName: (state, action) => {
      state.artistName = action.payload;
    },
    openRenameParentFolderModal: state => {
      state.isRenameParentModalVisible = true;
    },
    closeRenameParentFolderModal: state => {
      state.isRenameParentModalVisible = false;
    },
  },
});

export const {
  setParentFolderID,
  setParentFolderName,
  setArtistName,
  openRenameParentFolderModal,
  closeRenameParentFolderModal,
} = renameParentFolderSlice.actions;
export const renameParentFolderReducer = renameParentFolderSlice.reducer;

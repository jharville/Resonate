import {createSlice} from '@reduxjs/toolkit';

export const renameSubFolderSlice = createSlice({
  name: 'renameSubFolder',
  initialState: {
    subFolderID: '',
    subFolderName: '',
    isRenameSubFolderModalVisible: false,
  },
  reducers: {
    setSubFolderID: (state, action) => {
      state.subFolderID = action.payload;
    },
    setSubFolderName: (state, action) => {
      state.subFolderName = action.payload;
    },

    openRenameSubFolderModal: state => {
      state.isRenameSubFolderModalVisible = true;
    },
    closeRenameSubFolderModal: state => {
      state.isRenameSubFolderModalVisible = false;
    },
  },
});

export const {
  setSubFolderID,
  setSubFolderName,
  openRenameSubFolderModal,
  closeRenameSubFolderModal,
} = renameSubFolderSlice.actions;
export const renameSubFolderReducer = renameSubFolderSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

export const renameParentFolderSlice = createSlice({
  name: 'renameFolder',
  initialState: {
    parentFolderID: '',
    parentFolderName: '',
    isRenameParentModalVisible: false,
  },
  reducers: {
    setParentFolderID: (state, action) => {
      state.parentFolderID = action.payload;
    },
    setParentFolderName: (state, action) => {
      state.parentFolderName = action.payload;
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
  openRenameParentFolderModal,
  closeRenameParentFolderModal,
} = renameParentFolderSlice.actions;
export const renameParentFolderReducer = renameParentFolderSlice.reducer;

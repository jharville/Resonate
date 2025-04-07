import {createSlice} from '@reduxjs/toolkit';

export const parentFolderOptionsModalSlice = createSlice({
  name: 'ParentFolderOptionsModal',
  initialState: {
    isParentFolderOptionsModalVisible: false,
  },
  reducers: {
    openParentFolderOptionsModal: state => {
      state.isParentFolderOptionsModalVisible = true;
    },
    closeParentFolderOptionsModal: state => {
      state.isParentFolderOptionsModalVisible = false;
    },
    toggleParentFolderOptionsModal: state => {
      state.isParentFolderOptionsModalVisible = !state.isParentFolderOptionsModalVisible;
    },
  },
});

export const {
  openParentFolderOptionsModal,
  closeParentFolderOptionsModal,
  toggleParentFolderOptionsModal,
} = parentFolderOptionsModalSlice.actions;
export const parentFolderOptionsModalReducer = parentFolderOptionsModalSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

export const subFolderOptionsModalSlice = createSlice({
  name: 'subFolderOptionsModal',
  initialState: {
    issubFolderOptionsModalVisible: false,
  },
  reducers: {
    opensubFolderOptionsModal: state => {
      state.issubFolderOptionsModalVisible = true;
    },
    closesubFolderOptionsModal: state => {
      state.issubFolderOptionsModalVisible = false;
    },
    togglesubFolderOptionsModal: state => {
      state.issubFolderOptionsModalVisible = !state.issubFolderOptionsModalVisible;
    },
  },
});

export const {opensubFolderOptionsModal, closesubFolderOptionsModal, togglesubFolderOptionsModal} =
  subFolderOptionsModalSlice.actions;
export const subFolderOptionsModalReducer = subFolderOptionsModalSlice.reducer;

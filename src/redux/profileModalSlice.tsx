import {createSlice} from '@reduxjs/toolkit';

export const profileModalSlice = createSlice({
  name: 'profileModal',
  initialState: {
    isProfileModalVisible: false,
  },
  reducers: {
    openProfileModal: state => {
      state.isProfileModalVisible = true;
    },
    closeProfileModal: state => {
      state.isProfileModalVisible = false;
    },
    toggleProfileModal: state => {
      state.isProfileModalVisible = !state.isProfileModalVisible;
    },
  },
});

export const {openProfileModal, closeProfileModal, toggleProfileModal} = profileModalSlice.actions;
export const profileModalReducer = profileModalSlice.reducer;

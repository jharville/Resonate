import {createSlice} from '@reduxjs/toolkit';

export const songOptionsModalSlice = createSlice({
  name: 'songOptionsModal',
  initialState: {
    isSongOptionsModalVisible: false,
  },
  reducers: {
    openSongOptionsModal: state => {
      state.isSongOptionsModalVisible = true;
    },
    closeSongOptionsModal: state => {
      state.isSongOptionsModalVisible = false;
    },
    toggleSongOptionsModal: state => {
      state.isSongOptionsModalVisible = !state.isSongOptionsModalVisible;
    },
  },
});

export const {openSongOptionsModal, closeSongOptionsModal, toggleSongOptionsModal} =
  songOptionsModalSlice.actions;
export const songOptionsModalReducer = songOptionsModalSlice.reducer;

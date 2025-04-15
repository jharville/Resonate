import {createSlice} from '@reduxjs/toolkit';

export const reorderSongsModalSlice = createSlice({
  name: 'reorderSongsModal',
  initialState: {
    isReorderSongsModalVisible: false,
    hasReorderedSongs: false,
  },
  reducers: {
    openReorderSongsModal: state => {
      state.isReorderSongsModalVisible = true;
    },
    closeReorderSongsModal: state => {
      state.isReorderSongsModalVisible = false;
    },
    toggleReorderSongsModal: state => {
      state.isReorderSongsModalVisible = !state.isReorderSongsModalVisible;
    },
    setHasReorderedSongs: (state, action) => {
      state.hasReorderedSongs = action.payload;
    }, //This is for conditionally displaying the CustomAlert "Order Saved" on successful reorder of songs
  },
});

export const {
  openReorderSongsModal,
  closeReorderSongsModal,
  toggleReorderSongsModal,
  setHasReorderedSongs,
} = reorderSongsModalSlice.actions;
export const reorderSongsModalReducer = reorderSongsModalSlice.reducer;

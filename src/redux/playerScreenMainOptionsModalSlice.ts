import {createSlice} from '@reduxjs/toolkit';

export const playerScreenMainOptionsModalSlice = createSlice({
  name: 'playerScreenMainOptionsModal',
  initialState: {
    isPlayerScreenMainOptionsModalVisible: false,
  },
  reducers: {
    openPlayerScreenMainOptionsModal: state => {
      state.isPlayerScreenMainOptionsModalVisible = true;
    },
    closePlayerScreenMainOptionsModal: state => {
      state.isPlayerScreenMainOptionsModalVisible = false;
    },
    togglePlayerScreenMainOptionsModal: state => {
      state.isPlayerScreenMainOptionsModalVisible = !state.isPlayerScreenMainOptionsModalVisible;
    },
  },
});

export const {
  openPlayerScreenMainOptionsModal,
  closePlayerScreenMainOptionsModal,
  togglePlayerScreenMainOptionsModal,
} = playerScreenMainOptionsModalSlice.actions;
export const playerScreenMainOptionsModalReducer = playerScreenMainOptionsModalSlice.reducer;

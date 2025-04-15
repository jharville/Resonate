// audioPlayerModalSlice.ts
import {createSlice} from '@reduxjs/toolkit';

interface AudioPlayerModalState {
  isAudioPlayerModalVisible: boolean;
}

const initialState: AudioPlayerModalState = {
  isAudioPlayerModalVisible: false,
};

export const audioPlayerModalSlice = createSlice({
  name: 'audioPlayerModal',
  initialState,
  reducers: {
    openAudioPlayerModal: state => {
      state.isAudioPlayerModalVisible = true;
    },
    closeAudioPlayerModal: state => {
      state.isAudioPlayerModalVisible = false;
    },
    toggleAudioPlayerModal: state => {
      state.isAudioPlayerModalVisible = !state.isAudioPlayerModalVisible;
    },
  },
});

export const {openAudioPlayerModal, closeAudioPlayerModal, toggleAudioPlayerModal} =
  audioPlayerModalSlice.actions;

export const audioPlayerModalReducer = audioPlayerModalSlice.reducer;

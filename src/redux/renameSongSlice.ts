import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface RenameSongState {
  songId: string;
  songName: string;
  isRenameSongModalVisible: boolean;
}

const initialState: RenameSongState = {
  songId: '',
  songName: '',
  isRenameSongModalVisible: false,
};

export const renameSongSlice = createSlice({
  name: 'renameSong',
  initialState,
  reducers: {
    setSongId: (state, action: PayloadAction<string>) => {
      state.songId = action.payload;
    },
    setSongName: (state, action: PayloadAction<string>) => {
      state.songName = action.payload;
    },
    openRenameSongModal: state => {
      state.isRenameSongModalVisible = true;
    },
    closeRenameSongModal: state => {
      state.isRenameSongModalVisible = false;
    },
  },
});

export const {setSongId, setSongName, openRenameSongModal, closeRenameSongModal} =
  renameSongSlice.actions;

export const renameSongReducer = renameSongSlice.reducer;

// selectedSongSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SelectedSong = {
  id: string;
  storagePath: string;
  folderId: string;
};

export const selectedSongSlice = createSlice({
  name: 'selectedSong',
  initialState: null as null | SelectedSong,
  reducers: {
    setSelectedSong: (state, action: PayloadAction<SelectedSong>) => action.payload,
    clearSelectedSong: () => null,
  },
});

export const {setSelectedSong, clearSelectedSong} = selectedSongSlice.actions;
export const selectedSongReducer = selectedSongSlice.reducer;

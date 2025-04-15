import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AddTrack, Track} from 'react-native-track-player';

const initialPlayerState: PlayerState = {
  activeTrack: null, // Default: No track is active
  subFolderName: '',
  artistName: '',
};

const playerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,

  reducers: {
    setActiveTrack: (state, action: PayloadAction<Track>) => {
      state.activeTrack = action.payload; // for displaying the current song name being played
    },
    setSubFolderInfo: (
      state,
      action: PayloadAction<{subFolderName: string; artistName: string}>,
    ) => {
      state.subFolderName = action.payload.subFolderName;
      state.artistName = action.payload.artistName;
    },
  },
});

export const {setActiveTrack, setSubFolderInfo} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;

export interface PlayerState {
  activeTrack: AddTrack | null; // this is TrackPlayers own imported type for a track
  subFolderName?: string; // optional at start
  artistName?: string;
}

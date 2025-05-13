import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AddTrack, Track} from 'react-native-track-player';

const initialPlayerState: PlayerState = {
  activeTrack: null, // Default: No track is active
  parentFolderName: '',
  subFolderName: '',
  metaData: {},
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
      action: PayloadAction<{subFolderName: string; parentFolderName: string}>,
    ) => {
      state.subFolderName = action.payload.subFolderName;
      state.parentFolderName = action.payload.parentFolderName;
    },
    setAudioMetaData: (
      state,
      action: PayloadAction<{songName: string; metaData: AudioMetaData}>,
    ) => {
      state.metaData[action.payload.songName] = action.payload.metaData;
    },
  },
});

export const {setActiveTrack, setSubFolderInfo, setAudioMetaData} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;

export interface PlayerState {
  activeTrack: AddTrack | null; // this is TrackPlayers own imported type for a track
  parentFolderName?: string;
  subFolderName?: string;
  metaData: Record<string, AudioMetaData>; // <- KEY: songName, VALUE: metadata
}

export type AudioMetaData = {
  sampleRate?: number | undefined;
  channelCount?: number | undefined;
  bitDepth?: number | undefined;
  duration?: number | undefined;
  fileType?: string | undefined;
  bitRate?: number | undefined;
  loudnessLufs?: number | undefined;
  fileSize?: number | undefined;
  waveform?: number[] | undefined;
  subFolderImageUrl?: string | null;
};

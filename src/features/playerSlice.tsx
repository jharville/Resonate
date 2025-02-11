import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define the initial state
const initialPlayerState: PlayerState = {
  activeTrack: null, // Default: No track is active
};

const playerSlice = createSlice({
  name: 'player', // Name of this Redux slice
  initialState: initialPlayerState, // Initial state for tracking if a track is active

  reducers: {
    setActiveTrack: (state, action: PayloadAction<ActiveTrack>) => {
      state.activeTrack = action.payload;
    },
  },
});

// Export the actions for dispatching
export const {setActiveTrack} = playerSlice.actions;

// Export the reducer to be used in the Redux store
export const playerReducer = playerSlice.reducer;

export interface PlayerState {
  activeTrack: ActiveTrack | null;
}

type ActiveTrack = {
  id: string;
  url: string;
  name: string;
  // artist: string | null | undefined;
};

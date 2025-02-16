import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UploadState {
  progress: number | null;
}

const initialState: UploadState = {
  progress: null,
};

const songProgressSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number | null>) => {
      state.progress = action.payload;
    },
  },
});

export const {setUploadProgress} = songProgressSlice.actions;
export const songUploadReducer = songProgressSlice.reducer;

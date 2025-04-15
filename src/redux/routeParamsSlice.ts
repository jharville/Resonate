import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface RouteParamsState {
  subFolderName: string;
  artistName: string;
  folderId: string;
}

const initialState: RouteParamsState = {
  subFolderName: '',
  artistName: '',
  folderId: '',
};

export const routeParamsSlice = createSlice({
  name: 'routeParams',
  initialState,
  reducers: {
    setSubFolderInfo: (
      state,
      action: PayloadAction<{subFolderName: string; artistName: string}>,
    ) => {
      state.subFolderName = action.payload.subFolderName;
      state.artistName = action.payload.artistName;
    },
    setFolderId: (state, action: PayloadAction<string>) => {
      state.folderId = action.payload;
    },
    setFullRouteInfo: (
      state,
      action: PayloadAction<{
        folderId: string;
        artistName: string;
        subFolderName: string;
      }>,
    ) => {
      const {folderId, artistName, subFolderName} = action.payload;
      state.folderId = folderId;
      state.artistName = artistName;
      state.subFolderName = subFolderName;
    },
  },
});

export const {setSubFolderInfo, setFolderId, setFullRouteInfo} = routeParamsSlice.actions;

export const routeParamsReducer = routeParamsSlice.reducer;

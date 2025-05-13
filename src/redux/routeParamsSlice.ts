import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface RouteParamsState {
  parentFolderId: string;
  parentFolderName: string;
  subFolderId: string;
  subFolderName: string;
}

const initialState: RouteParamsState = {
  parentFolderId: '',
  parentFolderName: '',
  subFolderId: '',
  subFolderName: '',
};

export const routeParamsSlice = createSlice({
  name: 'routeParams',
  initialState,
  reducers: {
    setFolderId: (state, action: PayloadAction<string>) => {
      state.parentFolderId = action.payload;
    },
    setSubFolderInfo: (
      state,
      action: PayloadAction<{subFolderId: string; subFolderName: string; artistName: string}>,
    ) => {
      state.subFolderName = action.payload.subFolderId;
      state.subFolderName = action.payload.subFolderName;
      state.parentFolderName = action.payload.artistName;
    },
    setFullRouteInfo: (
      state,
      action: PayloadAction<{
        parentFolderId: string;
        parentFolderName: string;
        subFolderId: string;
        subFolderName: string;
      }>,
    ) => {
      const {parentFolderId, parentFolderName, subFolderId, subFolderName} = action.payload;
      state.parentFolderId = parentFolderId;
      state.parentFolderName = parentFolderName;
      state.subFolderId = subFolderId;
      state.subFolderName = subFolderName;
    },
  },
});

export const {setFolderId, setSubFolderInfo, setFullRouteInfo} = routeParamsSlice.actions;

export const routeParamsReducer = routeParamsSlice.reducer;

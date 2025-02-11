import {configureStore} from '@reduxjs/toolkit';
import {playerReducer} from './src/features/playerSlice';

//The Redux Store
//`configureStore` is a Redux Toolkit function that automatically combines multiple reducers into a single root reducer.

export const store = configureStore({
  // The `reducer` field is an object {} that defines the different slices of state.
  reducer: {
    player: playerReducer, // The `player` slice is managed by `playerReducer`
  },
});

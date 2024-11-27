import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface AudioEngineState {
  isPlaying: boolean;
  currentStep: number;
  ppqn: number;
  currentTick: number;
}

// Initial State
const initialState: AudioEngineState = {
  isPlaying: false,
  currentStep: 0,
  ppqn: 24,
  currentTick: 0
};

// Slice
export const audioEngineSlice = createSlice({
  name: 'audioEngine',
  initialState,
  reducers: {
    setPlaying: (state, { payload }: PayloadAction<boolean>) => {
      state.isPlaying = payload;
    },
    setCurrentStep: (state, { payload }: PayloadAction<number>) => {
      state.currentStep = payload;
    },
    setCurrentTick: (state, { payload }: PayloadAction<number>) => {
      state.currentTick = payload;
    }
  }
});

export const {
  setPlaying,
  setCurrentStep,
  setCurrentTick
} = audioEngineSlice.actions;

export default audioEngineSlice.reducer;


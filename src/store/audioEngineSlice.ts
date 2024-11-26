import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface AudioEngineState {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  ppqn: number;
  currentTick: number;
}

// Initial State
const initialState: AudioEngineState = {
  bpm: 120,
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
    setBpm: (state, { payload }: PayloadAction<number>) => {
      state.bpm = payload;
    },
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
  setBpm,
  setPlaying,
  setCurrentStep,
  setCurrentTick
} = audioEngineSlice.actions;

export default audioEngineSlice.reducer;


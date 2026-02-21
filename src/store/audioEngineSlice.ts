import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

// Types
interface ExecutedCommand {
  command: PadCommand;
  step: number;
  timestamp: number;
}

interface AudioEngineState {
  isPlaying: boolean;
  currentStep: number;
  ppqn: number;
  currentTick: number;
  lastExecutedCommands: Record<string, ExecutedCommand | null>;
}

// Initial State
const initialState: AudioEngineState = {
  isPlaying: false,
  currentStep: 0,
  ppqn: 24,
  currentTick: 0,
  lastExecutedCommands: {
    seq1: null,
    seq2: null,
    seq3: null,
    seq4: null
  }
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
    },
    setExecutedCommand: (state, { payload }: PayloadAction<{ sequencerId: string; command: PadCommand; step: number }>) => {
      state.lastExecutedCommands[payload.sequencerId] = {
        command: payload.command,
        step: payload.step,
        timestamp: Date.now()
      };
    },
    clearExecutedCommand: (state, { payload }: PayloadAction<string>) => {
      state.lastExecutedCommands[payload] = null;
    }
  }
});

export const {
  setPlaying,
  setCurrentStep,
  setCurrentTick,
  setExecutedCommand,
  clearExecutedCommand
} = audioEngineSlice.actions;

export default audioEngineSlice.reducer;


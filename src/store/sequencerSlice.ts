import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

const numPads = 32;

// Types
interface Sequencer {
  padCommands: PadCommand[];
  nudgeValues: number[];
}

interface SequencerState {
  sequencers: Record<string, Sequencer>;
  selectedPadId: number | null;
  selectedSequencerId: string | null;
}

interface UpdatePadCommandPayload {
  sequencerId: string;
  padId: number;
  command: PadCommand;
}

interface UpdateNudgeValuePayload {
  sequencerId: string;
  padId: number;
  nudgeValue: number;
}

// Helpers
const createEmptySequencer = (): Sequencer => ({
  padCommands: Array(numPads).fill(PadCommand.EMPTY),
  nudgeValues: Array(numPads).fill(0)
});

// Initial State
const initialState: SequencerState = {
  selectedSequencerId: null,
  selectedPadId: null,
  sequencers: {
    'seq1': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0)
     },
     'seq2': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0)
     },
     'seq3': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0)
     },
     'seq4': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0)
     },
  }
};

// Slice
export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<SequencerState>) => {
      return action.payload;
    },
    updatePadCommand: (state, action: PayloadAction<UpdatePadCommandPayload>) => {
      const { sequencerId, padId, command } = action.payload;
      state.sequencers[sequencerId as keyof typeof state.sequencers].padCommands[padId] = command;
    },
    clearAllPads: (state, { payload: { sequencerId } }) => {
      state.sequencers[sequencerId as keyof typeof state.sequencers] = createEmptySequencer();
    },
    setSelectedPad: (state, { payload }) => {
      state.selectedSequencerId = payload.sequencerId;
      state.selectedPadId = payload.padId;
    },
    clearSelectedPad: (state) => {
      state.selectedSequencerId = null;
      state.selectedPadId = null;
    },
    updateNudgeValue: (state, action: PayloadAction<UpdateNudgeValuePayload>) => {
      const { sequencerId, padId, nudgeValue } = action.payload;
      const clampedNudge = Math.max(-3, Math.min(3, nudgeValue));
      state.sequencers[sequencerId].nudgeValues[padId] = clampedNudge;
    }
  }
});
export const {
  updatePadCommand,
  clearAllPads,
  setSelectedPad,
  clearSelectedPad,
  updateNudgeValue
} = sequencerSlice.actions;

export default sequencerSlice.reducer;




import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

const numPads = 32;

// Types
interface Sequencer {
  padCommands: PadCommand[];
  nudgeValues: number[];
  activeBank: 'A' | 'B';
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
  nudgeValues: Array(numPads).fill(0),
  activeBank: 'A'
});

// Initial State
const initialState: SequencerState = {
  selectedSequencerId: null,
  selectedPadId: null,
  sequencers: {
    'seq1': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0),
      activeBank: 'A'
     },
     'seq2': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0),
      activeBank: 'A'
     },
     'seq3': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0),
      activeBank: 'A'
     },
     'seq4': { 
      padCommands: Array(numPads).fill(PadCommand.EMPTY),
      nudgeValues: Array(numPads).fill(0),
      activeBank: 'A'
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
    },
    toggleCommandBank: (state, action: PayloadAction<{sequencerId: string}>) => {
      const sequencer = state.sequencers[action.payload.sequencerId];
      sequencer.activeBank = sequencer.activeBank === 'A' ? 'B' : 'A';
    }
  }
});
export const {
  updatePadCommand,
  clearAllPads,
  setSelectedPad,
  clearSelectedPad,
  updateNudgeValue,
  toggleCommandBank
} = sequencerSlice.actions;

export default sequencerSlice.reducer;




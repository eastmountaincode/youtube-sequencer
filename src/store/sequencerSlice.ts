import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

// Types
interface Sequencer {
  padCommands: PadCommand[];
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

// Helpers
const createEmptySequencer = (): Sequencer => ({
  padCommands: Array(16).fill(PadCommand.EMPTY)
});

// Initial State
const initialState = {
  selectedSequencerId: null,
  selectedPadId: null,
  sequencers: {
    'seq1': { padCommands: Array(16).fill(PadCommand.EMPTY) },
    'seq2': { padCommands: Array(16).fill(PadCommand.EMPTY) },
    'seq3': { padCommands: Array(16).fill(PadCommand.EMPTY) },
    'seq4': { padCommands: Array(16).fill(PadCommand.EMPTY) }
  }
};

// Slice
export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
    updatePadCommand: (state, action: PayloadAction<UpdatePadCommandPayload>) => {
      const { sequencerId, padId, command } = action.payload;
      state.sequencers[sequencerId as keyof typeof state.sequencers].padCommands[padId] = command;
    },
    clearAllPads: (state, { payload: { sequencerId } }) => {
      state.sequencers[sequencerId as keyof typeof state.sequencers] = createEmptySequencer();
    },
    createSequencer: (state, { payload: { sequencerId } }) => {
      state.sequencers[sequencerId as keyof typeof state.sequencers] = createEmptySequencer();
    },
    setSelectedPad: (state, { payload }) => {
      state.selectedSequencerId = payload.sequencerId;
      state.selectedPadId = payload.padId;
    },
    clearSelectedPad: (state) => {
      state.selectedSequencerId = null;
      state.selectedPadId = null;
    }
  }
});
export const {
  updatePadCommand,
  clearAllPads,
  createSequencer,
  setSelectedPad,
  clearSelectedPad
} = sequencerSlice.actions;

export default sequencerSlice.reducer;




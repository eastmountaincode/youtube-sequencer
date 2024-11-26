import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

const numPads = 32;

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
  padCommands: Array(numPads).fill(PadCommand.EMPTY)
});

// Initial State
const initialState: SequencerState = {
  selectedSequencerId: null,
  selectedPadId: null,
  sequencers: {
    'seq1': { padCommands: Array(numPads).fill(PadCommand.EMPTY) },
    'seq2': { padCommands: Array(numPads).fill(PadCommand.EMPTY) },
    'seq3': { padCommands: Array(numPads).fill(PadCommand.EMPTY) },
    'seq4': { padCommands: Array(numPads).fill(PadCommand.EMPTY) }
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
    }
  }
});
export const {
  updatePadCommand,
  clearAllPads,
  setSelectedPad,
  clearSelectedPad
} = sequencerSlice.actions;

export default sequencerSlice.reducer;




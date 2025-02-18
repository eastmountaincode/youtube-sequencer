import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadCommand } from '../types';

const numPads = 32;

// Types
interface Sequencer {
  padCommands: {
    A: PadCommand[];
    B: PadCommand[];
  };
  nudgeValues: {
    A: number[];
    B: number[];
  };
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
  padCommands: {
    A: Array(numPads).fill(PadCommand.EMPTY),
    B: Array(numPads).fill(PadCommand.EMPTY)
  },
  nudgeValues: {
    A: Array(numPads).fill(0),
    B: Array(numPads).fill(0)
  },
  activeBank: 'A'
});

// Initial State
const initialState: SequencerState = {
  selectedSequencerId: "seq3",
  selectedPadId: 31,
  sequencers: {
    'seq1': {
      padCommands: {
        A: [
          PadCommand.THREE, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.THREE, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY
        ],
        B: [
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.FOUR, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.FOUR, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.FOUR, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.EMPTY, PadCommand.FOUR, PadCommand.FOUR, PadCommand.EMPTY
        ]
      },
      nudgeValues: {
        A: [
          0.1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0.1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0
        ],
        B: Array(numPads).fill(0)
      },
      activeBank: 'A'
    },
    'seq2': {
      padCommands: {
        A: [
          PadCommand.ONE, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.ONE, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY
        ],
        B: [
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.ONE, PadCommand.ARROW_RIGHT, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY,
          PadCommand.ONE, PadCommand.ARROW_RIGHT, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY, PadCommand.EMPTY
        ]
      },
      nudgeValues: {
        A: Array(numPads).fill(0),
        B: Array(numPads).fill(0)
      },
      activeBank: 'A'
    },
    'seq3': createEmptySequencer(),
    'seq4': createEmptySequencer()
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
      const activeBank = state.sequencers[sequencerId].activeBank;
      state.sequencers[sequencerId].padCommands[activeBank][padId] = command;
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
      const activeBank = state.sequencers[sequencerId].activeBank;
      const clampedNudge = Math.max(-3, Math.min(3, nudgeValue));
      state.sequencers[sequencerId].nudgeValues[activeBank][padId] = clampedNudge;
    },
    toggleCommandBank: (state, action: PayloadAction<{ sequencerId: string }>) => {
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




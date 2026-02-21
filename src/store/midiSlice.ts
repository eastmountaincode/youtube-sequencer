import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SyncMode = 'internal' | 'follower' | 'leader';

interface MidiDeviceInfo {
    id: string;
    name: string;
}

interface MidiState {
    isSupported: boolean;
    isInitialized: boolean;
    syncMode: SyncMode;
    availableInputs: MidiDeviceInfo[];
    availableOutputs: MidiDeviceInfo[];
    selectedInputId: string | null;
    selectedOutputId: string | null;
    detectedBpm: number | null;
    syncOffset: number; // tick offset for follower mode phase adjustment
}

const initialState: MidiState = {
    isSupported: false,
    isInitialized: false,
    syncMode: 'internal',
    availableInputs: [],
    availableOutputs: [],
    selectedInputId: null,
    selectedOutputId: null,
    detectedBpm: null,
    syncOffset: 0,
};

export const midiSlice = createSlice({
    name: 'midi',
    initialState,
    reducers: {
        setMidiSupported: (state, { payload }: PayloadAction<boolean>) => {
            state.isSupported = payload;
        },
        setMidiInitialized: (state, { payload }: PayloadAction<boolean>) => {
            state.isInitialized = payload;
        },
        setSyncMode: (state, { payload }: PayloadAction<SyncMode>) => {
            state.syncMode = payload;
        },
        setAvailableInputs: (state, { payload }: PayloadAction<MidiDeviceInfo[]>) => {
            state.availableInputs = payload;
        },
        setAvailableOutputs: (state, { payload }: PayloadAction<MidiDeviceInfo[]>) => {
            state.availableOutputs = payload;
        },
        setSelectedInputId: (state, { payload }: PayloadAction<string | null>) => {
            state.selectedInputId = payload;
        },
        setSelectedOutputId: (state, { payload }: PayloadAction<string | null>) => {
            state.selectedOutputId = payload;
        },
        setMidiDetectedBpm: (state, { payload }: PayloadAction<number | null>) => {
            state.detectedBpm = payload;
        },
        setSyncOffset: (state, { payload }: PayloadAction<number>) => {
            state.syncOffset = payload;
        },
    },
});

export const {
    setMidiSupported,
    setMidiInitialized,
    setSyncMode,
    setAvailableInputs,
    setAvailableOutputs,
    setSelectedInputId,
    setSelectedOutputId,
    setMidiDetectedBpm,
    setSyncOffset,
} = midiSlice.actions;

export default midiSlice.reducer;

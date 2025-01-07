import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersistentAudioSettingsState {
    bpm: number;
    volumes: Record<string, number>;
    mutedModules: Record<string, boolean>; // Add this
}

const initialState: PersistentAudioSettingsState = {
    bpm: 120,
    volumes: {
        'seq1': 100,
        'seq2': 100,
        'seq3': 100,
        'seq4': 100
    },
    mutedModules: {
        'seq1': false,
        'seq2': false,
        'seq3': false,
        'seq4': false
    }
};

export const persistentAudioSettingsSlice = createSlice({
    name: 'persistentAudioSettings',
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<PersistentAudioSettingsState>) => {
            return action.payload;
        },
        setBpm: (state, { payload }: PayloadAction<number>) => {
            state.bpm = payload;
        },
        setVolume: (state, action: PayloadAction<{ sequencerId: string, volume: number }>) => {
            if (!state.volumes) {
                state.volumes = {};
            }
            state.volumes[action.payload.sequencerId] = action.payload.volume;
        },
        setModuleMute: (state, action: PayloadAction<{ sequencerId: string, isMuted: boolean }>) => {
            if (!state.mutedModules) {
                state.mutedModules = {};
            }
            state.mutedModules[action.payload.sequencerId] = action.payload.isMuted;
        }
    }
});

export const { setBpm, setVolume, setModuleMute } = persistentAudioSettingsSlice.actions;
export default persistentAudioSettingsSlice.reducer;


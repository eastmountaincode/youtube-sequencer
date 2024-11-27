import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersistentAudioSettingsState {
    bpm: number;
    volumes: Record<string, number>;
}

const initialState: PersistentAudioSettingsState = {
    bpm: 120,
    volumes: {
        'seq1': 100,
        'seq2': 100,
        'seq3': 100,
        'seq4': 100
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
        }
    }
});

export const { setBpm, setVolume } = persistentAudioSettingsSlice.actions;
export default persistentAudioSettingsSlice.reducer;


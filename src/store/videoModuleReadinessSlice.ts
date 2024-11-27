import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoModuleReadinessState {
  modules: Record<string, {
    isPlayerReady: boolean;
    isLoadButtonPressed: boolean;
  }>;
}

const initialState: VideoModuleReadinessState = {
  modules: {
    'seq1': { isPlayerReady: false, isLoadButtonPressed: false },
    'seq2': { isPlayerReady: false, isLoadButtonPressed: false },
    'seq3': { isPlayerReady: false, isLoadButtonPressed: false },
    'seq4': { isPlayerReady: false, isLoadButtonPressed: false }
  }
};

export const videoModuleReadinessSlice = createSlice({
  name: 'videoModuleReadiness',
  initialState,
  reducers: {
    setModulePlayerReady: (state, action: PayloadAction<{ videoModuleId: string, isReady: boolean }>) => {
      state.modules[action.payload.videoModuleId].isPlayerReady = action.payload.isReady;
    },
    setModuleLoadButtonPressed: (state, action: PayloadAction<{ videoModuleId: string, isPressed: boolean }>) => {
      state.modules[action.payload.videoModuleId].isLoadButtonPressed = action.payload.isPressed;
    },
    resetAllReadinessStates: (state) => {
      Object.keys(state.modules).forEach(moduleId => {
        state.modules[moduleId] = { isPlayerReady: false, isLoadButtonPressed: false };
      });
    }
  }
});


export const { setModulePlayerReady, setModuleLoadButtonPressed, resetAllReadinessStates } = videoModuleReadinessSlice.actions;
export default videoModuleReadinessSlice.reducer;

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

export const playerRefs: Record<string, YT.Player> = {};

// Types
interface VideoModule {
  videoUrl: string;
  videoId: string;
  isReady: boolean;
}

interface VideoModuleState {
  modules: Record<string, VideoModule>
}

// Initial State
const initialState: VideoModuleState = {
  modules: {
    'video1': {
      videoUrl: "",
      videoId: "",
      isReady: false
    },
    'video2': {
      videoUrl: "",
      videoId: "",
      isReady: false
    },
    'video3': {
      videoUrl: "",
      videoId: "",
      isReady: false
    },
    'video4': {
      videoUrl: "",
      videoId: "",
      isReady: false
    }
  }
};

export const resetModuleReadyStates = createAction('videoModule/resetModuleReadyStates');

// Slice
export const videoModuleSlice = createSlice({
  name: 'videoModule',
  initialState,
  reducers: {
    setModuleVideoUrl: (state, action: PayloadAction<{ videoUrl: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoUrl = action.payload.videoUrl;
    },
    setModuleVideoId: (state, action: PayloadAction<{ videoId: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoId = action.payload.videoId;
    },
    setModuleReady: (state, action: PayloadAction<{ videoModuleId: string, isReady: boolean }>) => {
      state.modules[action.payload.videoModuleId].isReady = action.payload.isReady;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetModuleReadyStates, (state) => {
        Object.keys(state.modules).forEach(moduleId => {
            state.modules[moduleId].isReady = false;
            state.modules[moduleId].videoId = "";


        });
    });
}
});

export const {
  setModuleVideoUrl,
  setModuleVideoId,
  setModuleReady
} = videoModuleSlice.actions;

export default videoModuleSlice.reducer;



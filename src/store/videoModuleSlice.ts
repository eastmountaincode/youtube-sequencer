import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  }
});

export const {
  setModuleVideoUrl,
  setModuleVideoId,
  setModuleReady
} = videoModuleSlice.actions;

export default videoModuleSlice.reducer;



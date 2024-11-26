import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// We keep player references in a separate map outside Redux because
// Redux/Immer can't handle DOM elements in the store.
// This map lets us maintain direct references to the YouTube players
// so we can send them commands (play, pause, seek, etc.)
export const playerRefs: Record<string, YT.Player> = {};


// Types
interface VideoModule {
  isReady: boolean;
  videoUrl: string;
  videoId: string;
}

interface VideoModuleState {
  modules: Record<string, VideoModule>
}

// Initial State
const initialState: VideoModuleState = {
  modules: {
    'video1': {
      isReady: false,
      videoUrl: "",
      videoId: "",
    },
    'video2': {
      isReady: false,
      videoUrl: "",
      videoId: "",
    },
    'video3': {
      isReady: false,
      videoUrl: "",
      videoId: "",
    },
    'video4': {
      isReady: false,
      videoUrl: "",
      videoId: "",
    }
  }
};

// Slice
export const videoModuleSlice = createSlice({
  name: 'videoModule',
  initialState,
  reducers: {
    setModuleReady: (state, action: PayloadAction<{ videoModuleId: string, isReady: boolean }>) => {
      state.modules[action.payload.videoModuleId].isReady = action.payload.isReady;
    },
    setModuleVideoUrl: (state, action: PayloadAction<{ videoUrl: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoUrl = action.payload.videoUrl;
    },
    setModuleVideoId: (state, action: PayloadAction<{ videoId: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoId = action.payload.videoId;
    }

  }
});

export const {
  setModuleReady,
  setModuleVideoUrl,
  setModuleVideoId,
} = videoModuleSlice.actions;

export default videoModuleSlice.reducer;


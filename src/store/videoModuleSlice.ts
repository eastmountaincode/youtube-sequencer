import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const playerRefs: Record<string, YT.Player> = {};

// Types
interface VideoModule {
  videoUrl: string;
  videoId: string;
}

interface VideoModuleState {
  modules: Record<string, VideoModule>
}

// Initial State
const initialState: VideoModuleState = {
  modules: {
    'seq1': {
      videoUrl: "",
      videoId: "",
    },
    'seq2': {
      videoUrl: "",
      videoId: "",
    },
    'seq3': {
      videoUrl: "",
      videoId: "",
    },
    'seq4': {
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
    setState: (state, action: PayloadAction<VideoModuleState>) => {
      return action.payload;
    },
    setModuleVideoUrl: (state, action: PayloadAction<{ videoUrl: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoUrl = action.payload.videoUrl;
    },
    setModuleVideoId: (state, action: PayloadAction<{ videoId: string, videoModuleId: string }>) => {
      state.modules[action.payload.videoModuleId].videoId = action.payload.videoId;
    }
  },
});

export const {
  setModuleVideoUrl,
  setModuleVideoId,
} = videoModuleSlice.actions;

export default videoModuleSlice.reducer;



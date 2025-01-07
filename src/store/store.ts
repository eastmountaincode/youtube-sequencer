import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import audioEngineReducer from './audioEngineSlice';
import sequencerPadReducer from './sequencerSlice';
import videoModuleReducer from './videoModuleSlice';
import videoModuleReadinessReducer from './videoModuleReadinessSlice';
import persistentAudioSettingsReducer from './persistentAudioSettingsSlice';
import authReducer from './authSlice';
import patternsDisplayReducer from './patternsDisplaySlice';
import modalReducer from './modalSlice';

const rootReducer = combineReducers({
  audioEngine: audioEngineReducer,
  sequencer: sequencerPadReducer,
  videoModule: videoModuleReducer,
  videoModuleReadiness: videoModuleReadinessReducer,
  persistentAudioSettings: persistentAudioSettingsReducer,
  auth: authReducer,
  patternsDisplay: patternsDisplayReducer,
  modal: modalReducer,

});

const CURRENT_VERSION = 2;

const persistConfig = {
  key: 'root',
  storage,
  version: CURRENT_VERSION,
  whitelist: ['videoModule', 'sequencer', 'persistentAudioSettings', 'auth']
};

// Add version check before rehydration
const versionedReducer = (state: any, action: any) => {
  // Only check version during rehydration
  if (action.type === 'persist/REHYDRATE') {
    const persistedState = state?._persist?.version;
    console.log('Rehydrating with version:', persistedState);
    
    if (persistedState === undefined || persistedState !== CURRENT_VERSION) {
      storage.removeItem('persist:root');
      return persistedReducer(undefined, action);
    }
  }
  
  return persistedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: versionedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

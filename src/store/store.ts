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

const CURRENT_VERSION = 8;

const persistConfig = {
  key: 'root',
  storage,
  version: CURRENT_VERSION,
  whitelist: ['videoModule', 'sequencer', 'persistentAudioSettings', 'auth']
};

const versionedReducer = (state: any, action: any) => {
  if (action.type === 'persist/REHYDRATE') {
    const storedVersion = localStorage.getItem('state_version');
    console.log('Stored version:', storedVersion);
    
    if (!storedVersion || parseInt(storedVersion) !== CURRENT_VERSION) {
      console.log('Version mismatch - clearing storage');
      localStorage.setItem('state_version', CURRENT_VERSION.toString());
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


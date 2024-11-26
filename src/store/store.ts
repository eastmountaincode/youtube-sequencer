import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import audioEngineReducer from './audioEngineSlice';
import sequencerPadReducer from './sequencerSlice';
import videoModuleReducer from './videoModuleSlice';

const rootReducer = combineReducers({
  audioEngine: audioEngineReducer,
  sequencer: sequencerPadReducer,
  videoModule: videoModuleReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['videoModule'] // Only videoModule state will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
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

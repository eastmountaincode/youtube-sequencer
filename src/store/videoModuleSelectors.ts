import { RootState } from './store';

export const selectReadyModules = (state: RootState) =>
    Object.entries(state.videoModule.modules)
        .filter(([_, module]) => module.isReady)
        .map(([id]) => id);

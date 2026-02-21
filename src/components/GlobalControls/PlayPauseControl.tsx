import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPlaying } from "../../store/audioEngineSlice";
import { sendPlayCommand, sendPauseCommand } from '../../utils/videoModuleCommands';
import { playerRefs } from "../../store/videoModuleSlice";

const PlayPauseControl: React.FC = () => {
    const dispatch = useDispatch();
    const { isPlaying } = useSelector((state: RootState) => state.audioEngine);
    const syncMode = useSelector((state: RootState) => state.midi.syncMode);
    const isFollowerMode = syncMode === 'follower';
    const readyStates = useSelector((state: RootState) => state.videoModuleReadiness.modules);
    const readyModuleIds = Object.entries(readyStates)
        .filter(([_, state]) => state.isPlayerReady)
        .map(([id]) => id);

    const handlePlayPause = () => {
        const newPlayingState = !isPlaying;
        dispatch(setPlaying(newPlayingState));

        readyModuleIds.forEach(moduleId => {
            const player = playerRefs[moduleId];
            if (player) {
                if (newPlayingState) {
                    sendPlayCommand(player);
                } else {
                    sendPauseCommand(player);
                }
            }
        });
    };

    return (
        <button
            onClick={handlePlayPause}
            disabled={isFollowerMode}
            style={{
                background: isFollowerMode
                    ? 'var(--bg-tertiary)'
                    : isPlaying ? 'var(--danger)' : 'var(--success)',
                border: isFollowerMode ? '1px solid var(--border-color)' : 'none',
                color: isFollowerMode ? 'var(--text-muted)' : '#000',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: isFollowerMode ? 'not-allowed' : 'pointer',
                minWidth: '72px',
            }}
        >
            {isFollowerMode ? 'EXT' : isPlaying ? '■ STOP' : '▶ PLAY'}
        </button>
    );
};

export default PlayPauseControl;

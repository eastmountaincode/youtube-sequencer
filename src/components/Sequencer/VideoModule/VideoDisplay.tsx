import React, { useEffect, useState, useRef } from 'react';
import { executeCommand, sendPlayCommand, sendPauseCommand } from '../../../utils/videoModuleCommands';
import { PadCommand } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { playerRefs } from '../../../store/videoModuleSlice';
import { RootState } from '../../../store/store';
import { setModuleMute, setPlaybackSpeed, setVolume } from '../../../store/persistentAudioSettingsSlice';
import { setFocusedModule } from '../../../store/videoModuleReadinessSlice';

/// <reference types="youtube" />

interface VideoDisplayProps {
    videoId: string | null;
    videoModuleId: string;
    onPlayerReady: (player: YT.Player) => void;
    onClear: () => void;
}

const moduleKeyMap = {
    'seq1': 'y',
    'seq2': 'u',
    'seq3': 'h',
    'seq4': 'j'
};

const VideoDisplay: React.FC<VideoDisplayProps> = ({
    videoId,
    videoModuleId,
    onPlayerReady,
    onClear
}) => {
    const dispatch = useDispatch();
    const volume = useSelector((state: RootState) =>
        state.persistentAudioSettings?.volumes?.[videoModuleId] ?? 100
    );


    const isMuted = useSelector((state: RootState) =>
        state.persistentAudioSettings.mutedModules[videoModuleId] ?? false
    );

    // Get readiness states from Redux
    const { isPlayerReady, isLoadButtonPressed } = useSelector((state: RootState) =>
        state.videoModuleReadiness.modules[videoModuleId]
    );

    const isSaveModalOpen = useSelector((state: RootState) => state.modal.isSaveModalOpen);

    const focusedModuleId = useSelector((state: RootState) => state.videoModuleReadiness.focusedModuleId);
    const isFocused = focusedModuleId === videoModuleId;

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    const playbackSpeed = useSelector((state: RootState) =>
        state.persistentAudioSettings?.playbackSpeeds?.[videoModuleId] ?? 1
    );

    useEffect(() => {
        if (videoId) {
            // Destroy existing player if any
            const existingPlayer = playerRefs[videoModuleId];
            if (existingPlayer) {
                try {
                    existingPlayer.destroy();
                } catch (e) {
                    console.log('Error destroying player:', e);
                }
                delete playerRefs[videoModuleId];
            }

            // Small delay to ensure DOM is ready after cleanup
            const timeoutId = setTimeout(() => {
                if (!playerContainerRef.current) return;

                // Imperatively create the target div so React doesn't track it.
                // YouTube's IFrame API will replace it with an <iframe>.
                playerContainerRef.current.innerHTML = '';
                const playerDiv = document.createElement('div');
                playerDiv.id = `youtube-player-${videoModuleId}`;
                playerDiv.style.width = '100%';
                playerDiv.style.height = '100%';
                playerContainerRef.current.appendChild(playerDiv);

                new window.YT.Player(`youtube-player-${videoModuleId}`, {
                    width: '100%',
                    height: '100%',
                    videoId: videoId,
                    playerVars: {
                        fs: 0,           // prevent fullscreen
                        controls: 0,     // hide player controls
                        disablekb: 1,    // disable keyboard controls on iframe
                        modestbranding: 1, // minimal branding
                        rel: 0,          // don't show related videos
                        showinfo: 0      // hide video title
                    },
                    events: {
                        onReady: (event: YT.PlayerEvent) => {
                            console.log('YT.Player onReady fired!');
                            const player = event.target;
                            executeCommand({
                                command: PadCommand.VOLUME,
                                player: player,
                                dispatch: dispatch,
                                nudgeValue: 0,
                                volume: volume
                            });
                            // Set initial playback speed
                            executeCommand({
                                command: PadCommand.PLAYBACK_SPEED,
                                player: player,
                                dispatch: dispatch,
                                speed: playbackSpeed
                            });
                            // Apply initial mute state
                            if (isMuted) {
                                executeCommand({
                                    player,
                                    command: PadCommand.PLAYER_MUTE,
                                    dispatch: dispatch,
                                });
                            }
                            onPlayerReady(player);
                        }
                    }
                });
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [videoId, videoModuleId, dispatch]);

    useEffect(() => {
        const targetKey = moduleKeyMap[videoModuleId as keyof typeof moduleKeyMap];

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;
            if (event.key === targetKey && playerRefs[videoModuleId] && !event.repeat) {
                const player = playerRefs[videoModuleId];
                const newMutedState = !isMuted;
                dispatch(setModuleMute({ sequencerId: videoModuleId, isMuted: newMutedState }));
                executeCommand({
                    player,
                    command: newMutedState ? PadCommand.PLAYER_MUTE : PadCommand.PLAYER_UNMUTE,
                    dispatch: dispatch,
                });
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;
            if (event.key === targetKey && playerRefs[videoModuleId]) {
                const player = playerRefs[videoModuleId];
                const newMutedState = !isMuted;
                dispatch(setModuleMute({ sequencerId: videoModuleId, isMuted: newMutedState }));
                executeCommand({
                    player,
                    command: newMutedState ? PadCommand.PLAYER_MUTE : PadCommand.PLAYER_UNMUTE,
                    dispatch: dispatch,
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [videoModuleId, isMuted, isSaveModalOpen]);

    // Handle keyboard controls when this module is focused
    useEffect(() => {
        if (!isFocused || !isPlayerReady) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;
            const key = event.key;
            const player = playerRefs[videoModuleId];

            if (!player) return;

            // 0-9: Seek to percentage
            if (key >= '0' && key <= '9') {
                const duration = player.getDuration();
                const percentage = parseInt(key) / 10; // 0 = 0%, 9 = 90%
                const seekTime = duration * percentage;
                player.seekTo(seekTime, true);
            }
            // Arrow keys: Seek forward/backward
            if (key === 'ArrowLeft' || key === '[') {
                event.preventDefault();
                const currentTime = player.getCurrentTime();
                player.seekTo(Math.max(0, currentTime - 5), true);
            }
            if (key === 'ArrowRight' || key === ']') {
                event.preventDefault();
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                player.seekTo(Math.min(duration, currentTime + 5), true);
            }
            // Escape to unfocus
            if (key === 'Escape') {
                dispatch(setFocusedModule(null));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, isPlayerReady, videoModuleId, isSaveModalOpen, dispatch]);

    const handleFocusClick = () => {
        if (isPlayerReady) {
            dispatch(setFocusedModule(isFocused ? null : videoModuleId));
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        dispatch(setVolume({ sequencerId: videoModuleId, volume: newVolume }));
        const player = playerRefs[videoModuleId];
        if (player) {
            executeCommand({
                command: PadCommand.VOLUME,
                player: player,
                dispatch: dispatch,
                nudgeValue: 0,
                volume: newVolume
            });
        }
    };

    const handleMuteButtonClick = () => {
        const player = playerRefs[videoModuleId];
        if (player) {
            const newMutedState = !isMuted;
            dispatch(setModuleMute({ sequencerId: videoModuleId, isMuted: newMutedState }));
            executeCommand({
                player,
                command: newMutedState ? PadCommand.PLAYER_MUTE : PadCommand.PLAYER_UNMUTE,
                dispatch: dispatch,
            });
        }
    };


    const handleSpeedChange = (newSpeed: number) => {
        dispatch(setPlaybackSpeed({ sequencerId: videoModuleId, speed: newSpeed }));
        const player = playerRefs[videoModuleId];
        if (player) {
            executeCommand({
                command: PadCommand.PLAYBACK_SPEED,
                player,
                dispatch,
                speed: newSpeed
            });
        }
    };

    const handlePlayPause = () => {
        const player = playerRefs[videoModuleId];
        if (player) {
            if (isVideoPlaying) {
                sendPauseCommand(player);
            } else {
                sendPlayCommand(player);
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };


    const btnStyle = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        padding: '4px 6px',
        cursor: isPlayerReady ? 'pointer' : 'not-allowed',
        color: 'var(--text-muted)',
        fontSize: '10px',
        fontWeight: 600,
        opacity: isPlayerReady ? 1 : 0.4
    };

    return (
        <div
            className="video-preview p-2 mb-1"
            style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)'
            }}
        >
            {/* Top row: Video + Volume */}
            <div className="d-flex align-items-center gap-2 mb-2">
                {/* VIDEO */}
                <div className="position-relative flex-shrink-0" style={{ width: '100px' }}>
                    {videoId && isLoadButtonPressed ? (
                        <>
                            <div className="ratio ratio-16x9" style={{ backgroundColor: '#000' }}>
                                {!isPlayerReady && (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div style={{ color: 'var(--accent)' }}>...</div>
                                    </div>
                                )}
                                <div
                                    ref={playerContainerRef}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'hidden',
                                        visibility: isPlayerReady ? 'visible' : 'hidden',
                                    }}
                                />
                            </div>
                            {isPlayerReady &&
                                <button
                                    className="position-absolute"
                                    type="button"
                                    onClick={onClear}
                                    style={{
                                        zIndex: 10,
                                        padding: '0 4px',
                                        fontSize: '9px',
                                        top: '2px',
                                        right: '2px',
                                        background: 'var(--danger)',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            }
                        </>
                    ) : (
                        <div
                            className="ratio ratio-16x9"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                            <div className="d-flex justify-content-center align-items-center" style={{ color: 'var(--text-muted)', fontSize: '10px', userSelect: 'none' }}>NO VID</div>
                        </div>
                    )}
                </div>

                {/* Volume */}
                <button
                    onClick={handleMuteButtonClick}
                    disabled={!isPlayerReady}
                    style={{
                        ...btnStyle,
                        background: isMuted ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isMuted ? '#000' : 'var(--text-muted)',
                    }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? 'M' : 'V'}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={!isPlayerReady}
                    className="form-range"
                    style={{ flex: 1, minWidth: '40px', height: '6px', opacity: isPlayerReady ? 1 : 0.4 }}
                />
            </div>

            {/* Speed buttons */}
            <div className="d-flex flex-wrap gap-1 mb-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        disabled={!isPlayerReady}
                        style={{
                            ...btnStyle,
                            background: playbackSpeed === speed ? 'var(--accent)' : 'var(--bg-tertiary)',
                            color: playbackSpeed === speed ? '#000' : 'var(--text-muted)',
                            fontWeight: playbackSpeed === speed ? 600 : 400,
                        }}
                    >
                        {speed}x
                    </button>
                ))}
            </div>

            {/* Play/Pause and Focus */}
            <div className="d-flex gap-1">
                <button
                    onClick={handlePlayPause}
                    disabled={!isPlayerReady}
                    style={{
                        ...btnStyle,
                        background: isVideoPlaying ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isVideoPlaying ? '#000' : 'var(--text-muted)',
                    }}
                    title={isVideoPlaying ? 'Pause' : 'Play'}
                >
                    {isVideoPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                    onClick={handleFocusClick}
                    disabled={!isPlayerReady}
                    style={{
                        ...btnStyle,
                        background: isFocused ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isFocused ? '#000' : 'var(--text-muted)',
                    }}
                    title={isFocused ? 'Unfocus (Esc)' : 'Focus (0-9 to seek)'}
                >
                    FOCUS
                </button>
            </div>
        </div>
    );
};

export default VideoDisplay;

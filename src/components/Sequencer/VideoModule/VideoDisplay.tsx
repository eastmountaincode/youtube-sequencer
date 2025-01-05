import React, { useEffect } from 'react';
import { executeCommand } from '../../../utils/videoModuleCommands';
import { PadCommand } from '../../../types';
import { useVideoModule } from '../../../hooks/useVideoModule';
import { useDispatch, useSelector } from 'react-redux';
import { playerRefs } from '../../../store/videoModuleSlice';
import { RootState } from '../../../store/store';
import { setVolume } from '../../../store/persistentAudioSettingsSlice';

/// <reference types="youtube" />

interface VideoDisplayProps {
    videoId: string | null;
    videoModuleId: string;
    onPlayerReady: (player: YT.Player) => void;
    onClear: () => void;
}

const moduleKeyMap = {
    'seq1': 'e',
    'seq2': 'r',
    'seq3': 'd',
    'seq4': 'f'
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


    const { isMuted, handleMuteToggle } = useVideoModule(videoModuleId);

    // Get readiness states from Redux
    const { isPlayerReady, isLoadButtonPressed } = useSelector((state: RootState) =>
        state.videoModuleReadiness.modules[videoModuleId]
    );

    const isSaveModalOpen = useSelector((state: RootState) => state.modal.isSaveModalOpen);

    useEffect(() => {
        if (videoId) {


            new window.YT.Player(`youtube-player-${videoModuleId}`, {
                videoId: videoId,
                playerVars: {
                    fs: 0 // prevent fullscreen
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
                        onPlayerReady(player);
                    }
                }
            });
        }
    }, [videoId, videoModuleId, dispatch]);

    useEffect(() => {
        const targetKey = moduleKeyMap[videoModuleId as keyof typeof moduleKeyMap];
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;
            if (event.key === targetKey && playerRefs[videoModuleId] && !event.repeat) {
                const player = playerRefs[videoModuleId];
                handleMuteToggle(player);
            }
        };
    
        const handleKeyUp = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;
            if (event.key === targetKey && playerRefs[videoModuleId]) {
                const player = playerRefs[videoModuleId];
                handleMuteToggle(player);
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [videoModuleId, isMuted, isSaveModalOpen]);
    
    
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
        console.log('Mute button/key pressed');
        console.log('Current player:', playerRefs[videoModuleId]);
        const player = playerRefs[videoModuleId];
        if (player) {
            console.log('Player muted state before toggle:', player.isMuted());
            handleMuteToggle(player);
        }
    };

    return (


        <div className="video-preview d-flex flex-column justify-content-center align-items-center border border-1 border-light overflow-hidden"
            style={{ height: '370px' }}>

            {/* FIRST ROW */}
            <div className="d-flex justify-content-center align-items-center mt-2">

                {/* VIDEO */}
                <div style={{ width: '300px' }}>
                    {videoId && isLoadButtonPressed ? (
                        <div className="position-relative">
                            <div className="ratio ratio-16x9">
                                {!isPlayerReady && (
                                    <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {isPlayerReady &&
                                    <div id={`youtube-player-${videoModuleId}`} tabIndex={0}

                                    ></div>
                                }


                            </div>
                            {isPlayerReady &&
                                <button
                                    className="btn btn-danger position-absolute top-0 end-0 m-2"
                                    type="button"
                                    onClick={onClear}
                                    style={{ zIndex: 10 }}
                                >
                                    Clear
                                    <i className="bi bi-x-lg ms-1"></i>
                                </button>
                            }

                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <i className="bi bi-youtube fs-1 text-light"></i>
                        </div>
                    )}
                </div>
                {/* VOLUME SLIDER */}
                {videoId && isPlayerReady && (
                    <div className="volume-control d-flex flex-column justify-content-between align-items-center me-3 ms-3 mt-4"
                        style={{ height: '260px', width: '30px' }}>
                        <i className="bi bi-volume-up fs-4"></i>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            style={{
                                width: '160px',
                                transform: 'rotate(-90deg)',
                            }}
                        />
                        <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-volume-down fs-4"></i>
                            <span className="mt-2" style={{ fontFamily: 'monospace' }}>{volume}%</span>
                        </div>
                    </div>
                )}
            </div>
            {/* SECOND ROW */}
            <div className='mb-5'>
                {/* MUTE BUTTON */}
                {videoId && isPlayerReady &&
                    <div className='d-flex justify-content-center align-items-center'>
                        <button
                            className="btn btn-outline-primary d-flex align-items-center gap-2"
                            onClick={handleMuteButtonClick}
                        >
                            <i className={`bi ${isMuted ? 'bi-volume-mute' : 'bi-volume-up'} fs-4`}></i>
                            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                        </button>
                    </div>
                }


            </div>
        </div>
    );
};

export default VideoDisplay;

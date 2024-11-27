import React, { useEffect, useState } from 'react';
import { executeCommand } from '../../../utils/videoModuleCommands';
import { PadCommand } from '../../../types';
import { useVideoModule } from '../../../hooks/useVideoModule';
import { useDispatch } from 'react-redux';
import { playerRefs } from '../../../store/videoModuleSlice';

interface VideoDisplayProps {
    videoId: string | null;
    videoModuleId: string;
    onPlayerReady: (player: YT.Player) => void;
    onClear: () => void;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
    videoId,
    videoModuleId,
    onPlayerReady,
    onClear
}) => {
    const dispatch = useDispatch();
    const [volume, setVolume] = useState(100);

    // Even though THIS component generates the player readiness signal,
    // we get playerIsReady from the hook to maintain a single source of truth.
    // playerIsReady controls the loading spinner display
    const { isMuted, handleMuteToggle, playerIsReady } = useVideoModule(videoModuleId);

    useEffect(() => {
        if (videoId && playerIsReady) {
            new window.YT.Player(`youtube-player-${videoModuleId}`, {
                videoId: videoId,
                events: {
                    onReady: (event: YT.PlayerEvent) => {
                        console.log('YT.Player onReady fired!');
                        onPlayerReady(event.target);
                    }
                }
            });
        }
    }, [videoId]);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        setVolume(newVolume);
        const player = playerRefs[videoModuleId];
        if (player) {
            executeCommand(PadCommand.VOLUME, player, videoModuleId, dispatch, newVolume);
        }
    };

    const handleMuteButtonClick = () => {
        const player = playerRefs[videoModuleId]; // Get current player reference
        if (player) {
            handleMuteToggle(player);
        }
    };

    return (

        <div className="video-preview mt-3 d-flex flex-column justify-content-center align-items-center"
            style={{ border: '3px solid blue', height: '350px' }}>

            {/* FIRST ROW */}
            <div className="d-flex justify-content-center align-items-center">

                {/* VIDEO */}
                <div style={{ width: '350px', border: '3px solid red' }}>
                    {videoId ? (
                        <div className="position-relative">
                            <div className="ratio ratio-16x9">
                                {videoId && !playerIsReady && (
                                    <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                <div id={`youtube-player-${videoModuleId}`}
                                ></div>

                            </div>
                            <button
                                className="btn btn-danger position-absolute top-0 end-0 m-2"
                                type="button"
                                onClick={onClear}
                                style={{ zIndex: 10 }}
                            >
                                Clear
                                <i className="bi bi-x-lg ms-1"></i>
                            </button>

                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <h4 className="text-muted">YouTube video will appear here</h4>
                        </div>
                    )}
                </div>
                {/* VOLUME SLIDER */}
                {videoId && (
                    <div className="volume-control d-flex flex-column justify-content-between align-items-center me-3 ms-3"
                        style={{ height: '260px', width: '30px' }}>
                        <i className="bi bi-volume-up fs-4"></i>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="100"
                            onChange={handleVolumeChange}
                            style={{
                                width: '160px',
                                transform: 'rotate(-90deg)',
                            }}
                        />
                        <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-volume-down fs-4"></i>
                            <span className="fw-bold mt-2">{volume}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* SECOND ROW */}
            <div className='mb-2'>
                {/* MUTE BUTTON */}
                {videoId &&
                    <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2 px-2 py-1"
                        onClick={handleMuteButtonClick}
                    >
                        <i className={`bi ${isMuted ? 'bi-volume-mute' : 'bi-volume-up'} fs-4`}></i>
                        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </button>
                }
            </div>
        </div>
    );
};

export default VideoDisplay;

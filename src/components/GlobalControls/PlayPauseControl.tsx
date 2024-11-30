import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPlaying } from "../../store/audioEngineSlice";
import { sendPlayCommand, sendPauseCommand } from '../../utils/videoModuleCommands';
import { playerRefs } from "../../store/videoModuleSlice";

const PlayPauseControl: React.FC = () => {
    const dispatch = useDispatch();
    const { isPlaying } = useSelector((state: RootState) => state.audioEngine);
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
        <div className='p-3'>
            <button
                className="btn btn-primary"
                onClick={handlePlayPause}
            >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
        </div>
    );
};

export default PlayPauseControl;

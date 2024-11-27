import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPlaying } from "../../store/audioEngineSlice";
import { sendPlayCommand, sendPauseCommand } from '../../utils/videoModuleCommands';
import { playerRefs } from "../../store/videoModuleSlice";
import BpmControl from "./BpmControl";

const GlobalControls: React.FC = () => {
    const dispatch = useDispatch();

    const { isPlaying, currentStep } = useSelector((state: RootState) => state.audioEngine);
    const videoModules = useSelector((state: RootState) => state.videoModule.modules);
    const readyModuleIds = Object.entries(videoModules)
        .filter(([_, module]) => module.isReady)
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

    const renderStepNumber = (step: number) => {
        // Convert to 1-based index and handle numbers 1-numPads
        const displayStep = step + 1;
        if (displayStep < 10) {
            return <i className={`bi bi-${displayStep}-square`}></i>;
        } else {
            // Split double digits into individual numbers
            const digits = displayStep.toString().split('');
            return (
                <>
                    <i className={`bi bi-${digits[0]}-square`}></i>
                    <i className={`bi bi-${digits[1]}-square`}></i>
                </>
            );
        }
    };

    return (
        <div className="global-controls border border-warning border-3 p-3">
            <h4>Global Controls</h4>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center mb-2 w-100" style={{ maxWidth: '600px' }}>
                    {/* BPM CONTROL */}
                    <BpmControl />
                    {/* PLAY PAUSE CONTROL */}
                    <div className="transport-controls">
                        <button
                            className="btn btn-primary me-2"
                            onClick={handlePlayPause}
                        >
                            <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                        </button>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="video-modules-status me-3">
                        <span className="badge bg-secondary me-2">
                            V Modules: {Object.keys(videoModules).length}
                        </span>
                        <span className="badge bg-success">
                            Ready: {readyModuleIds.length}
                        </span>
                    </div>

                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <div className="current-step">
                        <span className="fs-4">Step: {renderStepNumber(currentStep)}</span>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-center mt-3">
                    <div className="player-refs-display">
                        Player Refs: {Object.keys(playerRefs).join(', ')}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <pre>
                        {JSON.stringify(videoModules, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default GlobalControls;

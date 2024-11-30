import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPlaying } from "../../store/audioEngineSlice";
import { sendPlayCommand, sendPauseCommand } from '../../utils/videoModuleCommands';
import { playerRefs } from "../../store/videoModuleSlice";
import BpmControl from "./BpmControl";
import SaveLoad from "./SaveLoad";
import { audioEngine } from "../../services/audioEngine";

const GlobalControls: React.FC = () => {
    const dispatch = useDispatch();

    const { isPlaying, currentStep } = useSelector((state: RootState) => state.audioEngine);
    const videoModules = useSelector((state: RootState) => state.videoModule.modules);
    const readyStates = useSelector((state: RootState) => state.videoModuleReadiness.modules);
    const readyModuleIds = Object.entries(readyStates)
        .filter(([_, state]) => state.isPlayerReady)
        .map(([id]) => id);
    const [metronomeEnabled, setMetronomeEnabled] = useState(false);


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

    const handleMetronomeToggle = () => {
        const newState = !metronomeEnabled;
        setMetronomeEnabled(newState);
        audioEngine.setMetronomeEnabled(newState);
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
                        {/* METRONOME CONTROL */}
                        <button
                            className={`btn ${metronomeEnabled ? 'btn-success' : 'btn-outline-secondary'} me-2`}
                            onClick={handleMetronomeToggle}
                        >
                            <i className="bi bi-music-note-beamed"></i>
                        </button>
                    </div>
                    <SaveLoad />

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
            </div>
        </div>
    );
};

export default GlobalControls;

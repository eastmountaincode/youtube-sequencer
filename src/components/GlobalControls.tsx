import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setBpm, setPlaying } from "../store/audioEngineSlice";
import { playerRefs } from "../store/videoModuleSlice";
import { sendPlayCommand, sendPauseCommand } from '../utils/videoModuleCommands';
import { selectReadyModules } from '../store/videoModuleSelectors';


const GlobalControls: React.FC = () => {
    const dispatch = useDispatch();
    const { bpm, isPlaying, currentStep } = useSelector((state: RootState) => state.audioEngine);
    const videoModules = useSelector((state: RootState) => state.videoModule.modules);
    const readyModuleIds = useSelector(selectReadyModules);

    const handlePlayPause = () => {
        const newPlayingState = !isPlaying;
        dispatch(setPlaying(newPlayingState));

        console.log("Ready Modules:", readyModuleIds);
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
        // Convert to 1-based index and handle numbers 1-16
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
                    <div className="bpm-control flex-grow-1 mx-3 me-4">
                        <div className="d-flex align-items-center">
                            <label htmlFor="bpm" className="me-2 text-nowrap">BPM: {bpm}</label>
                            <input
                                type="range"
                                id="bpm"
                                className="form-range"
                                value={bpm}
                                onChange={(e) => dispatch(setBpm(Number(e.target.value)))}
                                min={30}
                                max={300}
                                step={1}
                            />
                        </div>
                    </div>
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
                            Ready: {Object.values(videoModules).filter(m => m.isReady).length}
                        </span>
                    </div>

                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <div className="current-step">
                        <span className="fs-4">Step: {renderStepNumber(currentStep)}</span>
                    </div>
                </div>
                {/* <div className="d-flex align-items-center justify-content-center mt-3">
                    <div className="debug-info">
                        <h5>IFrame References:</h5>
                        <ul>
                            {Object.entries(playerRefs).map(([id, ref]) => (
                                <li key={id}>
                                    Module {id}: {ref ? '✅ Ready' : '❌ Not Ready'}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default GlobalControls;

import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BpmControl from "./BpmControl";
import SaveLoad from "./SaveLoad";
import MetronomeControl from "./MetronomeControl";
import PlayPauseControl from "./PlayPauseControl";

const GlobalControls: React.FC = () => {

    const { currentStep } = useSelector((state: RootState) => state.audioEngine);
    const videoModules = useSelector((state: RootState) => state.videoModule.modules);
    const readyStates = useSelector((state: RootState) => state.videoModuleReadiness.modules);
    const readyModuleIds = Object.entries(readyStates)
        .filter(([_, state]) => state.isPlayerReady)
        .map(([id]) => id);

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
        <div className="global-controls border border-warning border-1 overflow-hidden">
            <h4 className="pt-3 ps-3">Global Controls</h4>
            <div className="d-flex flex-column align-items-center">
                
                {/* First Row */}
                <div className="d-flex flex-wrap align-items-center gap-3 justify-content-center">
                    <div className="d-flex gap-3">
                        <BpmControl />
                        <PlayPauseControl />
                    </div>
                    <div className="d-flex gap-3">
                        <MetronomeControl />
                        <SaveLoad />
                    </div>
                </div>

                <hr className="border border-warning border-1 w-100" />


                {/* Second Row */}
                <div className="d-flex align-items-center justify-content-between p-2 gap-5 mt-1 mb-3">
                    <div className="current-step">
                        <span className="fs-4">Step: {renderStepNumber(currentStep)}</span>
                    </div>

                    <div className="video-modules-status">
                        <span className="badge bg-secondary me-2" style={{ userSelect: 'none' }}>
                            V Modules: {Object.keys(videoModules).length}
                        </span>
                        <span className="badge bg-success" style={{ userSelect: 'none' }}>
                            Ready: {readyModuleIds.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalControls;

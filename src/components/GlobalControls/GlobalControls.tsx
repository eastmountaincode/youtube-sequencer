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
        <div className="global-controls border border-success border-3 overflow-hidden bg-success bg-opacity-10">
            <h4 className="pt-3 ps-3">Global Controls</h4>
            <div className="d-flex flex-column align-items-center p-3">

                {/* First Row */}

                <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center" style={{ width: '100%' }}>
                    <BpmControl />
                    <PlayPauseControl />
                    <MetronomeControl />
                    <SaveLoad />
                </div>

                <hr className="border border-success border-1 w-100" />


                {/* Second Row */}
                <div className="d-flex flex-wrap align-items-center justify-content-left gap-3 p-2">
                    <div className="current-step" style={{ width: '120px' }}>
                        <span className="fs-4">Step: {renderStepNumber(currentStep)}</span>
                    </div>

                    <div className="video-modules-status d-flex flex-wrap gap-2">
                        <span className="badge bg-secondary" style={{ userSelect: 'none', width: '90px' }}>
                            V Modules: {Object.keys(videoModules).length}
                        </span>
                        <span className="badge bg-success" style={{ userSelect: 'none', width: '70px' }}>
                            Ready: {readyModuleIds.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalControls;

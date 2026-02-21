import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BpmControl from "./BpmControl";
import SaveLoad from "./SaveLoad";
import MetronomeControl from "./MetronomeControl";
import PlayPauseControl from "./PlayPauseControl";
import MidiSyncControl from "./MidiSyncControl";

const GlobalControls: React.FC = () => {
    const { currentStep } = useSelector((state: RootState) => state.audioEngine);
    const videoModules = useSelector((state: RootState) => state.videoModule.modules);
    const readyStates = useSelector((state: RootState) => state.videoModuleReadiness.modules);
    const readyModuleIds = Object.entries(readyStates)
        .filter(([_, state]) => state.isPlayerReady)
        .map(([id]) => id);

    return (
        <div className="global-controls p-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                <BpmControl />
                <PlayPauseControl />
                <MetronomeControl />
                <MidiSyncControl />
                <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span>STEP</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '20px' }}>
                        {String(currentStep + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>|</span>
                    <span style={{ color: 'var(--success)' }}>{readyModuleIds.length}</span>
                    <span style={{ color: 'var(--text-muted)' }}>/</span>
                    <span>{Object.keys(videoModules).length}</span>
                </div>
                <SaveLoad />
            </div>
        </div>
    );
};

export default GlobalControls;

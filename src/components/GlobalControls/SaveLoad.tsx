import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SaveLoad: React.FC = () => {
    const dispatch = useDispatch();
    const videoModuleState = useSelector((state: RootState) => state.videoModule);
    const sequencerState = useSelector((state: RootState) => state.sequencer);
    const persistentAudioState = useSelector((state: RootState) => state.persistentAudioSettings);

    const saveStateToFile = () => {
        const state = {
            videoModule: videoModuleState,
            sequencer: sequencerState,
            persistentAudioSettings: persistentAudioState
        };
        
        const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sequence.ytx';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            const loadedState = JSON.parse(text);

            // Reset video module readiness states
            dispatch({ type: 'videoModuleReadiness/resetAllReadinessStates' });
            
            dispatch({ type: 'videoModule/setState', payload: loadedState.videoModule });
            dispatch({ type: 'sequencer/setState', payload: loadedState.sequencer });
            dispatch({ type: 'persistentAudioSettings/setState', payload: loadedState.persistentAudioSettings });

            event.target.value = '';
        }
    };

    return (
        <div className="save-load d-flex gap-2">
            <button 
                className="btn btn-primary"
                onClick={saveStateToFile}
            >
                <i className="bi bi-download me-2"></i>
                Save
            </button>
            <label className="btn btn-primary">
                <i className="bi bi-upload me-2"></i>
                Load
                <input
                    type="file"
                    accept=".ytx"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
            </label>
        </div>
    );
};

export default SaveLoad;

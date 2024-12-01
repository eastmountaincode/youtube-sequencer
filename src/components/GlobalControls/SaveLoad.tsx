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

            dispatch({ type: 'videoModuleReadiness/resetAllReadinessStates' }); // Reset video module readiness states

            dispatch({ type: 'videoModule/setState', payload: loadedState.videoModule });
            dispatch({ type: 'sequencer/setState', payload: loadedState.sequencer });
            dispatch({ type: 'persistentAudioSettings/setState', payload: loadedState.persistentAudioSettings });

            event.target.value = '';
        }
    };

    return (
        <div className="save-load d-flex gap-2 p-3 justify-content-center flex-column align-items-center">
            <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                onClick={saveStateToFile}
                style={{ width: '155px' }}
            >
                <i className="bi bi-download me-2"></i>
                Save Workspace
            </button>
            <label className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: '155px' }}>
                <i className="bi bi-upload me-2"></i>
                Load Workspace
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

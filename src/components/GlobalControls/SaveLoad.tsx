import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { audioEngine } from '../../services/audioEngine';
import { validateFile } from '../../utils/validateFile';

const SaveLoad: React.FC = () => {
    const dispatch = useDispatch();
    const videoModuleState = useSelector((state: RootState) => state.videoModule);
    const sequencerState = useSelector((state: RootState) => state.sequencer);
    const persistentAudioState = useSelector((state: RootState) => state.persistentAudioSettings);
    const [fileName, setFileName] = useState(() => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        return `sequence_${dateStr}`;
    }); const [showSaveModal, setShowSaveModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = () => {
        const state = {
            videoModule: videoModuleState,
            sequencer: sequencerState,
            persistentAudioSettings: persistentAudioState
        };

        const formattedJson = JSON.stringify(state, null, 2);  // adds 2 spaces of indentation
        const blob = new Blob([formattedJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.dance`;
        link.click();
        URL.revokeObjectURL(url);
        setShowSaveModal(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const text = await file.text();
                const loadedState = JSON.parse(text);

                if (!validateFile(loadedState)) {
                    setErrorMessage('Invalid file.');
                    setShowErrorModal(true);
                    return;
                }

                dispatch({ type: 'videoModuleReadiness/resetAllReadinessStates' });
                dispatch({ type: 'videoModule/setState', payload: loadedState.videoModule });
                dispatch({ type: 'sequencer/setState', payload: loadedState.sequencer });
                dispatch({ type: 'persistentAudioSettings/setState', payload: loadedState.persistentAudioSettings });

                audioEngine.setBpm(loadedState.persistentAudioSettings.bpm);
                event.target.value = '';

            } catch (error) {
                setErrorMessage('Invalid file.');
                setShowErrorModal(true);
            }
        }
    };

    return (
        <>
            <div className="save-load d-flex gap-2 p-3 justify-content-center flex-column align-items-center">
                <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                    onClick={() => setShowSaveModal(true)}
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
                        accept=".dance"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {/* SAVE MODAL */}
            {showSaveModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">
                                    <i className="bi bi-save me-2"></i>
                                    Save Workspace
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowSaveModal(false)}></button>
                            </div>
                            <div className="modal-body text-dark">
                                <div className="form-group mb-4">
                                    <label className="mb-2">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        Filename:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Error
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowErrorModal(false)}></button>
                            </div>
                            <div className="modal-body text-dark">
                                {errorMessage}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowErrorModal(false)}>
                                    <i className="bi bi-check-circle me-2"></i>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>


    );
};

export default SaveLoad;

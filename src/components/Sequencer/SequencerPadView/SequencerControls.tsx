import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { clearAllPads, updateNudgeValue } from '../../../store/sequencerSlice';

interface SequencerControlsProps {
    sequencerId: string;
    padNudgeValues: number[];
}

const SequencerControls: React.FC<SequencerControlsProps> = ({
    sequencerId,
    padNudgeValues
}) => {
    const dispatch = useDispatch();
    const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
    const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);

    const handleClearAll = () => {
        dispatch(clearAllPads({ sequencerId }));
        // Reset all nudge values to zero
        for (let i = 0; i < padNudgeValues.length; i++) {
            dispatch(updateNudgeValue({
                sequencerId,
                padId: i,
                nudgeValue: 0
            }));
        }
    };

    const handleZeroNudge = () => {
        if (selectedPadId !== null) {
            dispatch(updateNudgeValue({
                sequencerId,
                padId: selectedPadId,
                nudgeValue: 0
            }));
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-3" style={{ height: '60px' }}>
            <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                {selectedPadId !== null && selectedSequencerId === sequencerId && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '320px' }}>
                        <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                            <label htmlFor="nudgeSlider" style={{ minWidth: '60px', fontWeight: 500 }}>Nudge:</label>
                            <input
                                id="nudgeSlider"
                                type="range"
                                min="-300"
                                max="300"
                                step="1"
                                value={padNudgeValues[selectedPadId] * 100}
                                onChange={(e) => {
                                    dispatch(updateNudgeValue({
                                        sequencerId,
                                        padId: selectedPadId,
                                        nudgeValue: Number(e.target.value) / 100
                                    }));
                                }}
                                style={{
                                    width: '200px',
                                    height: '4px',
                                    WebkitAppearance: 'none',
                                    background: '#f0f0f0',
                                    borderRadius: '2px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ minWidth: '70px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px' }}>
                                {(padNudgeValues[selectedPadId]).toFixed(2)}s
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleZeroNudge}
                                style={{ width: '80px' }}
                            >
                                Zero
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div style={{ marginLeft: '24px', minWidth: '130px' }}>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleClearAll}
                >
                    <i className="bi bi-trash me-1"></i>
                    Clear All Pads
                </button>
            </div>
        </div>

    );
};

export default SequencerControls;

import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNudgeValue } from '../../../../store/sequencerSlice';

interface NudgeControlsProps {
    sequencerId: string;
    selectedPadId: number | null;
    padNudgeValues: number[];
}

const NudgeControls: React.FC<NudgeControlsProps> = ({
    sequencerId,
    selectedPadId,
    padNudgeValues
}) => {
    const dispatch = useDispatch();

    const handleZeroNudge = () => {
        if (selectedPadId !== null) {
            dispatch(updateNudgeValue({
                sequencerId,
                padId: selectedPadId,
                nudgeValue: 0
            }));
        }
    };

    const adjustNudge = (amount: number) => {
        if (selectedPadId !== null) {
            const currentValue = padNudgeValues[selectedPadId];
            const newValue = Number((currentValue + amount).toFixed(3));
            const clampedValue = Math.max(-1, Math.min(1, newValue));

            dispatch(updateNudgeValue({
                sequencerId,
                padId: selectedPadId,
                nudgeValue: clampedValue
            }));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '320px', padding: '8px' }}>
            <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                <label htmlFor="nudgeSlider" style={{ minWidth: '60px', fontWeight: 500 }}>Nudge:</label>
                <div style={{ position: 'relative', width: '200px' }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '0',
                        height: '4px',
                        backgroundColor: '#f0f0f0',
                        transform: 'translateY(-50%)',
                        borderRadius: '2px'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${Math.min(Math.abs(padNudgeValues[selectedPadId!] * 49), 50)}%`,
                        height: '4px',
                        backgroundColor: '#007bff',
                        transform: `translateY(-50%) ${padNudgeValues[selectedPadId!] < 0 ? 'translateX(-100%)' : ''}`,
                        borderRadius: '2px'
                    }} />
                    <input
                        id="nudgeSlider"
                        type="range"
                        min="-1000"
                        max="1000"
                        step="1"
                        value={padNudgeValues[selectedPadId!] * 1000}
                        onChange={(e) => {
                            dispatch(updateNudgeValue({
                                sequencerId,
                                padId: selectedPadId!,
                                nudgeValue: Number(e.target.value) / 1000
                            }));
                        }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '20px',
                            WebkitAppearance: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            marginTop: '6px'
                        }}
                    />
                </div>
                <span style={{ minWidth: '70px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px' }}>
                    {(padNudgeValues[selectedPadId!]).toFixed(3)}s
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => adjustNudge(-0.001)}
                >
                    -0.001s
                </button>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => adjustNudge(-0.01)}
                >
                    -0.01s
                </button>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleZeroNudge}
                    style={{ width: '80px' }}
                >
                    Zero
                </button>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => adjustNudge(0.01)}
                >
                    +0.01s
                </button>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => adjustNudge(0.001)}
                >
                    +0.001s
                </button>
            </div>
        </div>
    );
};

export default NudgeControls;

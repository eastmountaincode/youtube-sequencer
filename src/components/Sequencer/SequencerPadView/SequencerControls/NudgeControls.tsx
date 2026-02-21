import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNudgeValue } from '../../../../store/sequencerSlice';

interface NudgeControlsProps {
    sequencerId: string;
    selectedPadId: number | null;
    padNudgeValues: number[];
    isActive: boolean;
}

const NudgeControls: React.FC<NudgeControlsProps> = ({
    sequencerId,
    selectedPadId,
    padNudgeValues,
    isActive
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

    const btnStyle: React.CSSProperties = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        padding: '2px 6px',
        fontSize: '9px',
        cursor: isActive ? 'pointer' : 'not-allowed',
        opacity: isActive ? 1 : 0.4,
    };

    const currentNudgeValue = selectedPadId !== null ? padNudgeValues[selectedPadId] : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="d-flex align-items-center gap-2">
                <span style={{ color: 'var(--text-muted)', fontSize: '10px', opacity: isActive ? 1 : 0.4 }}>NUDGE</span>
                <input
                    id="nudgeSlider"
                    type="range"
                    min="-1000"
                    max="1000"
                    step="1"
                    value={currentNudgeValue * 1000}
                    onChange={(e) => {
                        if (!isActive || selectedPadId === null) return;
                        dispatch(updateNudgeValue({
                            sequencerId,
                            padId: selectedPadId,
                            nudgeValue: Number(e.target.value) / 1000
                        }));
                    }}
                    disabled={!isActive}
                    className="form-range"
                    style={{ width: '80px', height: '4px', opacity: isActive ? 1 : 0.4 }}
                />
                <span style={{ color: 'var(--accent)', fontSize: '10px', minWidth: '50px', opacity: isActive ? 1 : 0.4 }}>
                    {currentNudgeValue.toFixed(3)}s
                </span>
            </div>
            <div className="d-flex flex-wrap gap-1">
                <button style={btnStyle} onClick={() => adjustNudge(-0.01)} disabled={!isActive}>-0.01</button>
                <button style={btnStyle} onClick={() => adjustNudge(-0.001)} disabled={!isActive}>-0.001</button>
                <button style={{ ...btnStyle, color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }} onClick={handleZeroNudge} disabled={!isActive}>0</button>
                <button style={btnStyle} onClick={() => adjustNudge(0.001)} disabled={!isActive}>+0.001</button>
                <button style={btnStyle} onClick={() => adjustNudge(0.01)} disabled={!isActive}>+0.01</button>
            </div>
        </div>
    );
    
};

export default NudgeControls;

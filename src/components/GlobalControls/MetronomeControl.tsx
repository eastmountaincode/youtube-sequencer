import React, { useState } from 'react';
import { audioEngine } from '../../services/audioEngine';

const MetronomeControl: React.FC = () => {
    const [metronomeEnabled, setMetronomeEnabled] = useState(false);
    const [metronomeVolume, setMetronomeVolume] = useState(30);
    const [metronomeDivision, setMetronomeDivision] = useState(24);

    const handleMetronomeToggle = () => {
        const newState = !metronomeEnabled;
        setMetronomeEnabled(newState);
        audioEngine.setMetronomeEnabled(newState);
    };

    const handleMetronomeVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        setMetronomeVolume(newVolume);
        audioEngine.setMetronomeVolume(newVolume / 100);
    };

    const handleDivisionChange = (division: number) => {
        setMetronomeDivision(division);
        audioEngine.setMetronomeDivision(division);
    };

    const btnStyle = (active: boolean): React.CSSProperties => ({
        background: active ? 'var(--accent)' : 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: active ? '#000' : 'var(--text-secondary)',
        padding: '2px 6px',
        fontSize: '9px',
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
    });

    return (
        <div className="d-flex align-items-center gap-2">
            <button
                onClick={handleMetronomeToggle}
                style={{ ...btnStyle(metronomeEnabled), minWidth: '36px' }}
            >
                MET
            </button>
            <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={metronomeVolume}
                onChange={handleMetronomeVolumeChange}
                style={{ width: '50px', height: '4px' }}
            />
            <div className="d-flex gap-1">
                <button style={btnStyle(metronomeDivision === 24)} onClick={() => handleDivisionChange(24)}>1/2</button>
                <button style={btnStyle(metronomeDivision === 12)} onClick={() => handleDivisionChange(12)}>1/4</button>
                <button style={btnStyle(metronomeDivision === 6)} onClick={() => handleDivisionChange(6)}>1/8</button>
            </div>
        </div>
    );
};

export default MetronomeControl;

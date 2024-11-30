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

    return (
        <div className="d-flex align-items-center gap-2 flex-column justify-content-center p-3">
            <button
                className={`btn btn-sm d-flex align-items-center justify-content-center ${metronomeEnabled ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={handleMetronomeToggle}
                style={{ width: '160px' }}
            >
                <i className="bi bi-alarm me-2"></i>
                {metronomeEnabled ? 'Metronome Is On' : 'Metronome Is Off'}
            </button>
            <div className="d-flex align-items-center gap-2" style={{ minWidth: '150px' }}>
                <i className="bi bi-volume-down"></i>
                <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={metronomeVolume}
                    onChange={handleMetronomeVolumeChange}
                />
                <i className="bi bi-volume-up"></i>
            </div>
            <div className="d-flex gap-2 mt-2">
                <button
                    className={`btn btn-sm ${metronomeDivision === 24 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleDivisionChange(24)}
                >
                    1/2
                </button>
                <button
                    className={`btn btn-sm ${metronomeDivision === 12 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleDivisionChange(12)}
                >
                    1/4
                </button>
                <button
                    className={`btn btn-sm ${metronomeDivision === 6 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleDivisionChange(6)}
                >
                    1/8
                </button>
            </div>
        </div>
    );
};

export default MetronomeControl;

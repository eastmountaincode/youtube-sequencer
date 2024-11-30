import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setBpm } from "../../store/persistentAudioSettingsSlice"
import { audioEngine } from '../../services/audioEngine';

const BpmControl: React.FC = () => {

    const dispatch = useDispatch();
    const bpm = useSelector((state: RootState) => state.persistentAudioSettings.bpm);
    const [tapTimes, setTapTimes] = useState<number[]>([]);
    const [lastTapTime, setLastTapTime] = useState(0);
    const [bpmInput, setBpmInput] = useState(bpm);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBpm = Number(e.target.value);
        audioEngine.setBpm(newBpm);
        dispatch(setBpm(newBpm));
        setBpmInput(newBpm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newBpm = Number(value);
        setBpmInput(newBpm);
        if (newBpm >= 30 && newBpm <= 300) {
            audioEngine.setBpm(newBpm);
            dispatch(setBpm(newBpm));
        }
    };

    const adjustBpm = (amount: number) => {
        const newBpm = Math.min(Math.max(bpm + amount, 30), 300);
        audioEngine.setBpm(newBpm);
        dispatch(setBpm(newBpm));
    };

    // Update input value when bpm changes in store
    useEffect(() => {
        setBpmInput(bpm);
    }, [bpm]);

    // Add this function to handle taps
    const handleTapTempo = useCallback(() => {
        const now = Date.now();
        const newTapTimes = [...tapTimes];

        // Clear old taps (older than 2 seconds)
        if (now - lastTapTime > 2000) {
            newTapTimes.length = 0;
        }

        newTapTimes.push(now);
        // Keep last 4 taps
        if (newTapTimes.length > 4) {
            newTapTimes.shift();
        }

        setTapTimes(newTapTimes);
        setLastTapTime(now);

        // Calculate BPM from intervals
        if (newTapTimes.length > 1) {
            const intervals = [];
            for (let i = 1; i < newTapTimes.length; i++) {
                intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
            }
            const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const newBpm = Math.round(60000 / averageInterval);

            if (newBpm >= 30 && newBpm <= 300) {
                audioEngine.setBpm(newBpm);
                dispatch(setBpm(newBpm));
            }
        }
    }, [tapTimes, lastTapTime]);

    return (
        <div className="bpm-control p-3">
            <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-3">
                    <div className='d-flex align-items-center' style={{ width: '100px' }}>
                        <i className="bi bi-heart-pulse-fill fs-4"><span className='ms-1' style={{userSelect: 'none'}}>BPM</span></i>
                    </div>

                    <div className="input-group" style={{ width: '180px' }}>

                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => adjustBpm(-1)}
                        >
                            <i className="bi bi-dash-circle"></i>
                        </button>
                        <input
                            type="number"
                            className="form-control text-center"
                            value={bpmInput}
                            onChange={handleInputChange}
                            onFocus={(e) => e.target.select()}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            min={30}
                            max={300}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => adjustBpm(1)}
                        >
                            <i className="bi bi-plus-circle"></i>
                        </button>

                    </div>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleTapTempo}
                        style={{ width: '73px' }}
                    >
                        <i className="bi bi-hand-index-thumb"></i> Tap
                    </button>
                </div>
                <input
                    type="range"
                    className="form-range"
                    value={bpm}
                    onChange={handleSliderChange}
                    min={30}
                    max={300}
                    step={1}
                />
            </div>
        </div>
    );
};

export default React.memo(BpmControl);


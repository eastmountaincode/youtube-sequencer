import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setBpm } from "../../store/persistentAudioSettingsSlice"
import { audioEngine } from '../../services/audioEngine';

const BpmControl: React.FC = () => {

    const dispatch = useDispatch();
    const bpm = useSelector((state: RootState) => state.persistentAudioSettings.bpm);
    const syncMode = useSelector((state: RootState) => state.midi.syncMode);
    const detectedBpm = useSelector((state: RootState) => state.midi.detectedBpm);
    const isFollowerMode = syncMode === 'follower';
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

    const btnStyle: React.CSSProperties = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        padding: '2px 6px',
        fontSize: '10px',
        cursor: 'pointer',
    };

    const displayBpm = isFollowerMode && detectedBpm ? detectedBpm : bpmInput;

    const disabledBtnStyle: React.CSSProperties = {
        ...btnStyle,
        opacity: 0.4,
        cursor: 'not-allowed',
    };

    return (
        <div className="bpm-control d-flex align-items-center gap-2">
            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>BPM</span>
            <button style={isFollowerMode ? disabledBtnStyle : btnStyle} onClick={() => adjustBpm(-1)} disabled={isFollowerMode}>-</button>
            <input
                type="number"
                className="form-control form-control-sm text-center"
                value={displayBpm}
                onChange={handleInputChange}
                onFocus={(e) => e.target.select()}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                min={30}
                max={300}
                disabled={isFollowerMode}
                style={{ width: '50px', fontSize: '10px', padding: '2px 4px', opacity: isFollowerMode ? 0.6 : 1 }}
            />
            <button style={isFollowerMode ? disabledBtnStyle : btnStyle} onClick={() => adjustBpm(1)} disabled={isFollowerMode}>+</button>
            <button style={isFollowerMode ? disabledBtnStyle : btnStyle} onClick={handleTapTempo} disabled={isFollowerMode}>TAP</button>
        </div>
    );
    
};

export default React.memo(BpmControl);


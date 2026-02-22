import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setSyncOffset } from '../../store/midiSlice';
import { audioEngine } from '../../services/audioEngine';
import { useMidi } from '../../hooks/useMidi';

const MidiSyncControl: React.FC = () => {
    const dispatch = useDispatch();
    const syncOffset = useSelector((state: RootState) => state.midi.syncOffset);
    const {
        isSupported,
        isInitialized,
        syncMode,
        availableInputs,
        availableOutputs,
        selectedInputId,
        selectedOutputId,
        detectedBpm,
        selectInput,
        selectOutput,
        setSyncMode,
        reinitAndRefresh,
    } = useMidi();

    const adjustOffset = (delta: number) => {
        const newOffset = syncOffset + delta;
        dispatch(setSyncOffset(newOffset));
        audioEngine.setTickOffset(newOffset);
    };

    if (!isSupported) return null;

    if (!isInitialized) {
        return (
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                MIDI N/A
            </span>
        );
    }

    const btnStyle = (active: boolean): React.CSSProperties => ({
        background: active ? 'var(--accent)' : 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: active ? '#000' : 'var(--text-secondary)',
        padding: '2px 6px',
        fontSize: '9px',
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
    });

    const selectStyle: React.CSSProperties = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontSize: '9px',
        padding: '2px 4px',
        maxWidth: '120px',
    };

    return (
        <div className="d-flex align-items-center gap-1">
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>MIDI</span>

            <button style={btnStyle(syncMode === 'internal')}
                    onClick={() => setSyncMode('internal')}>
                INT
            </button>
            <button style={btnStyle(syncMode === 'follower')}
                    onClick={() => setSyncMode('follower')}>
                EXT
            </button>
            <button style={btnStyle(syncMode === 'leader')}
                    onClick={() => setSyncMode('leader')}>
                SEND
            </button>

            {syncMode === 'follower' && (
                <select
                    style={selectStyle}
                    value={selectedInputId || ''}
                    onChange={(e) => selectInput(e.target.value || null)}
                >
                    <option value="">-- Input --</option>
                    {availableInputs.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            )}

            {syncMode === 'leader' && (
                <select
                    style={selectStyle}
                    value={selectedOutputId || ''}
                    onChange={(e) => selectOutput(e.target.value || null)}
                >
                    <option value="">-- Output --</option>
                    {availableOutputs.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            )}

            <button
                style={{
                    ...btnStyle(false),
                    padding: '2px 4px',
                    fontSize: '10px',
                }}
                onClick={reinitAndRefresh}
                title="Refresh MIDI devices"
            >
                {'\u21BB'}
            </button>

            {syncMode === 'follower' && (
                <>
                    {detectedBpm !== null && (
                        <span style={{ color: 'var(--accent)', fontSize: '9px', fontWeight: 600 }}>
                            ~{detectedBpm}
                        </span>
                    )}
                    <button style={btnStyle(false)} onClick={() => adjustOffset(-1)} title="Shift earlier">-</button>
                    <span style={{ color: syncOffset === 0 ? 'var(--text-muted)' : 'var(--accent)', fontSize: '9px', minWidth: '20px', textAlign: 'center' }}>
                        {syncOffset > 0 ? '+' : ''}{syncOffset}
                    </span>
                    <button style={btnStyle(false)} onClick={() => adjustOffset(1)} title="Shift later">+</button>
                </>
            )}
        </div>
    );
};

export default MidiSyncControl;

import React, { useEffect } from 'react';
import { PadCommand } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSpeedControlTarget, setPlaybackSpeed } from '../store/persistentAudioSettingsSlice';
import { playerRefs } from '../store/videoModuleSlice';
import { executeCommand } from '../utils/videoModuleCommands';

interface KeyInputAreaProps {
    onCommandSelect: (command: PadCommand) => void;
}

const numberToCommand: Record<number, PadCommand> = {
    0: PadCommand.ZERO,
    1: PadCommand.ONE,
    2: PadCommand.TWO,
    3: PadCommand.THREE,
    4: PadCommand.FOUR,
    5: PadCommand.FIVE,
    6: PadCommand.SIX,
    7: PadCommand.SEVEN,
    8: PadCommand.EIGHT,
    9: PadCommand.NINE
};

const speedKeyMap: Record<string, number> = {
    'z': 0.5,
    'x': 0.75,
    'c': 1,
    'v': 1.25,
    'b': 1.5,
    ',': 2
};

const KeyInputArea: React.FC<KeyInputAreaProps> = ({ onCommandSelect }) => {
    const dispatch = useDispatch();
    const isSaveModalOpen = useSelector((state: RootState) => state.modal.isSaveModalOpen);
    const focusedModuleId = useSelector((state: RootState) => state.videoModuleReadiness.focusedModuleId);
    const speedControlTarget = useSelector((state: RootState) => state.persistentAudioSettings.speedControlTarget);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (isSaveModalOpen) return;

            // Speed control keys (work regardless of focus mode)
            if (speedControlTarget && event.key in speedKeyMap) {
                const speed = speedKeyMap[event.key];
                dispatch(setPlaybackSpeed({ sequencerId: speedControlTarget, speed }));
                const player = playerRefs[speedControlTarget];
                if (player) {
                    executeCommand({
                        command: PadCommand.PLAYBACK_SPEED,
                        player,
                        dispatch,
                        speed
                    });
                }
                return;
            }

            // Don't edit pads when a video module is focused (keys control the video instead)
            if (focusedModuleId) return;

            switch (event.key) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    onCommandSelect(numberToCommand[parseInt(event.key)]);
                    break;
                case '[':
                    onCommandSelect(PadCommand.ARROW_LEFT);
                    break;
                case ']':
                    onCommandSelect(PadCommand.ARROW_RIGHT);
                    break;
                case 'p':
                    onCommandSelect(PadCommand.PLAY);
                    break;
                case 'o':
                    onCommandSelect(PadCommand.PAUSE);
                    break;
                case 'Backspace':
                    onCommandSelect(PadCommand.EMPTY);
                    break;
                case 'm':
                    onCommandSelect(PadCommand.PLAYER_MUTE);
                    break;
                case 'n':
                    onCommandSelect(PadCommand.PLAYER_UNMUTE);
                    break;

            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onCommandSelect, isSaveModalOpen, focusedModuleId, speedControlTarget, dispatch]);

    const handleSpeedTargetClick = (sequencerId: string) => {
        if (speedControlTarget === sequencerId) {
            dispatch(setSpeedControlTarget(null));
        } else {
            dispatch(setSpeedControlTarget(sequencerId));
        }
    };

    const buttonStyle: React.CSSProperties = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        padding: '4px 8px',
        fontSize: '10px',
        cursor: 'pointer',
    };

    const trackBtnStyle = (isActive: boolean): React.CSSProperties => ({
        background: isActive ? 'var(--accent)' : 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: isActive ? '#000' : 'var(--text-muted)',
        padding: '4px 6px',
        fontSize: '10px',
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        minWidth: '24px',
    });

    return (
        <div
            className="key-input-area p-2"
        >
            <div className="d-flex flex-wrap align-items-center gap-2 justify-content-center">
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>CMD</span>
                <button style={{ ...buttonStyle, color: 'var(--success)' }} onClick={() => onCommandSelect(PadCommand.PLAY)}>PLAY</button>
                <button style={{ ...buttonStyle, color: 'var(--accent)' }} onClick={() => onCommandSelect(PadCommand.PAUSE)}>PAUSE</button>
                <button style={buttonStyle} onClick={() => onCommandSelect(PadCommand.ARROW_LEFT)}>◀</button>
                <button style={buttonStyle} onClick={() => onCommandSelect(PadCommand.ARROW_RIGHT)}>▶</button>
                <button style={buttonStyle} onClick={() => onCommandSelect(PadCommand.EMPTY)}>CLR</button>
                <button style={{ ...buttonStyle, color: 'var(--danger)' }} onClick={() => onCommandSelect(PadCommand.PLAYER_MUTE)}>MUTE</button>
                <button style={buttonStyle} onClick={() => onCommandSelect(PadCommand.PLAYER_UNMUTE)}>UNMUTE</button>

                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 4px' }} />

                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>SPD</span>
                <button style={trackBtnStyle(speedControlTarget === 'seq1')} onClick={() => handleSpeedTargetClick('seq1')}>1</button>
                <button style={trackBtnStyle(speedControlTarget === 'seq2')} onClick={() => handleSpeedTargetClick('seq2')}>2</button>
                <button style={trackBtnStyle(speedControlTarget === 'seq3')} onClick={() => handleSpeedTargetClick('seq3')}>3</button>
                <button style={trackBtnStyle(speedControlTarget === 'seq4')} onClick={() => handleSpeedTargetClick('seq4')}>4</button>
            </div>
        </div>
    );

};

export default KeyInputArea;

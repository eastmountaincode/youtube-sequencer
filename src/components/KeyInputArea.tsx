import React, { useEffect } from 'react';
import { PadCommand } from '../types';

interface KeyInputAreaProps {
    onCommandSelect: (command: PadCommand) => void;
}

const numberToCommand: Record<number, PadCommand> = {
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

const KeyInputArea: React.FC<KeyInputAreaProps> = ({ onCommandSelect }) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch(event.key) {
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
                case 'u':
                    onCommandSelect(PadCommand.PLAYER_UNMUTE);
                    break;
    
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onCommandSelect]);
    
    return (
        <div className="key-input-area border border-success border-3 p-3">
            <h4>Key Input Area</h4>
            <div className="number-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, minmax(0, 60px))', // Cap max size at 60px
                gap: '10px',
                marginBottom: '10px'
            }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        className="btn btn-outline-primary"
                        style={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        onClick={() => onCommandSelect(numberToCommand[num])}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className="command-buttons d-flex gap-2">
                <button className="btn btn-outline-success" onClick={() => onCommandSelect(PadCommand.PLAY)}>Play</button>
                <button className="btn btn-outline-warning" onClick={() => onCommandSelect(PadCommand.PAUSE)}>Pause</button>
                <button className="btn btn-outline-info" onClick={() => onCommandSelect(PadCommand.ARROW_LEFT)}>←</button>
                <button className="btn btn-outline-info" onClick={() => onCommandSelect(PadCommand.ARROW_RIGHT)}>→</button>
                <button className="btn btn-outline-secondary" onClick={() => onCommandSelect(PadCommand.EMPTY)}>Empty</button>
                <button className="btn btn-outline-danger" onClick={() => onCommandSelect(PadCommand.PLAYER_MUTE)}>Mute</button>
                <button className="btn btn-outline-danger" onClick={() => onCommandSelect(PadCommand.PLAYER_UNMUTE)}>Unmute</button>
            </div>
        </div>
    );
};

export default KeyInputArea;

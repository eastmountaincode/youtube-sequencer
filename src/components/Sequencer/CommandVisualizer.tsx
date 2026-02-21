import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { PadCommand } from '../../types';
import { getIcon } from '../../utils/getIcon';

interface CommandVisualizerProps {
  sequencerId: string;
}

const getCommandLabel = (command: PadCommand): string => {
  switch (command) {
    case PadCommand.PLAY: return 'PLAY';
    case PadCommand.PAUSE: return 'PAUSE';
    case PadCommand.ARROW_LEFT: return 'SEEK -5s';
    case PadCommand.ARROW_RIGHT: return 'SEEK +5s';
    case PadCommand.ZERO: return 'JUMP 0%';
    case PadCommand.ONE: return 'JUMP 10%';
    case PadCommand.TWO: return 'JUMP 20%';
    case PadCommand.THREE: return 'JUMP 30%';
    case PadCommand.FOUR: return 'JUMP 40%';
    case PadCommand.FIVE: return 'JUMP 50%';
    case PadCommand.SIX: return 'JUMP 60%';
    case PadCommand.SEVEN: return 'JUMP 70%';
    case PadCommand.EIGHT: return 'JUMP 80%';
    case PadCommand.NINE: return 'JUMP 90%';
    case PadCommand.PLAYER_MUTE: return 'MUTE';
    case PadCommand.PLAYER_UNMUTE: return 'UNMUTE';
    case PadCommand.VOLUME: return 'VOLUME';
    case PadCommand.PLAYBACK_SPEED: return 'SPEED';
    default: return '';
  }
};

const CommandVisualizer: React.FC<CommandVisualizerProps> = ({ sequencerId }) => {
  const executedCommand = useSelector(
    (state: RootState) => state.audioEngine.lastExecutedCommands[sequencerId]
  );
  const [visible, setVisible] = useState(false);
  const [displayCommand, setDisplayCommand] = useState<PadCommand | null>(null);

  useEffect(() => {
    if (executedCommand && executedCommand.command !== PadCommand.EMPTY) {
      setDisplayCommand(executedCommand.command);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [executedCommand?.timestamp]);

  return (
    <div
      style={{
        height: '24px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: visible ? 1 : 0.3,
          transform: visible ? 'scale(1)' : 'scale(0.97)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          color: visible ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}
      >
        {displayCommand && (
          <>
            <span style={{ fontSize: '12px' }}>{getIcon(displayCommand)}</span>
            <span>{getCommandLabel(displayCommand)}</span>
          </>
        )}
        {!displayCommand && (
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>—</span>
        )}
      </div>
    </div>
  );
};

export default CommandVisualizer;

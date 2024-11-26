import React from 'react';
import { PadCommand } from '../../types';

interface PadProps {
  id: number;
  value: PadCommand;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const getIcon = (command: PadCommand) => {
  switch (command) {
    case PadCommand.PLAY:
      return <i className="bi bi-play-circle-fill"></i>;
    case PadCommand.PAUSE:
      return <i className="bi bi-pause-circle-fill"></i>;
    case PadCommand.ARROW_LEFT:
      return <i className="bi bi-arrow-left-square-fill"></i>;
    case PadCommand.ARROW_RIGHT:
      return <i className="bi bi-arrow-right-square-fill"></i>;
    case PadCommand.ONE:
      return <i className="bi bi-1-square-fill"></i>;
    case PadCommand.TWO:
      return <i className="bi bi-2-square-fill"></i>;
    case PadCommand.THREE:
      return <i className="bi bi-3-square-fill"></i>;
    case PadCommand.FOUR:
      return <i className="bi bi-4-square-fill"></i>;
    case PadCommand.FIVE:
      return <i className="bi bi-5-square-fill"></i>;
    case PadCommand.SIX:
      return <i className="bi bi-6-square-fill"></i>;
    case PadCommand.SEVEN:
      return <i className="bi bi-7-square-fill"></i>;
    case PadCommand.EIGHT:
      return <i className="bi bi-8-square-fill"></i>;
    case PadCommand.NINE:
      return <i className="bi bi-9-square-fill"></i>;
    case PadCommand.PLAYER_MUTE:
      return <i className="bi bi-volume-mute-fill"></i>;
    case PadCommand.PLAYER_UNMUTE:
      return <i className="bi bi-volume-up-fill"></i>;
    default:
      return null;
  }
};

const Pad: React.FC<PadProps> = ({ id, value, isActive, isSelected, onClick }) => {

  return (
    <div
      className={`pad ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        backgroundColor: isActive ? '#007bff' : '#e9ecef',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        // transition: 'all 0.1s ease-in-out',
        position: 'relative',
        border: isSelected ? '4px solid #ff9800' : 'none'
      }}
    >
      {value !== PadCommand.EMPTY && getIcon(value)}
      <span style={{
        position: 'absolute',
        bottom: '2px',
        right: '4px',
        fontSize: '0.7rem',
        opacity: 0.7,
        userSelect: 'none'
      }}>
        {id + 1}
      </span>
    </div>
  );
};



export default Pad;

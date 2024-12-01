import React from 'react';
import { PadCommand } from '../../types';
import { getIcon } from '../../utils/misc';

interface PadProps {
  id: number;
  value: PadCommand;
  isActive: boolean;
  isSelected: boolean;
  nudgeValue: number;
  onClick: () => void;
}

const Pad: React.FC<PadProps> = ({ id, value, isActive, isSelected, nudgeValue, onClick }) => {

  return (
    <div
      className={`pad ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        backgroundColor: isActive ? '#007bff' : '#e9ecef',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        position: 'relative',
        border: 'none',
        outline: isSelected ? '4px solid #ff9800' : 'none',
        transition: 'background-color 0.3s ease',

      }}
    >
      {/* Command icon */}
      <div className="text-dark" style={{marginBottom: '3px'}}>
        {value !== PadCommand.EMPTY && getIcon(value)}
      </div>
      {/* id number */}
      <span className="text-dark" style={{
        position: 'absolute',
        bottom: '6px',
        right: '4px',
        fontSize: '0.7rem',
        opacity: 0.7,
        userSelect: 'none'
      }}>
        {id + 1}
      </span>
      {/* Background track */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '5px',
        backgroundColor: 'lightgrey',

      }} />

      {/* Nudge value bar */}
      {nudgeValue !== 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(${nudgeValue < 0 ? '-100%' : '0%'})`,
          width: `${Math.min(Math.abs(nudgeValue * 50), 50)}%`,

          height: '5px',
          backgroundColor: '#007bff',
        }} />
      )}
    </div>
  );
};

export default Pad;

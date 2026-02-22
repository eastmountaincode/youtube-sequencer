import React from 'react';
import { PadCommand } from '../../types';
import { getIcon } from '../../utils/getIcon';

interface PadProps {
  id: number;
  value: PadCommand;
  isActive: boolean;
  isSelected: boolean;
  nudgeValue: number;
  onClick: () => void;
}

const Pad: React.FC<PadProps> = ({ id, value, isActive, isSelected, nudgeValue, onClick }) => {
  const hasCommand = value !== PadCommand.EMPTY;

  return (
    <div
      className={`pad ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        background: isActive
          ? 'linear-gradient(180deg, #33d1f0 0%, var(--accent) 50%, var(--accent-dim) 100%)'
          : hasCommand
            ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)'
            : 'rgba(255, 255, 255, 0.04)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.15s ease',
        boxShadow: isActive
          ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 12px var(--accent-glow)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Command icon */}
      <div style={{
        fontSize: '0.75rem',
        color: isActive ? '#fff' : 'var(--text-primary)',
        fontWeight: 600
      }}>
        {hasCommand && getIcon(value)}
      </div>
      {/* id number */}
      <span style={{
        position: 'absolute',
        top: '1px',
        left: '2px',
        fontSize: '8px',
        color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
        userSelect: 'none',
        lineHeight: 1
      }}>
        {id + 1}
      </span>
      {/* Nudge indicator */}
      {nudgeValue !== 0 && (
        <div style={{
          position: 'absolute',
          bottom: '1px',
          left: '50%',
          transform: `translateX(${nudgeValue < 0 ? '-100%' : '0%'})`,
          width: `${Math.min(Math.abs(nudgeValue * 50), 50)}%`,
          height: '2px',
          backgroundColor: 'var(--accent)',
        }} />
      )}
    </div>
  );
};

export default Pad;

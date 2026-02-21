import React from 'react';
import { useDispatch } from 'react-redux';
import VideoModule from './VideoModule/VideoModule';
import SequencerPadView from './SequencerPadView/SequencerPadView';
import CommandVisualizer from './CommandVisualizer';
import { setSelectedPad } from '../../store/sequencerSlice';

const Sequencer: React.FC<{ sequencerId: string }> = ({ sequencerId }) => {
  const dispatch = useDispatch();

  const handlePadSelect = (padId: number) => {
    dispatch(setSelectedPad({ sequencerId, padId }));
  };

  const sequencerNumber = sequencerId.replace('seq', '');

  return (
    <div
      className="sequencer p-2"
      style={{
        width: '340px',
        minWidth: '300px',
        maxWidth: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.2)',
      }}
    >
      <div className="d-flex align-items-center mb-1" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '10px', letterSpacing: '1px' }}>SEQ {sequencerNumber}</span>
      </div>
      <div className="p-1">
        <CommandVisualizer sequencerId={sequencerId} />
      </div>
      <VideoModule videoModuleId={sequencerId} />
      <SequencerPadView
        sequencerId={sequencerId}
        onPadSelect={handlePadSelect}
      />
    </div>
  );
};

export default Sequencer;

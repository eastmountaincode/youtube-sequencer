import React from 'react';
import { useDispatch } from 'react-redux';
import VideoModule from './VideoModule/VideoModule';
import SequencerPadView from './SequencerPadView/SequencerPadView';
import { setSelectedPad } from '../../store/sequencerSlice';

const Sequencer: React.FC<{ sequencerId: string }> = ({ sequencerId }) => {
  const dispatch = useDispatch();

  const handlePadSelect = (padId: number) => {
    dispatch(setSelectedPad({ sequencerId, padId }));
  };

  return (
    <div className="sequencer border border-primary border-3 p-3 bg-primary-subtle">
      <h2>Sequencer</h2>
      {/* <p>Sequencer ID: {sequencerId}</p> */}
      <div className='mb-3'>
        <VideoModule
          videoModuleId={sequencerId}
        />
      </div>
      <SequencerPadView
        sequencerId={sequencerId}
        onPadSelect={handlePadSelect}
      />
    </div>
  );
};

export default Sequencer;

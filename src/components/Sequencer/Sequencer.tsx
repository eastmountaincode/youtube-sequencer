import React from 'react';
import { useDispatch } from 'react-redux';
import VideoModule from './VideoModule/VideoModule';
import SequencerPadView from './SequencerPadView';
import { setSelectedPad } from '../../store/sequencerSlice';

const Sequencer: React.FC<{ sequencerId: string }> = ({ sequencerId }) => {
  const dispatch = useDispatch();

  const handlePadSelect = (padId: number) => {
    dispatch(setSelectedPad({ sequencerId, padId }));
  };

  return (
    <div className="sequencer border border-primary border-3 p-3">
      <h2>Sequencer</h2>
      {/* <p>Sequencer ID: {sequencerId}</p> */}
      <VideoModule 
        videoModuleId={sequencerId}
         />
      <SequencerPadView 
        sequencerId={sequencerId}
        onPadSelect={handlePadSelect} 
      />
    </div>
  );
};

export default Sequencer;

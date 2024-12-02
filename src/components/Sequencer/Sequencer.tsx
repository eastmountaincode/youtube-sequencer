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

  const sequencerNumber = sequencerId.replace('seq', '');

  return (
    <div className="sequencer border border-1 p-3 overflow-hidden bg-primary bg-opacity-10" style={{ width: '550px', maxWidth: '100%' }}>


      <h4>Sequencer {sequencerNumber}</h4>
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

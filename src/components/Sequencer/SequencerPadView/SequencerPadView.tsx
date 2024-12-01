import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Pad from '../Pad';
import SequencerControls from './SequencerControls/SequencerControls';

interface SequencerPadViewProps {
  sequencerId: string;
  onPadSelect: (padId: number) => void;
}

const SequencerPadView: React.FC<SequencerPadViewProps> = ({
  sequencerId,
  onPadSelect,
}) => {
  const currentStep = useSelector((state: RootState) => state.audioEngine.currentStep);
  const padCommands = useSelector((state: RootState) =>
    state.sequencer.sequencers[sequencerId as keyof typeof state.sequencer.sequencers].padCommands
  );
  const padNudgeValues = useSelector((state: RootState) =>
    state.sequencer.sequencers[sequencerId as keyof typeof state.sequencer.sequencers].nudgeValues
  );
  // get selected pad id from redux store
  const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
  const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);

  const numPads = 32;

  // Change selected pad with keyboard (if one is selected)
  // e.preventDefault() prevents scrolling when arrow keys are pressed
  const rowLength = 8;
  const height = 4;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedSequencerId !== sequencerId || selectedPadId === null) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (selectedPadId % rowLength !== 0) {
            onPadSelect(selectedPadId - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if ((selectedPadId + 1) % rowLength !== 0) {
            onPadSelect(selectedPadId + 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (selectedPadId >= rowLength) {
            onPadSelect(selectedPadId - rowLength);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (selectedPadId < rowLength * (height - 1)) {
            onPadSelect(selectedPadId + rowLength);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPadId, selectedSequencerId, sequencerId, onPadSelect]);

  const pads = Array(numPads).fill(null).map((_, index) => ({
    id: index,
    value: padCommands[index],
    isActive: currentStep === index,
    isSelected: selectedPadId === index && selectedSequencerId === sequencerId,
    nudgeValue: padNudgeValues[index]
  }));

  return (
    <div className="sequencer-pad-view ms-3 me-3"> 
      <div className="pad-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '10px'
      }}>
        {pads.map((pad) => (
          <Pad
            key={pad.id}
            id={pad.id}
            value={pad.value}
            isActive={pad.isActive}
            isSelected={pad.isSelected}
            nudgeValue={pad.nudgeValue}
            onClick={() => onPadSelect(pad.id)}
          />
        ))}
      </div>
      <SequencerControls
        sequencerId={sequencerId}
        padNudgeValues={padNudgeValues}
      />

    </div>
  );
};

export default SequencerPadView;



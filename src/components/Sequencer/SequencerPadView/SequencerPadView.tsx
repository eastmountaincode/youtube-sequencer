import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Pad from '../Pad';
import SequencerControls from './SequencerControls/SequencerControls';
import CommandBankControl from './CommandBankControl';

interface SequencerPadViewProps {
  sequencerId: string;
  onPadSelect: (padId: number) => void;
}

const SequencerPadView: React.FC<SequencerPadViewProps> = ({
  sequencerId,
  onPadSelect,
}) => {
  const currentStep = useSelector((state: RootState) => state.audioEngine.currentStep);
  const sequencer = useSelector((state: RootState) => 
    state.sequencer.sequencers[sequencerId]
  );
  
  const activeBank = sequencer.activeBank;
  const padCommands = sequencer.padCommands[activeBank];
  const padNudgeValues = sequencer.nudgeValues[activeBank];
  // const padCommands = useSelector((state: RootState) =>
  //   state.sequencer.sequencers[sequencerId as keyof typeof state.sequencer.sequencers].padCommands
  // );
  // const padNudgeValues = useSelector((state: RootState) =>
  //   state.sequencer.sequencers[sequencerId as keyof typeof state.sequencer.sequencers].nudgeValues
  // );

  // get selected pad id from redux store
  const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
  const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);
  const focusedModuleId = useSelector((state: RootState) => state.videoModuleReadiness.focusedModuleId);

  const numPads = 32;

  // Change selected pad with keyboard (if one is selected)
  // e.preventDefault() prevents scrolling when arrow keys are pressed
  const rowLength = 8;
  const height = 4;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle arrow keys if a video module is focused (they're used for seeking)
      if (focusedModuleId) return;
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
  }, [selectedPadId, selectedSequencerId, sequencerId, onPadSelect, focusedModuleId]);

  const pads = Array(numPads).fill(null).map((_, index) => ({
    id: index,
    value: padCommands[index],
    isActive: currentStep === index,
    isSelected: selectedPadId === index && selectedSequencerId === sequencerId,
    nudgeValue: padNudgeValues[index]
  }));

  return (
    <div className="sequencer-pad-view">
      {/* COMMAND BANK HERE */}
      <div>
        <CommandBankControl sequencerId={sequencerId} />
      </div>
      <div className="pad-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '4px'
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



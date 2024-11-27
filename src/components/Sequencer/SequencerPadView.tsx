import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Pad from './Pad';
import { clearAllPads } from '../../store/sequencerSlice';

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
  // get selected pad id from redux store
  const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
  const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);

  const numPads = 32;

  const dispatch = useDispatch();


  const handleClearAll = () => {
    dispatch(clearAllPads({ sequencerId }));
  };

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
    isSelected: selectedPadId === index && selectedSequencerId === sequencerId
  }));

  return (
    <div className="sequencer-pad-view border border-primary border-3 p-3">
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
            onClick={() => onPadSelect(pad.id)}
          />
        ))}
      </div>
      <div className="d-flex justify-content-end mt-3">
    <button
        className="btn btn-outline-secondary btn-sm"
        onClick={handleClearAll}
    >
        <i className="bi bi-trash me-1"></i>
        Clear All Pads
    </button>
</div>
    </div>
  );
};

export default SequencerPadView;



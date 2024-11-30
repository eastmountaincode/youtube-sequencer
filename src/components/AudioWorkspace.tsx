import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import GlobalControls from "./GlobalControls/GlobalControls";
import Sequencer from "./Sequencer/Sequencer";
import KeyInputArea from "./KeyInputArea";
import { PadCommand } from "../types";
import { updatePadCommand } from "../store/sequencerSlice";
import { useAudioEngine } from "../hooks/useAudioEngine";

const AudioWorkspace: React.FC = () => {
  const sequencers = useSelector((state: RootState) => state.sequencer.sequencers);
  const sequencerIds = Object.keys(sequencers);
  useAudioEngine({ sequencerIds });

  const dispatch = useDispatch();
  const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);
  const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
  
  const handleCommandSelect = (command: PadCommand) => {
    if (selectedSequencerId !== null && selectedPadId !== null) {
      dispatch(updatePadCommand({
        sequencerId: selectedSequencerId,
        padId: selectedPadId,
        command
      }));
    }
  };

  return (
    <div className="audio-workspace border border-dark border-3 p-3">
      {/* <h1>Audio Workspace</h1> */}
      <GlobalControls />
      <div className="sequencers mt-3" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        {sequencerIds.map(sequencerId => (
          <Sequencer key={sequencerId} sequencerId={sequencerId} />
        ))}
      </div>
      <KeyInputArea onCommandSelect={handleCommandSelect} />

    </div>
  );
}

export default AudioWorkspace;
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import GlobalControls from "./GlobalControls/GlobalControls";
import Sequencer from "./Sequencer/Sequencer";
import KeyInputArea from "./KeyInputArea";
import { PadCommand } from "../types";
import { updatePadCommand } from "../store/sequencerSlice";
import { useAudioEngine } from "../hooks/useAudioEngine";
import './AudioWorkspace.css'

const AudioWorkspace: React.FC = () => {
  const sequencers = useSelector((state: RootState) => state.sequencer.sequencers);
  const sequencerIds = Object.keys(sequencers);
  useAudioEngine({ sequencerIds });

  const dispatch = useDispatch();
  const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);
  const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);

  const handleCommandSelect = (command: PadCommand) => {

    // Handle regular pad commands
    if (selectedSequencerId !== null && selectedPadId !== null) {
      dispatch(updatePadCommand({
        sequencerId: selectedSequencerId,
        padId: selectedPadId,
        command
      }));
    }
  };

  return (
    <div className="audio-workspace border border-dark border-3 p-4">
      <GlobalControls />
      <KeyInputArea onCommandSelect={handleCommandSelect} />
      <div className="sequencers mt-3 sequencers-grid d-flex flex-wrap justify-content-center gap-3" style={{ maxWidth: '1700px', margin: '0 auto' }}>

        {sequencerIds.map(sequencerId => (
          <Sequencer key={sequencerId} sequencerId={sequencerId} />
        ))}
      </div>

    </div>
  );
}

export default AudioWorkspace;
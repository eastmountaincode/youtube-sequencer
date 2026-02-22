import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import GlobalControls from "./GlobalControls/GlobalControls";
import Sequencer from "./Sequencer/Sequencer";
import KeyInputArea from "./KeyInputArea";
import { PadCommand } from "../types";
import { updatePadCommand } from "../store/sequencerSlice";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { useMidi } from "../hooks/useMidi";
import './AudioWorkspace.css'

const AudioWorkspace: React.FC = () => {
  const sequencers = useSelector((state: RootState) => state.sequencer.sequencers);
  const sequencerIds = Object.keys(sequencers);
  useAudioEngine({ sequencerIds });
  useMidi();

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
    <div className="audio-workspace">
      <div className="controls-panel">
        <GlobalControls />
        <KeyInputArea onCommandSelect={handleCommandSelect} />
      </div>
      <div className="sequencers p-2 d-flex flex-wrap justify-content-center gap-2">
        {sequencerIds.map(sequencerId => (
          <Sequencer key={sequencerId} sequencerId={sequencerId} />
        ))}
      </div>
    </div>
  );
}

export default AudioWorkspace;
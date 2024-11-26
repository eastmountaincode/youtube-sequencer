import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { audioEngine } from '../services/audioEngine';
import { setCurrentStep, setCurrentTick } from '../store/audioEngineSlice';
import { PadCommand } from '../types';
import { executeCommand } from '../utils/videoModuleCommands';
import { playerRefs } from '../store/videoModuleSlice';


interface UseAudioEngineProps {
  sequencerIds: string[];
}

// Create a singleton tick counter outside any component
let globalTick = 0;

// custom hook to connect the AudioEngine services to the audio hook's associated sequencer
export const useAudioEngine = ({ sequencerIds }: UseAudioEngineProps) => {
  const dispatch = useDispatch();

  const { isPlaying } = useSelector((state: RootState) => state.audioEngine);
  const { bpm } = useSelector((state: RootState) => state.persistentAudioSettings);
  const sequencers = useSelector((state: RootState) => state.sequencer.sequencers);
  const sequencersRef = useRef(sequencers);

  const numPads = 32;

  useEffect(() => {
    sequencersRef.current = sequencers;
  }, [sequencers]);


  useEffect(() => {
    if (isPlaying) {
      // Single initial dispatch for step 0
      dispatch(setCurrentStep(0));
      dispatch(setCurrentTick(0));

      audioEngine.start(bpm, () => {
        // Dispatch and set up BEFORE incrementing tick
        dispatch(setCurrentTick(globalTick));
        if (globalTick % 6 === 0) {
          const step = Math.floor(globalTick / 6) % numPads;
          dispatch(setCurrentStep(step));

          sequencerIds.forEach(sequencerId => {
            const player = playerRefs[sequencerId];
            if (player) {
              const currentStepCommand = sequencersRef.current[sequencerId as keyof typeof sequencersRef.current].padCommands[step];
              if (currentStepCommand !== PadCommand.EMPTY) {
                executeCommand(currentStepCommand, player, sequencerId, dispatch);
              }
            }
          });
        }
        globalTick++;
        if (globalTick >= (6 * numPads)) globalTick = 0;
      });
    } else {
      audioEngine.stop();
      globalTick = 0;
    }

    return () => audioEngine.stop();
  }, [isPlaying, dispatch]);

  // Separate effect for BPM changes
  useEffect(() => {
    audioEngine.setBpm(bpm);
  }, [bpm]);


};

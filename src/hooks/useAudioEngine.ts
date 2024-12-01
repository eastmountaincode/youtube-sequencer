import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { audioEngine } from '../services/audioEngine';
import { playerRefs } from '../store/videoModuleSlice';


interface UseAudioEngineProps {
  sequencerIds: string[];
}
// custom hook to connect the AudioEngine services to the audio hook's associated sequencer
export const useAudioEngine = ({ sequencerIds }: UseAudioEngineProps) => {
  const dispatch = useDispatch();

  const { isPlaying } = useSelector((state: RootState) => state.audioEngine);
  const sequencers = useSelector((state: RootState) => state.sequencer.sequencers);
  const bpm = useSelector((state: RootState) => state.persistentAudioSettings.bpm);

  // Keep AudioEngine's sequencers in sync with Redux store
  useEffect(() => {
    audioEngine.updateSequencers(sequencers);
  }, [sequencers]);

  useEffect(() => {
    if (isPlaying) {
      // Configure first, then start
      audioEngine.configure({
        dispatch,
        sequencers,
        playerRefs,
        initialBpm: bpm
      });
      audioEngine.start();
    } else {
      audioEngine.stop();
    }

    return () => audioEngine.stop();
  }, [isPlaying, dispatch]);

};

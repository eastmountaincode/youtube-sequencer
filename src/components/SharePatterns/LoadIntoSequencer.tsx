import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as patternService from '../../services/patternService';
import { validateFile } from '../../utils/validateFile';
import { audioEngine } from '../../services/audioEngine';
import { useNavigate } from 'react-router-dom';
import { migrateFileData } from '../../utils/fileMigration';

interface LoadIntoSequencerProps {
  storageKey: string;
}

const LoadIntoSequencer = ({ storageKey }: LoadIntoSequencerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      const { url } = await patternService.getDownloadUrl(storageKey);

      const response = await fetch(url);
      const text = await response.text();
      const loadedState = JSON.parse(text);

      // Add migration step here
      const migratedState = migrateFileData(loadedState);

      if (!validateFile(migratedState)) {
          throw new Error('Invalid file format');
      }

      dispatch({ type: 'videoModuleReadiness/resetAllReadinessStates' });
      dispatch({ type: 'videoModule/setState', payload: migratedState.videoModule });
      dispatch({ type: 'sequencer/setState', payload: migratedState.sequencer });
      dispatch({ type: 'persistentAudioSettings/setState', payload: migratedState.persistentAudioSettings });

      audioEngine.setBpm(migratedState.persistentAudioSettings.bpm);

      // After successful load, navigate to sequencer
      navigate('/');

    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn btn-outline-primary btn-sm w-100 p-2"
      onClick={handleLoad}
      disabled={isLoading}
      style={{
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: '0',
      }}
    >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm me-2" />
      ) : (
        <i className="bi bi-music-note-list me-2" />
      )}
      Load Into Sequencer
    </button>
  );
};

export default LoadIntoSequencer;

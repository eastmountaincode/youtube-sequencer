import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GET_DOWNLOAD_URL } from '../../graphql/mutations';
import { validateFile } from '../../utils/validateFile';
import { audioEngine } from '../../services/audioEngine';
import { useNavigate } from 'react-router-dom';

interface LoadIntoSequencerProps {
  s3_url: string;
}

const LoadIntoSequencer = ({ s3_url }: LoadIntoSequencerProps) => {
  const [getDownloadUrl] = useMutation(GET_DOWNLOAD_URL);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      const { data } = await getDownloadUrl({
        variables: { s3_url }
      });
      
      const response = await fetch(data.getDownloadUrl.url);
      const text = await response.text();
      const loadedState = JSON.parse(text);

      if (!validateFile(loadedState)) {
        throw new Error('Invalid file format');
      }

      dispatch({ type: 'videoModuleReadiness/resetAllReadinessStates' });
      dispatch({ type: 'videoModule/setState', payload: loadedState.videoModule });
      dispatch({ type: 'sequencer/setState', payload: loadedState.sequencer });
      dispatch({ type: 'persistentAudioSettings/setState', payload: loadedState.persistentAudioSettings });

      audioEngine.setBpm(loadedState.persistentAudioSettings.bpm);

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
      className="btn btn-outline-primary btn-sm rounded-0 w-100 p-2"
      onClick={handleLoad}
      disabled={isLoading}
      style={{ 
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none'
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

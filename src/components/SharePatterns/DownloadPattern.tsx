import React, { useState } from 'react';
import * as patternService from '../../services/patternService';
import './DownloadPattern.css';

interface DownloadPatternProps {
  storageKey: string;
}

const DownloadPattern = ({ storageKey }: DownloadPatternProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { url } = await patternService.getDownloadUrl(storageKey);
      console.log('Download URL:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
    className="btn btn-outline-primary btn-sm btn-rounded-bottom-left w-100 p-2"
    onClick={handleDownload}
    disabled={isDownloading}
    style={{
      borderLeft: 'none',
      borderBottom: 'none',
      borderRadius: '0',
    }}
    >
      {isDownloading ? (
        <span className="spinner-border spinner-border-sm me-2" />
      ) : (
        <i className="bi bi-download me-2" />
      )}
      Download
    </button>
  );
};

export default DownloadPattern;

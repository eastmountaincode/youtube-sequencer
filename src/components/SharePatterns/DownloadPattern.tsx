import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { GET_DOWNLOAD_URL } from '../../graphql/mutations';

interface DownloadPatternProps {
  s3_url: string;
}

const DownloadPattern = ({ s3_url }: DownloadPatternProps) => {
  const [getDownloadUrl] = useMutation(GET_DOWNLOAD_URL);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data } = await getDownloadUrl({
        variables: { s3_url }
      });

      console.log('Download URL:', data.getDownloadUrl.url);
      
      window.location.href = data.getDownloadUrl.url;
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      className="btn btn-primary btn-sm"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : (
        <i className="bi bi-download me-1" />
      )}
      Download
    </button>
  );
};

export default DownloadPattern;
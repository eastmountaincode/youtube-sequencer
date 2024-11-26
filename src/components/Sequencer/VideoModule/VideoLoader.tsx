import React from 'react';

interface VideoLoaderProps {
    videoUrl: string;
    onUrlChange: (url: string) => void;
    onLoadInVideo: () => void;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ 
    videoUrl, 
    onUrlChange, 
    onLoadInVideo 
}) => {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => onUrlChange(e.target.value)}
            />
            <button
                className="btn btn-primary"
                type="button"
                onClick={onLoadInVideo}
            >
                Load Video
                <i className="bi bi-floppy ms-2"></i>
            </button>
        </div>
    );
};

export default VideoLoader;

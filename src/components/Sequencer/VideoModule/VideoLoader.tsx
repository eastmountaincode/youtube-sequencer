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
        <div className="d-flex gap-1 mb-1">
            <input
                type="text"
                className="form-control form-control-sm"
                placeholder="PASTE URL"
                value={videoUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                style={{ fontSize: '10px', padding: '4px 8px' }}
            />
            {videoUrl && (
                <button
                    type="button"
                    onClick={() => onUrlChange("")}
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        padding: '0 6px',
                        cursor: 'pointer',
                        fontSize: '10px'
                    }}
                >
                    ✕
                </button>
            )}
            <button
                type="button"
                onClick={onLoadInVideo}
                style={{
                    background: 'var(--accent)',
                    border: 'none',
                    color: '#000',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 600
                }}
            >
                LOAD
            </button>
        </div>
    );
};

export default VideoLoader;

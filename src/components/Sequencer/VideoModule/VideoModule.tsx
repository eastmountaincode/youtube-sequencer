import React from "react";
import VideoLoader from "./VideoLoader";
import VideoDisplay from "./VideoDisplay";
import { useVideoModule } from "../../../hooks/useVideoModule"; // We'll create this hook for logic

const VideoModule: React.FC<{ videoModuleId: string }> = ({ videoModuleId }) => {
    const { 
        videoUrl,
        setVideoUrl,
        videoId,
        handleLoadInVideo,
        handleClear,
        handlePlayerReady
    } = useVideoModule(videoModuleId);

    return (
        <div className="video-module border border-danger border-3 p-3">
            <h3>Video Module</h3>  
            <VideoLoader 
                videoUrl={videoUrl}
                onUrlChange={setVideoUrl}
                onLoadInVideo={handleLoadInVideo}
            />
            
            <VideoDisplay 
                videoId={videoId}
                videoModuleId={videoModuleId}
                onPlayerReady={handlePlayerReady}
                onClear={handleClear}
            />
        </div>
    );
};

export default VideoModule;
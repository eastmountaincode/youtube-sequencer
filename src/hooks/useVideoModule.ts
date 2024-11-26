import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setModuleReady, playerRefs, setModuleVideoUrl, setModuleVideoId } from '../store/videoModuleSlice';
import { RootState } from "../store/store";
import { executeCommand } from "../utils/videoModuleCommands";
import { PadCommand } from "../types";

export const useVideoModule = (videoModuleId: string) => {
    const dispatch = useDispatch();
    // get videoUrl, and videoId from the store, which functions as the MODEL
    // we want to save these to recreate state if we load in a file
    const videoUrl = useSelector((state: RootState) => 
        state.videoModule.modules[videoModuleId]?.videoUrl
      );
    const videoId = useSelector((state: RootState) =>
        state.videoModule.modules[videoModuleId]?.videoId
    );

    // these are more temporary states that we don't need to persist across sessions
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            delete playerRefs[videoModuleId];
        };
    }, [videoModuleId]);

    const setVideoUrl = (url: string) => {
        dispatch(setModuleVideoUrl({ videoModuleId, videoUrl: url }));
    };

    const setVideoId = (id: string) => {
        dispatch(setModuleVideoId({ videoModuleId, videoId: id }));
    };

    const handleMuteToggle = (player: YT.Player) => {
        if (isMuted) {
            executeCommand(PadCommand.PLAYER_UNMUTE, player, videoModuleId, dispatch);

        } else {
            executeCommand(PadCommand.PLAYER_MUTE, player, videoModuleId, dispatch);

        }
        setIsMuted(!isMuted);
    };

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const handleClear = () => {
        setVideoUrl("");
        setVideoId("");
        delete playerRefs[videoModuleId];
        dispatch(setModuleReady({ videoModuleId, isReady: false }));
    };

    const handleLoadInVideo = () => {
        const id = extractVideoId(videoUrl);
        if (id) {
            setIsLoading(true);
            setVideoId(id);
        }
    };

    const handlePlayerReady = (player: YT.Player) => {
        setIsLoading(false);
        playerRefs[videoModuleId] = player;
        dispatch(setModuleReady({ videoModuleId, isReady: true }));

    };

    return {
        videoUrl,
        setVideoUrl,
        videoId,
        isLoading,
        handleLoadInVideo,
        handleClear,
        handlePlayerReady,
        isMuted,
        handleMuteToggle,
    };
};

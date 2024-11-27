import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setModuleVideoUrl, setModuleVideoId, setModuleReady } from '../store/videoModuleSlice';
import { RootState } from "../store/store";
import { executeCommand } from "../utils/videoModuleCommands";
import { PadCommand } from "../types";
import { playerRefs } from "../store/videoModuleSlice";

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

    const [playerIsReady, setPlayerIsReady] = useState(false);

    // temporary states that we don't need to persist across sessions
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
        setPlayerIsReady(false);
        dispatch(setModuleReady({ videoModuleId, isReady: false }));
    };

    const handleLoadInVideo = () => {
        const id = extractVideoId(videoUrl);
        if (id) {
            setVideoId(id);
        }
    };

    const handlePlayerReady = (player: YT.Player) => {
        // register player with the refs list stored in slice
        playerRefs[videoModuleId] = player;
        // set local playerIsReady state stored here in the hook because VideoDisplay needs it
        setPlayerIsReady(true);
        dispatch(setModuleReady({ videoModuleId, isReady: true }));

    };

    return {
        videoUrl,
        setVideoUrl,
        videoId,
        handleLoadInVideo,
        handleClear,
        handlePlayerReady,
        isMuted,
        handleMuteToggle,
        playerIsReady,
        setPlayerIsReady
    };
};

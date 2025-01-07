import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setModuleVideoUrl, setModuleVideoId } from '../store/videoModuleSlice';
import { RootState } from "../store/store";
import { executeCommand } from "../utils/videoModuleCommands";
import { PadCommand } from "../types";
import { playerRefs } from "../store/videoModuleSlice";
import { setModulePlayerReady, setModuleLoadButtonPressed } from "../store/videoModuleReadinessSlice";
import { setModuleMute } from "../store/persistentAudioSettingsSlice";

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

    const isMuted = useSelector((state: RootState) =>
        state.persistentAudioSettings.mutedModules[videoModuleId] ?? false
    );

    const setVideoUrl = (url: string) => {
        dispatch(setModuleVideoUrl({ videoModuleId, videoUrl: url }));
    };

    const setVideoId = (id: string) => {
        dispatch(setModuleVideoId({ videoModuleId, videoId: id }));
    };

    const handleMuteToggle = (player: YT.Player) => {
        const newMutedState = !isMuted;
        dispatch(setModuleMute({ sequencerId: videoModuleId, isMuted: newMutedState }));

        if (isMuted) {
            console.log('Attempting to unmute');
            executeCommand({
                player: player,
                command: PadCommand.PLAYER_UNMUTE,
                dispatch: dispatch,
            })
        } else {
            console.log('Attempting to mute');
            executeCommand({
                player,
                command: PadCommand.PLAYER_MUTE,
                dispatch: dispatch,
            })
        }
    };

    useEffect(() => {
        return () => {
            delete playerRefs[videoModuleId];
        };
    }, [videoModuleId]);


    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const handleClear = async () => {
        console.log('handleClear called');
        //setLoadButtonPressed(false);
        setVideoId("");
        delete playerRefs[videoModuleId];
        dispatch(setModulePlayerReady({ videoModuleId, isReady: false }));
        dispatch(setModuleLoadButtonPressed({ videoModuleId, isPressed: false }));
        return Promise.resolve();
    };

    const handleLoadInVideo = async () => {
        const id = extractVideoId(videoUrl);
        if (id) {
            await handleClear();  // Wait for clear to complete
            setVideoId(id);
            dispatch(setModulePlayerReady({ videoModuleId, isReady: true }));
            dispatch(setModuleLoadButtonPressed({ videoModuleId, isPressed: true }));
        }
    };

    const handlePlayerReady = (player: YT.Player) => {
        // register player with the refs list stored in slice
        playerRefs[videoModuleId] = player;
        dispatch(setModulePlayerReady({ videoModuleId, isReady: true }));

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
    };
};

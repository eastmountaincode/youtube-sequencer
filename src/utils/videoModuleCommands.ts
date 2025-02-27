import { PadCommand } from "../types";
import { Dispatch } from "@reduxjs/toolkit";

// Functions for our controller -> the hook -> useVideoModule
export const sendPlayCommand = (player: YT.Player) => {
    player.playVideo();
};

export const sendPauseCommand = (player: YT.Player) => {
    player.pauseVideo();
};

export const sendSeekForwardCommand = (player: YT.Player) => {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    player.seekTo(Math.min(currentTime + 5, duration), true);
};

export const sendSeekBackwardCommand = (player: YT.Player) => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - 5), true);
};

export const sendJumpToTimeCommand = (player: YT.Player, percentage: number, nudgeValue: number = 0) => {
    const duration = player.getDuration();
    const targetTime = duration * (percentage / 100);
    //console.log('jumping to time', targetTime + nudgeValue);;
    player.seekTo(targetTime + nudgeValue, true);
};

export const sendVolumeChangeCommand = (player: YT.Player, volume: number) => {
    // console.log('changing volume to', volume);
    // Volume must be between 0 and 100
    const clampedVolume = Math.max(0, Math.min(100, volume));
    player.setVolume(clampedVolume);
};

export const sendPlaybackSpeedCommand = (player: YT.Player, speed: number) => {
    // console.log('setting speed to', speed);
    player.setPlaybackRate(speed);
};


export const sendPlayerMuteCommand = (player: YT.Player) => {
    //console.log('Executing mute command');
    player.mute();
};

export const sendPlayerUnmuteCommand = (player: YT.Player) => {
    //console.log('Executing unmute command');
    player.unMute();
};

interface CommandParameters {
    command: PadCommand;
    player: YT.Player;
    dispatch: Dispatch;
    nudgeValue?: number;
    volume?: number;
    speed?: number;
    setIsMuted?: (isMuted: boolean) => void;
}


export const executeCommand = ({ command, player, dispatch, nudgeValue = 0, volume = 100, setIsMuted, speed = 1 }: CommandParameters) => {
    switch (command) {
        case PadCommand.PLAY:
            sendPlayCommand(player);
            break;
        case PadCommand.PAUSE:
            sendPauseCommand(player);
            break;
        case PadCommand.ARROW_LEFT:
            sendSeekBackwardCommand(player);
            break;
        case PadCommand.ARROW_RIGHT:
            sendSeekForwardCommand(player);
            break;
        case PadCommand.ZERO:
            sendJumpToTimeCommand(player, 0, nudgeValue);
            break;
        case PadCommand.ONE:
            sendJumpToTimeCommand(player, 10, nudgeValue);
            break;
        case PadCommand.TWO:
            sendJumpToTimeCommand(player, 20, nudgeValue);
            break;
        case PadCommand.THREE:
            sendJumpToTimeCommand(player, 30, nudgeValue);
            break;
        case PadCommand.FOUR:
            sendJumpToTimeCommand(player, 40, nudgeValue);
            break;
        case PadCommand.FIVE:
            sendJumpToTimeCommand(player, 50, nudgeValue);
            break;
        case PadCommand.SIX:
            sendJumpToTimeCommand(player, 60, nudgeValue);
            break;
        case PadCommand.SEVEN:
            sendJumpToTimeCommand(player, 70, nudgeValue);
            break;
        case PadCommand.EIGHT:
            sendJumpToTimeCommand(player, 80, nudgeValue);
            break;
        case PadCommand.NINE:
            sendJumpToTimeCommand(player, 90, nudgeValue);
            break;
        case PadCommand.VOLUME:
            if (typeof volume === 'number') {
                sendVolumeChangeCommand(player, volume);
            }
            break;
        case PadCommand.PLAYBACK_SPEED:
            if (typeof speed === 'number') {
                sendPlaybackSpeedCommand(player, speed);
            }
            break;
        case PadCommand.PLAYER_MUTE:
            sendPlayerMuteCommand(player);
            setIsMuted?.(true);
            break;
        case PadCommand.PLAYER_UNMUTE:
            sendPlayerUnmuteCommand(player);
            setIsMuted?.(false);
            break;
        case PadCommand.EMPTY:
            break;
    }
};

import { AppDispatch } from "../store/store";
import { PadCommand } from "../types";

// Functions for our controller -> the hook -> useVideoModule
export const sendPlayCommand = (player: YT.Player) => {
    player.playVideo();
};

export const sendPauseCommand = (player: YT.Player) => {
    player.pauseVideo();
};

export const sendSeekForwardCommand = (player: YT.Player, videoModuleId: string) => {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    player.seekTo(Math.min(currentTime + 5, duration), true); 
};

export const sendSeekBackwardCommand = (player: YT.Player) => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - 5), true);
};

export const sendJumpToTimeCommand = (player: YT.Player, percentage: number) => {
    const duration = player.getDuration();
    const targetTime = duration * (percentage / 100);
    player.seekTo(targetTime, true);
};

export const sendVolumeChangeCommand = (player: YT.Player, volume: number) => {
    // Volume must be between 0 and 100
    const clampedVolume = Math.max(0, Math.min(100, volume));
    player.setVolume(clampedVolume);
};

export const sendPlayerMuteCommand = (player: YT.Player) => {
    player.mute();

};

export const sendPlayerUnmuteCommand = (player: YT.Player) => {
    player.unMute();
};


export const executeCommand = (
    command: PadCommand, 
    player: YT.Player, 
    videoModuleId: string,
    dispatch: AppDispatch,
    value?: number,
    setIsMuted?: (isMuted: boolean) => void,

) => {
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
            sendSeekForwardCommand(player, videoModuleId);
            break;
        case PadCommand.ONE:
            sendJumpToTimeCommand(player, 10);
            break;
        case PadCommand.TWO:
            sendJumpToTimeCommand(player, 20);
            break;
        case PadCommand.THREE:
            sendJumpToTimeCommand(player, 30);
            break;
        case PadCommand.FOUR:
            sendJumpToTimeCommand(player, 40);
            break;
        case PadCommand.FIVE:
            sendJumpToTimeCommand(player, 50);
            break;
        case PadCommand.SIX:
            sendJumpToTimeCommand(player, 60);
            break;
        case PadCommand.SEVEN:
            sendJumpToTimeCommand(player, 70);
            break;
        case PadCommand.EIGHT:
            sendJumpToTimeCommand(player, 80);
            break;
        case PadCommand.NINE:
            sendJumpToTimeCommand(player, 90);
            break;
        case PadCommand.VOLUME:
            if (typeof value === 'number') {
                sendVolumeChangeCommand(player, value);
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


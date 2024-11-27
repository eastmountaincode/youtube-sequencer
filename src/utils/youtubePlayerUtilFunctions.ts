export const getLivePlayer = (videoModuleId: string): YT.Player => {
    return new YT.Player(`youtube-player-${videoModuleId}`);
};
const getPlayer = (videoModuleId: string): YT.Player => {
    return new YT.Player(`youtube-player-${videoModuleId}`);
};
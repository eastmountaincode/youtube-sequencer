declare namespace YT {
    interface Player {
        playVideo(): void;
        pauseVideo(): void;
        seekTo(seconds: number): void;
        getCurrentTime(): number;
        getDuration(): number;
        setVolume(volume: number): void;
        getVolume(): number;
        mute(): void;
        unMute(): void;
        isMuted(): boolean;
    }
}

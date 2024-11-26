export class AudioEngine {
    private audioContext: AudioContext;
    private nextTickTime: number;
    private tickInterval: number;
    private timerID: number | null;
    private ppqn: number;

    constructor() {
        this.audioContext = new AudioContext();
        this.nextTickTime = 0;
        this.tickInterval = 0;
        this.timerID = null;
        this.ppqn = 24; // MIDI standard pulses per quarter note
    }

    start(bpm: number, onTick: (tick: number) => void, currentTick: number = 0) {
        // Make sure Web Audio API is active
        this.audioContext.resume();

        // Set initial timing reference point using high-precision audio clock
        this.nextTickTime = this.audioContext.currentTime;

        // Calculate time between ticks based on BPM
        // 60 seconds / BPM gives us time per beat
        // Divide by PPQN (24) to get time per tick
        this.tickInterval = (60.0 / bpm) / this.ppqn;

        this.timerID = 1;
        // Scheduler function runs on each animation frame
        const scheduler = () => {
            // Schedule ticks that should occur in next 50ms
            if (this.timerID !== null) {

                while (this.nextTickTime < this.audioContext.currentTime + 0.05) {
                    // Execute tick callback with current tick count
                    onTick(currentTick);
                    // Advance to next tick time
                    this.nextTickTime += this.tickInterval;
                }
                // Queue next scheduler run
                this.timerID = window.requestAnimationFrame(scheduler);
            }
        };

        // Start the scheduling loop
        scheduler();
    }

    stop() {
        if (this.timerID !== null) {
            window.cancelAnimationFrame(this.timerID);
            this.timerID = null;
            this.nextTickTime = 0; // Reset timing
        }
    }

    setBpm(bpm: number) {
        this.tickInterval = (60.0 / bpm) / this.ppqn;
    }
}

export const audioEngine = new AudioEngine();

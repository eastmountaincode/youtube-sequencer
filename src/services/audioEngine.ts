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

    private metronomeEnabled: boolean = false;

    setMetronomeEnabled(enabled: boolean) {
        this.metronomeEnabled = enabled;
    }

    private playTick(time: number, isDownbeat: boolean) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Higher pitch for downbeat, lower for other beats
        osc.frequency.value = isDownbeat ? 1000 : 800;
        
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        
        osc.start(time);
        osc.stop(time + 0.1);
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
        // const scheduler = () => {
        //     // Schedule ticks that should occur in next 50ms
        //     if (this.timerID !== null) {

        //         while (this.nextTickTime < this.audioContext.currentTime + 0.05) {
        //             if (currentTick % 24 === 0) {
        //                 // true for first beat of bar (every 96 ticks)
        //                 this.playTick(this.nextTickTime, currentTick % 96 === 0);
        //             }

        //             // Execute tick callback with current tick count
        //             onTick(currentTick);
        //             // Advance to next tick time
        //             this.nextTickTime += this.tickInterval;
        //         }
        //         // Queue next scheduler run
        //         this.timerID = window.requestAnimationFrame(scheduler);
        //     }
        // };

        const scheduler = () => {
            if (this.timerID !== null) {
                while (this.nextTickTime < this.audioContext.currentTime + 0.05) {
                    // Only play metronome on quarter notes (every 24 ticks) when enabled
                    if (this.metronomeEnabled && currentTick % 96 === 0) {
                        // First beat of bar is every 96 ticks (4 quarter notes)
                        this.playTick(this.nextTickTime, currentTick % 96 === 0);
                    }
                    onTick(currentTick);
                    this.nextTickTime += this.tickInterval;
                }
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

import { setCurrentStep, setCurrentTick } from "../store/audioEngineSlice";
import { PadCommand } from "../types";
import { executeCommand } from "../utils/videoModuleCommands";

export class AudioEngine {
    private oscillator: OscillatorNode;
    private gainNode: GainNode;
    private audioContext: AudioContext;
    private nextTickTime: number;
    private tickInterval: number;
    private timerID: number | null;
    private ppqn: number;
    private globalTick: number = 0;
    private numPads: number = 32;
    private dispatch: any;
    private sequencers: any;
    private playerRefs: any;
    private metronomeEnabled: boolean = false;
    private isConfigured: boolean = false;
    private bpm: number = 120;
    private metronomeVolume: number = 0.3;
    private metronomeDivision: number = 24; // 24 is half notes

    constructor() {
        this.audioContext = new AudioContext();
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();

        // Set up the audio graph
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        // Configure oscillator
        this.oscillator.frequency.value = 1000;

        // Start the oscillator (it will run continuously)
        this.oscillator.start();

        // Initialize gain to 0 (silence)
        this.gainNode.gain.value = 0;
        this.nextTickTime = 0;
        this.tickInterval = 0;
        this.timerID = null;
        this.ppqn = 24; // MIDI standard pulses per quarter note
        this.globalTick = 0;
    }

    configure({ dispatch, sequencers, playerRefs, initialBpm }: any) {
        this.dispatch = dispatch;
        this.sequencers = sequencers;
        this.playerRefs = playerRefs;
        this.setBpm(initialBpm);
        this.isConfigured = true;

    }

    setMetronomeEnabled(enabled: boolean) {
        this.metronomeEnabled = enabled;
    }

    getBpm(): number {
        return this.bpm;
    }

    setBpm(bpm: number) {
        this.bpm = bpm;
        this.tickInterval = (60.0 / bpm) / this.ppqn;
    }

    updateSequencers(sequencers: any) {
        this.sequencers = sequencers;
    }

    setMetronomeVolume(volume: number) {
        this.metronomeVolume = volume;
    }

    setMetronomeDivision(division: number) {
        this.metronomeDivision = division;
    }

    private playTick(time: number, isDownbeat: boolean) {
        this.oscillator.frequency.setValueAtTime(isDownbeat ? 1500 : 1000, time);

        this.gainNode.gain.cancelScheduledValues(time);
        // Start at absolute zero
        this.gainNode.gain.setValueAtTime(0, time);
        // attack
        const attackLevel = isDownbeat ?
            this.metronomeVolume * 0.4 :
            this.metronomeVolume * 0.3;
        this.gainNode.gain.linearRampToValueAtTime(attackLevel, time + 0.001);
        // decay
        this.gainNode.gain.exponentialRampToValueAtTime(0.000001, time + 0.055);
        // Set to absolute zero after decay
        this.gainNode.gain.setValueAtTime(0, time + 0.055);
    }

    start() {
        if (!this.isConfigured) {
            throw new Error('AudioEngine must be configured before starting');
        }

        // Make sure Web Audio API is active
        this.audioContext.resume();

        // Set initial timing reference point using high-precision audio clock
        this.nextTickTime = this.audioContext.currentTime;

        // Calculate time between ticks based on BPM
        // 60 seconds / BPM gives us time per beat
        // Divide by PPQN (24) to get time per tick
        this.tickInterval = (60.0 / this.bpm) / this.ppqn;

        this.timerID = 1;

        const scheduler = () => {
            if (this.timerID !== null) {
                while (this.nextTickTime < this.audioContext.currentTime + 0.05) {
                    // Only play metronome on quarter notes (every 24 ticks) when enabled
                    if (this.metronomeEnabled) {
                        const isMetronomeTick = this.globalTick % this.metronomeDivision === 0;
                        if (isMetronomeTick) {
                            const isDownbeat = this.globalTick % 48 === 0;
                            this.playTick(this.nextTickTime, isDownbeat);
                        }
                    }
                    this.dispatch(setCurrentTick(this.globalTick));


                    // Calculate current step and execute commands
                    if (this.globalTick % 6 === 0) {
                        const step = Math.floor(this.globalTick / 6) % this.numPads;
                        this.dispatch(setCurrentStep(step));
                        this.executeStepCommands(step);
                    }

                    // Increment global tick and reset to zero if necessary
                    this.globalTick++;
                    if (this.globalTick >= (6 * this.numPads)) this.globalTick = 0;

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
            this.nextTickTime = 0;
            this.globalTick = 0;
        }
    }

    private executeStepCommands(step: number) {
        Promise.all(Object.keys(this.sequencers).map(sequencerId => {
            const player = this.playerRefs[sequencerId];
            if (player) {
                const currentStepCommand = this.sequencers[sequencerId].padCommands[step];
                const nudgeValue = this.sequencers[sequencerId].nudgeValues[step];
    
                if (currentStepCommand !== PadCommand.EMPTY) {
                    return executeCommand({
                        player: player,
                        command: currentStepCommand,
                        dispatch: this.dispatch,
                        nudgeValue: nudgeValue
                    });
                }
            }
        }));
    }
}

export const audioEngine = new AudioEngine();

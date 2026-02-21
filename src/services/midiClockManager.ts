import { midiService } from './midiService';
import { audioEngine } from './audioEngine';
import { store } from '../store/store';
import { setMidiDetectedBpm } from '../store/midiSlice';
import { setPlaying } from '../store/audioEngineSlice';

export type SyncMode = 'internal' | 'follower' | 'leader';

// MIDI System Real-Time messages
const MIDI_CLOCK = 0xF8;
const MIDI_START = 0xFA;
const MIDI_CONTINUE = 0xFB;
const MIDI_STOP = 0xFC;

export class MidiClockManager {
    private syncMode: SyncMode = 'internal';
    private clockTimestamps: number[] = [];
    private readonly BPM_SAMPLE_SIZE = 24; // one beat's worth of clocks
    private running: boolean = false;

    constructor() {
        midiService.onMessage(this.handleMidiMessage.bind(this));
    }

    setSyncMode(mode: SyncMode): void {
        this.syncMode = mode;

        if (mode === 'follower') {
            audioEngine.setExternalClockMode(true);
            this.clockTimestamps = [];
        } else {
            audioEngine.setExternalClockMode(false);
        }
    }

    getSyncMode(): SyncMode {
        return this.syncMode;
    }

    // Called by AudioEngine on each tick when in leader mode
    onInternalTick(): void {
        if (this.syncMode === 'leader') {
            midiService.sendBytes([MIDI_CLOCK]);
        }
    }

    // Called by AudioEngine on start when in leader mode
    onInternalStart(): void {
        if (this.syncMode === 'leader') {
            midiService.sendBytes([MIDI_START]);
        }
    }

    // Called by AudioEngine on stop when in leader mode
    onInternalStop(): void {
        if (this.syncMode === 'leader') {
            midiService.sendBytes([MIDI_STOP]);
        }
    }

    private handleMidiMessage(data: Uint8Array, timestamp: number): void {
        if (this.syncMode !== 'follower') return;

        const status = data[0];

        switch (status) {
            case MIDI_CLOCK:
                this.handleClockTick(timestamp);
                break;
            case MIDI_START:
                this.running = true;
                audioEngine.resetTick();
                audioEngine.startFollowerMode();
                store.dispatch(setPlaying(true));
                break;
            case MIDI_CONTINUE:
                this.running = true;
                audioEngine.startFollowerMode();
                store.dispatch(setPlaying(true));
                break;
            case MIDI_STOP:
                this.running = false;
                audioEngine.stopFollowerMode();
                store.dispatch(setPlaying(false));
                break;
        }
    }

    private handleClockTick(timestamp: number): void {
        if (!this.running) return;
        audioEngine.advanceTick();

        // BPM detection from incoming clock intervals
        this.clockTimestamps.push(timestamp);
        if (this.clockTimestamps.length > this.BPM_SAMPLE_SIZE) {
            this.clockTimestamps.shift();
        }
        if (this.clockTimestamps.length >= 2) {
            const totalTime =
                this.clockTimestamps[this.clockTimestamps.length - 1] -
                this.clockTimestamps[0];
            const avgTickInterval = totalTime / (this.clockTimestamps.length - 1);
            // 24 ticks per quarter note, avgTickInterval in ms
            const detectedBpm = Math.round(60000 / (avgTickInterval * 24));
            if (detectedBpm >= 20 && detectedBpm <= 300) {
                store.dispatch(setMidiDetectedBpm(detectedBpm));
            }
        }
    }
}

export const midiClockManager = new MidiClockManager();

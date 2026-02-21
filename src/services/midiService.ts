export interface MidiDeviceInfo {
    id: string;
    name: string;
    manufacturer: string;
    type: 'input' | 'output';
}

export type MidiMessageCallback = (data: Uint8Array, timestamp: number) => void;

export class MidiService {
    private midiAccess: MIDIAccess | null = null;
    private activeInput: MIDIInput | null = null;
    private activeOutput: MIDIOutput | null = null;
    private messageCallback: MidiMessageCallback | null = null;
    private onDeviceChangeCallback: (() => void) | null = null;

    isSupported(): boolean {
        return !!navigator.requestMIDIAccess;
    }

    async initialize(): Promise<boolean> {
        if (!navigator.requestMIDIAccess) return false;
        try {
            this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
            this.midiAccess.onstatechange = () => {
                this.onDeviceChangeCallback?.();
            };
            return true;
        } catch {
            return false;
        }
    }

    getInputs(): MidiDeviceInfo[] {
        if (!this.midiAccess) return [];
        const inputs: MidiDeviceInfo[] = [];
        this.midiAccess.inputs.forEach((input) => {
            if (input.state === 'connected') {
                inputs.push({
                    id: input.id,
                    name: input.name || 'Unknown Input',
                    manufacturer: input.manufacturer || '',
                    type: 'input',
                });
            }
        });
        return inputs;
    }

    getOutputs(): MidiDeviceInfo[] {
        if (!this.midiAccess) return [];
        const outputs: MidiDeviceInfo[] = [];
        this.midiAccess.outputs.forEach((output) => {
            if (output.state === 'connected') {
                outputs.push({
                    id: output.id,
                    name: output.name || 'Unknown Output',
                    manufacturer: output.manufacturer || '',
                    type: 'output',
                });
            }
        });
        return outputs;
    }

    selectInput(deviceId: string): void {
        this.clearInput();
        if (!this.midiAccess) return;
        const input = this.midiAccess.inputs.get(deviceId);
        if (input) {
            this.activeInput = input;
            this.activeInput.onmidimessage = (event: MIDIMessageEvent) => {
                this.messageCallback?.(event.data, event.timeStamp);
            };
        }
    }

    selectOutput(deviceId: string): void {
        this.clearOutput();
        if (!this.midiAccess) return;
        const output = this.midiAccess.outputs.get(deviceId);
        if (output) {
            this.activeOutput = output;
        }
    }

    clearInput(): void {
        if (this.activeInput) {
            this.activeInput.onmidimessage = null;
            this.activeInput = null;
        }
    }

    clearOutput(): void {
        this.activeOutput = null;
    }

    sendBytes(bytes: number[]): void {
        this.activeOutput?.send(bytes);
    }

    onMessage(callback: MidiMessageCallback): void {
        this.messageCallback = callback;
    }

    onDeviceChange(callback: () => void): void {
        this.onDeviceChangeCallback = callback;
    }

    async reinitialize(): Promise<boolean> {
        this.clearInput();
        this.clearOutput();
        this.midiAccess = null;
        return this.initialize();
    }

    destroy(): void {
        this.clearInput();
        this.clearOutput();
        this.midiAccess = null;
    }
}

export const midiService = new MidiService();

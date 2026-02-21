interface MIDIOptions {
    sysex?: boolean;
}

interface MIDIAccess extends EventTarget {
    inputs: Map<string, MIDIInput>;
    outputs: Map<string, MIDIOutput>;
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
    sysexEnabled: boolean;
}

interface MIDIPort extends EventTarget {
    id: string;
    manufacturer: string | null;
    name: string | null;
    type: 'input' | 'output';
    version: string | null;
    state: 'connected' | 'disconnected';
    connection: 'open' | 'closed' | 'pending';
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
    open(): Promise<MIDIPort>;
    close(): Promise<MIDIPort>;
}

interface MIDIInput extends MIDIPort {
    type: 'input';
    onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

interface MIDIOutput extends MIDIPort {
    type: 'output';
    send(data: number[] | Uint8Array, timestamp?: number): void;
    clear(): void;
}

interface MIDIMessageEvent extends Event {
    data: Uint8Array;
    timeStamp: number;
}

interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
}

interface Navigator {
    requestMIDIAccess(options?: MIDIOptions): Promise<MIDIAccess>;
}

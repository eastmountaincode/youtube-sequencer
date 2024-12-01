import { PadCommand } from "../types";

export interface ValidFileStructure {
    videoModule: {
        modules: Record<string, {
            videoUrl: string;
            videoId: string;
        }>;
    };
    sequencer: {
        selectedSequencerId: string;
        selectedPadId: number;
        sequencers: Record<string, {
            padCommands: string[];
            nudgeValues: number[];
        }>;
    };
    persistentAudioSettings: {
        bpm: number;
        volumes: Record<string, number>;
    };
}

export const validateFile = (data: any): data is ValidFileStructure => {
    const hasValidSequencers = data?.sequencer?.sequencers && 
        Object.values(data.sequencer.sequencers).every(sequencer => 
            Array.isArray((sequencer as any).padCommands) && 
            Array.isArray((sequencer as any).nudgeValues) &&
            (sequencer as any).padCommands.every((cmd: PadCommand) => 
                Object.values(PadCommand).includes(cmd)
            )
        );

    return (
        data &&
        typeof data === 'object' &&
        'videoModule' in data &&
        'sequencer' in data &&
        'persistentAudioSettings' in data &&
        typeof data.persistentAudioSettings.bpm === 'number' &&
        typeof data.persistentAudioSettings.volumes === 'object' &&
        typeof data.sequencer.selectedSequencerId === 'string' &&
        typeof data.sequencer.selectedPadId === 'number' &&
        hasValidSequencers
    );
};

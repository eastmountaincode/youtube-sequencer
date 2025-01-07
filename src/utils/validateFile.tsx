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
        padCommands: {
          A: string[];
          B: string[];
        };
        nudgeValues: {
          A: number[];
          B: number[];
        };
        activeBank: 'A' | 'B';
      }>;
    };
    persistentAudioSettings: {
      bpm: number;
      volumes: Record<string, number>;
      mutedModules: Record<string, boolean>; // Add this
    };
  }
  
  export const validateFile = (data: any): data is ValidFileStructure => {
    const hasValidSequencers = data?.sequencer?.sequencers &&
      Object.values(data.sequencer.sequencers).every(sequencer => {
        const seq = sequencer as any;
        return (
          seq.activeBank && 
          (seq.activeBank === 'A' || seq.activeBank === 'B') &&
          seq.padCommands?.A && Array.isArray(seq.padCommands.A) &&
          seq.padCommands?.B && Array.isArray(seq.padCommands.B) &&
          seq.nudgeValues?.A && Array.isArray(seq.nudgeValues.A) &&
          seq.nudgeValues?.B && Array.isArray(seq.nudgeValues.B) &&
          seq.padCommands.A.every((cmd: PadCommand) => Object.values(PadCommand).includes(cmd)) &&
          seq.padCommands.B.every((cmd: PadCommand) => Object.values(PadCommand).includes(cmd))
        );
      });
  
    return (
      data &&
      typeof data === 'object' &&
      'videoModule' in data &&
      'sequencer' in data &&
      'persistentAudioSettings' in data &&
      typeof data.persistentAudioSettings.bpm === 'number' &&
      typeof data.persistentAudioSettings.volumes === 'object' &&
      typeof data.persistentAudioSettings.mutedModules === 'object' && 
      typeof data.sequencer.selectedSequencerId === 'string' &&
      typeof data.sequencer.selectedPadId === 'number' &&
      hasValidSequencers
    );
  };
  
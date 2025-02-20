export const migrateFileData = (data: any) => {
    // Deep clone the data to avoid mutations
    const migratedData = JSON.parse(JSON.stringify(data));

    // Check if persistentAudioSettings exists
    if (!migratedData.persistentAudioSettings) {
        migratedData.persistentAudioSettings = {};
    }

    // Add playbackSpeeds if missing
    if (!migratedData.persistentAudioSettings.playbackSpeeds) {
        migratedData.persistentAudioSettings.playbackSpeeds = {};
        
        // For each video module, set default speed to 1
        if (migratedData.videoModule?.modules) {
            Object.keys(migratedData.videoModule.modules).forEach(moduleId => {
                migratedData.persistentAudioSettings.playbackSpeeds[moduleId] = 1;
            });
        }
    }

    return migratedData;
};

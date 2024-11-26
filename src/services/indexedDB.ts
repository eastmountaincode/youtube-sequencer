const DB_NAME = 'sequencerDB';
const VIDEO_STORE = 'videoModule';
const AUDIO_STORE = 'audioEngine';

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        // reject sends the ERROR to whatever code is waiting on the promise
        request.onerror = () => reject(request.error);
        // resolve sends the RESULT to whatever code is waiting on the promise
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = request.result;

            // Create stores for both video and audio data
            // videoModuleId matches the keys in videoModuleSlice.modules Record
            // When components register modules, they generate these IDs
            db.createObjectStore(VIDEO_STORE, { keyPath: 'videoModuleId' });
            // sequencerId matches the keys in audioEngineSlice sequencers Record
            db.createObjectStore(AUDIO_STORE, { keyPath: 'sequencerId' });
        }
    });
}




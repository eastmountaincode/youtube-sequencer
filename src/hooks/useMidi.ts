import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { midiService } from '../services/midiService';
import { midiClockManager } from '../services/midiClockManager';
import { audioEngine } from '../services/audioEngine';
import {
    setMidiSupported,
    setMidiInitialized,
    setSyncMode as setSyncModeAction,
    setAvailableInputs,
    setAvailableOutputs,
    setSelectedInputId,
    setSelectedOutputId,
    setMidiDetectedBpm,
    SyncMode,
} from '../store/midiSlice';

export const useMidi = () => {
    const dispatch = useDispatch();
    const midiState = useSelector((state: RootState) => state.midi);

    const refreshDevices = useCallback(() => {
        dispatch(setAvailableInputs(
            midiService.getInputs().map(d => ({ id: d.id, name: d.name }))
        ));
        dispatch(setAvailableOutputs(
            midiService.getOutputs().map(d => ({ id: d.id, name: d.name }))
        ));
    }, [dispatch]);

    // Initialize Web MIDI on mount
    useEffect(() => {
        const init = async () => {
            const supported = midiService.isSupported();
            dispatch(setMidiSupported(supported));

            if (supported) {
                const success = await midiService.initialize();
                dispatch(setMidiInitialized(success));

                if (success) {
                    refreshDevices();

                    // Wire up leader mode callbacks
                    audioEngine.setClockCallbacks({
                        onTick: () => midiClockManager.onInternalTick(),
                        onStart: () => midiClockManager.onInternalStart(),
                        onStop: () => midiClockManager.onInternalStop(),
                    });
                }
            }
        };
        init();

        midiService.onDeviceChange(() => refreshDevices());

        return () => {
            midiService.destroy();
        };
    }, []);

    const selectInput = useCallback((deviceId: string | null) => {
        if (deviceId) {
            midiService.selectInput(deviceId);
        } else {
            midiService.clearInput();
        }
        dispatch(setSelectedInputId(deviceId));
    }, [dispatch]);

    const selectOutput = useCallback((deviceId: string | null) => {
        if (deviceId) {
            midiService.selectOutput(deviceId);
        } else {
            midiService.clearOutput();
        }
        dispatch(setSelectedOutputId(deviceId));
    }, [dispatch]);

    const reinitAndRefresh = useCallback(async () => {
        const success = await midiService.reinitialize();
        dispatch(setMidiInitialized(success));
        if (success) refreshDevices();
    }, [dispatch, refreshDevices]);

    const setSyncMode = useCallback((mode: SyncMode) => {
        midiClockManager.setSyncMode(mode);
        dispatch(setSyncModeAction(mode));

        if (mode !== 'follower') {
            dispatch(setMidiDetectedBpm(null));
        }
    }, [dispatch]);

    return {
        ...midiState,
        selectInput,
        selectOutput,
        setSyncMode,
        refreshDevices,
        reinitAndRefresh,
    };
};

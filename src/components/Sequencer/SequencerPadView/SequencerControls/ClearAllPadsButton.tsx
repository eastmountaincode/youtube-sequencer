import React from 'react';
import { useDispatch } from 'react-redux';
import { clearAllPads, updateNudgeValue } from '../../../../store/sequencerSlice';

interface ClearAllPadsButtonProps {
    sequencerId: string;
    padNudgeValues: number[];
}

const ClearAllPadsButton: React.FC<ClearAllPadsButtonProps> = ({
    sequencerId,
    padNudgeValues
}) => {
    const dispatch = useDispatch();

    const handleClearAll = () => {
        dispatch(clearAllPads({ sequencerId }));
        // Reset all nudge values to zero
        for (let i = 0; i < padNudgeValues.length; i++) {
            dispatch(updateNudgeValue({
                sequencerId,
                padId: i,
                nudgeValue: 0
            }));
        }
    };

    return (
        <button
            onClick={handleClearAll}
            style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--danger)',
                padding: '4px 8px',
                fontSize: '9px',
                cursor: 'pointer',
            }}
        >
            CLEAR ALL
        </button>
    );
};

export default ClearAllPadsButton;

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
        <div style={{ marginLeft: '24px', minWidth: '130px' }}>
            <button
                className="btn btn-outline-light btn-sm"
                onClick={handleClearAll}
            >
                <i className="bi bi-trash me-1"></i>
                Clear All Pads
            </button>
        </div>
    );
};

export default ClearAllPadsButton;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import NudgeControls from './NudgeControls';
import ClearAllPadsButton from './ClearAllPadsButton';

interface SequencerControlsProps {
    sequencerId: string;
    padNudgeValues: number[];
}

const SequencerControls: React.FC<SequencerControlsProps> = ({
    sequencerId,
    padNudgeValues
}) => {
    const [isNarrow, setIsNarrow] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectedPadId = useSelector((state: RootState) => state.sequencer.selectedPadId);
    const selectedSequencerId = useSelector((state: RootState) => state.sequencer.selectedSequencerId);

    React.useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            setIsNarrow(width < 550); // Adjust threshold as needed
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`d-flex ${isNarrow ? 'flex-column' : 'justify-content-between'} align-items-center mt-4 mb-4 gap-3`}
        >
            <div className="d-flex align-items-center">
                {selectedPadId !== null && selectedSequencerId === sequencerId && (
                    <NudgeControls
                        sequencerId={sequencerId}
                        selectedPadId={selectedPadId}
                        padNudgeValues={padNudgeValues}
                    />
                )}
            </div>
            <ClearAllPadsButton
                sequencerId={sequencerId}
                padNudgeValues={padNudgeValues}
            />
        </div>
    );
};


export default SequencerControls;

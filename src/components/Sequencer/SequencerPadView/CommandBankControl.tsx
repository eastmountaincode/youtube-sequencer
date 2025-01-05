import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { toggleCommandBank } from '../../../store/sequencerSlice';
import './CommandBankControl.css';
import { useEffect } from 'react';

interface CommandBankControlProps {
  sequencerId: string;
}

const bankKeyMap = {
  'seq1': 'y',
  'seq2': 'u',
  'seq3': 'h',
  'seq4': 'j'
};

const CommandBankControl: React.FC<CommandBankControlProps> = ({ sequencerId }) => {
  const dispatch = useDispatch();
  const activeBank = useSelector((state: RootState) => 
    state.sequencer.sequencers[sequencerId].activeBank
  );

  useEffect(() => {
    const targetKey = bankKeyMap[sequencerId as keyof typeof bankKeyMap];
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        dispatch(toggleCommandBank({ sequencerId }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sequencerId, dispatch]);

  return (
    <div className="bank-switch-container">
      <label className="bank-switch">
        <input 
          type="checkbox" 
          checked={activeBank === 'B'}
          onChange={() => dispatch(toggleCommandBank({ sequencerId }))}
        />
        <span className="slider">
          <span className="bank-a">A</span>
          <span className="bank-b">B</span>
        </span>
      </label>
    </div>
  );
};

export default CommandBankControl;


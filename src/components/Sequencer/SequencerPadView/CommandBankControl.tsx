import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { toggleCommandBank } from '../../../store/sequencerSlice';
import './CommandBankControl.css';

interface CommandBankControlProps {
  sequencerId: string;
}

const CommandBankControl: React.FC<CommandBankControlProps> = ({ sequencerId }) => {
  const dispatch = useDispatch();
  const activeBank = useSelector((state: RootState) => 
    state.sequencer.sequencers[sequencerId].activeBank
  );

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


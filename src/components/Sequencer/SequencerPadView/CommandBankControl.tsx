import React from 'react';
import './CommandBankControl.css';

const CommandBankControl: React.FC = () => {
  return (
    <div className="bank-switch-container">
      <label className="bank-switch">
        <input type="checkbox" />
        <span className="slider">
          <span className="bank-a">A</span>
          <span className="bank-b">B</span>
        </span>
      </label>
    </div>
  );
};

export default CommandBankControl;

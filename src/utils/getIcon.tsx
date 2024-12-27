import React from 'react';
import { PadCommand } from '../types';
import Pad from '../components/Sequencer/Pad';

export const getIcon = (command: PadCommand) => {
  switch (command) {
    case PadCommand.PLAY:
      return <i className="bi bi-play-circle-fill"></i>;
    case PadCommand.PAUSE:
      return <i className="bi bi-pause-circle-fill"></i>;
    case PadCommand.ARROW_LEFT:
      return <i className="bi bi-arrow-left-square-fill"></i>;
    case PadCommand.ARROW_RIGHT:
      return <i className="bi bi-arrow-right-square-fill"></i>;
    case PadCommand.ZERO:
      return <i className="bi bi-0-square-fill"></i>;
    case PadCommand.ONE:
      return <i className="bi bi-1-square-fill"></i>;
    case PadCommand.TWO:
      return <i className="bi bi-2-square-fill"></i>;
    case PadCommand.THREE:
      return <i className="bi bi-3-square-fill"></i>;
    case PadCommand.FOUR:
      return <i className="bi bi-4-square-fill"></i>;
    case PadCommand.FIVE:
      return <i className="bi bi-5-square-fill"></i>;
    case PadCommand.SIX:
      return <i className="bi bi-6-square-fill"></i>;
    case PadCommand.SEVEN:
      return <i className="bi bi-7-square-fill"></i>;
    case PadCommand.EIGHT:
      return <i className="bi bi-8-square-fill"></i>;
    case PadCommand.NINE:
      return <i className="bi bi-9-square-fill"></i>;
    case PadCommand.PLAYER_MUTE:
      return <i className="bi bi-volume-mute-fill"></i>;
    case PadCommand.PLAYER_UNMUTE:
      return <i className="bi bi-volume-up-fill"></i>;
    default:
      return null;
  }
};

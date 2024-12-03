# YouTube Sequencer

Turn any YouTube video into a musical instrument! Create rhythmic patterns by triggering video timestamps in a sequencer grid.

## Features
- 32-step sequencer grid
- Use any YouTube video as a sound source
- Variable tempo control
- Per-track volume adjustment
- Built-in metronome with adjustable time divisions
- Fine-tune timing with millisecond-precise nudge controls
- Save and load patterns as .dance files

## Getting Started
1. Paste a YouTube URL into a track slot
2. Click squares in the grid to create patterns
3. Press play to hear your sequence
4. Add more videos to build a full composition

## Commands
- Number keys (1-9): Jump to video timestamps
- P: Play video
- O: Pause video
- [: Seek backward 5 seconds
- ]: Seek forward 5 seconds
- M: Mute
- U: Unmute
- Backspace: Clear pad

## Tech Stack
- React with TypeScript
- Redux for state management
- AWS S3 for pattern storage
- PostgreSQL database
- GraphQL API with AppSync
- Firebase Authentication

## Development
```bash
npm install
npm start

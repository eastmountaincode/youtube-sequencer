import { useState } from "react";
import { ExampleNudgeControls, ExamplePad } from "../utils/examplesForAbout";
import KeyboardDiagram from "./KeyboardDiagram";
import './About.css';

export default function About() {
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showExampleVideoModal, setShowExampleVideoModal] = useState(false);

  return (
    <div className="about-page">
      <h2>How To Use YouTube Sequencer</h2>

      <section className="about-section">
        <h3>What is this?</h3>
        <p>
          Have you ever hit the number keys while watching Youtube? That simple action jumps the video to different timestamps -
          and creative musicians have discovered you can use this like a primitive sampler.
        </p>
        <p>
          As someone who loves experimenting with drum machines like the Arturia Drumbrute, I wanted to take this
          Youtube "feature" and transform it into something musical. The result is a sequencer that turns any Youtube video into an instrument.
        </p>
        <p>
          Traditional sampling can be time-consuming, requiring you to download, trim, and import audio files.
          Youtube Sequencer removes these barriers - just paste a URL and start creating.
        </p>
      </section>

      <section className="about-section">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="about-btn" onClick={() => setShowKeyboardModal(true)}>
            <i className="bi bi-keyboard"></i>
            Keyboard Diagram
          </button>
          <button className="about-btn" onClick={() => setShowExampleVideoModal(true)}>
            <i className="bi bi-play-circle"></i>
            Example Video
          </button>
        </div>
      </section>

      <section className="about-section">
        <h3>Features</h3>
        <ul className="feature-list">
          <li className="feature-item">
            <i className="bi bi-grid"></i>
            32-step sequencer grid
          </li>
          <li className="feature-item">
            <i className="bi bi-youtube"></i>
            Use any Youtube video as a sound source
          </li>
          <li className="feature-item">
            <i className="bi bi-sliders"></i>
            Adjust volume per track
          </li>
          <li className="feature-item">
            <i className="bi bi-clock-history"></i>
            Variable tempo control
          </li>
          <li className="feature-item">
            <i className="bi bi-alarm"></i>
            Built-in metronome with adjustable time divisions
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h3>Getting Started</h3>
        <ol className="steps-list">
          <li className="step-item">
            <div className="step-content">
              Paste a Youtube URL into one of the track slots and click
              <button className="inline-btn" style={{ marginLeft: '6px' }}>LOAD</button>
            </div>
          </li>
          <li className="step-item">
            <div className="step-content">
              <div>
                Select a pad <ExamplePad /> and assign it a command to create your pattern.
              </div>
              <div style={{ marginTop: '12px' }}>
                <h5>Available Commands</h5>
                <table className="about-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Icon</th>
                      <th style={{ width: '80px' }}>Key</th>
                      <th>Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><i className="bi bi-1-square-fill"></i></td>
                      <td><kbd>0-9</kbd></td>
                      <td>Jump to video timestamp (10%-90%)</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-play-circle-fill"></i></td>
                      <td><kbd>p</kbd></td>
                      <td>Play video</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-pause-circle-fill"></i></td>
                      <td><kbd>o</kbd></td>
                      <td>Pause video</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-arrow-left-square-fill"></i></td>
                      <td><kbd>[</kbd></td>
                      <td>Seek backward 5s</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-arrow-right-square-fill"></i></td>
                      <td><kbd>]</kbd></td>
                      <td>Seek forward 5s</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-volume-mute-fill"></i></td>
                      <td><kbd>m</kbd></td>
                      <td>Mute</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-volume-up-fill"></i></td>
                      <td><kbd>n</kbd></td>
                      <td>Unmute</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><kbd>Backspace</kbd></td>
                      <td>Clear pad</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
          <li className="step-item">
            <div className="step-content">
              Press <button className="inline-btn" style={{ marginLeft: '4px', marginRight: '4px' }}>PLAY</button> to hear your sequence
            </div>
          </li>
          <li className="step-item">
            <div className="step-content">
              Add more videos to create a full composition
            </div>
          </li>
        </ol>
      </section>

      <section className="about-section">
        <h3>Nudge Controls</h3>
        <p>
          Fine-tune the timing of your seek commands using the nudge controls. Select any pad and adjust its timing with millisecond precision.
        </p>
        <div style={{ marginLeft: '12px' }}>
          <ExampleNudgeControls />
        </div>
        <p style={{ marginTop: '12px' }}>
          A thin bar under each pad indicates the pad's nudge value.
        </p>
      </section>

      <section className="about-section">
        <h3>Performance Controls</h3>
        <p>
          Quick keyboard controls for muting tracks and switching banks while performing:
        </p>

        <div style={{ marginLeft: '12px' }}>
          <h5>Quick Mute</h5>
          <table className="about-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><kbd>y</kbd></td><td>Toggle mute Track 1</td></tr>
              <tr><td><kbd>u</kbd></td><td>Toggle mute Track 2</td></tr>
              <tr><td><kbd>h</kbd></td><td>Toggle mute Track 3</td></tr>
              <tr><td><kbd>j</kbd></td><td>Toggle mute Track 4</td></tr>
            </tbody>
          </table>

          <h5 style={{ marginTop: '16px' }}>Bank Switching</h5>
          <p>Each track has two sequence banks (A and B) for different patterns:</p>
          <table className="about-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><kbd>e</kbd></td><td>Toggle Track 1 A/B</td></tr>
              <tr><td><kbd>r</kbd></td><td>Toggle Track 2 A/B</td></tr>
              <tr><td><kbd>d</kbd></td><td>Toggle Track 3 A/B</td></tr>
              <tr><td><kbd>f</kbd></td><td>Toggle Track 4 A/B</td></tr>
            </tbody>
          </table>

          <h5 style={{ marginTop: '16px' }}>Speed Control</h5>
          <p>Select a target track using the SPD buttons in the command bar, then use these keys to change its playback speed:</p>
          <table className="about-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><kbd>z</kbd></td><td>0.5x</td></tr>
              <tr><td><kbd>x</kbd></td><td>0.75x</td></tr>
              <tr><td><kbd>c</kbd></td><td>1x</td></tr>
              <tr><td><kbd>v</kbd></td><td>1.25x</td></tr>
              <tr><td><kbd>b</kbd></td><td>1.5x</td></tr>
              <tr><td><kbd>,</kbd></td><td>2x</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="about-section">
        <h3>Save & Load</h3>
        <p>
          Save and load patterns using the SAVE / LOAD buttons:
        </p>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
          <button className="about-btn">
            <i className="bi bi-download"></i>
            SAVE
          </button>
          <button className="about-btn">
            <i className="bi bi-upload"></i>
            LOAD
          </button>
        </div>
        <p style={{ marginTop: '12px' }}>
          Sequences are saved as <code style={{ color: 'var(--accent)' }}>.dance</code> files containing all your video sources, patterns, and timing settings.
        </p>
        <p>
          After loading a file, click <button className="inline-btn">LOAD</button> for each track to load the videos.
        </p>
      </section>

      <section className="about-section">
        <h3>Tips</h3>
        <div className="feature-list">
          <div className="tip-item">
            <i className="bi bi-lightbulb"></i>
            <span>Look for videos that feature a single sound/instrument. Just using drum sample videos is cheating - drum breaks are allowed though.</span>
          </div>
          <div className="tip-item">
            <i className="bi bi-lightbulb"></i>
            <span>Use the MUTE toggle below each video to control whether performance keys play or mute the sound.</span>
          </div>
          <div className="tip-item">
            <i className="bi bi-lightbulb"></i>
            <span>Try using Bank A for the main pattern and Bank B for fills.</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h3>Connect</h3>
        <div className="connect-section">
          <p style={{ marginBottom: '12px' }}>
            If you were inspired by this project, feel free to reach out!
          </p>
          <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>- Andrew</p>
          <div className="social-links">
            <a href="https://andrew-boylan.com/" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-globe"></i>andrew-boylan.com
            </a>
            <a href="https://www.linkedin.com/in/andrew-boylan-92842810a/" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-linkedin"></i>LinkedIn
            </a>
            <a href="https://www.instagram.com/ndrewboylan/" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>Instagram
            </a>
            <a href={`mailto:${['andreweboylan', 'gmail.com'].join('@')}`} className="social-link">
              <i className="bi bi-envelope"></i>Email
            </a>
          </div>
        </div>
      </section>

      {showKeyboardModal && (
        <div className="about-modal-overlay" onClick={() => setShowKeyboardModal(false)}>
          <div className="about-modal" onClick={e => e.stopPropagation()}>
            <div className="about-modal-header">
              <span className="about-modal-title">
                <i className="bi bi-keyboard"></i>
                Keyboard Controls
              </span>
              <button className="about-modal-close" onClick={() => setShowKeyboardModal(false)}>
                &times;
              </button>
            </div>
            <div className="about-modal-body">
              <KeyboardDiagram />
            </div>
            <div className="about-modal-footer">
              <button className="about-btn primary" onClick={() => setShowKeyboardModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showExampleVideoModal && (
        <div className="about-modal-overlay" onClick={() => setShowExampleVideoModal(false)}>
          <div className="about-modal" onClick={e => e.stopPropagation()}>
            <div className="about-modal-header">
              <span className="about-modal-title">
                <i className="bi bi-play-circle"></i>
                Example Video
              </span>
              <button className="about-modal-close" onClick={() => setShowExampleVideoModal(false)}>
                &times;
              </button>
            </div>
            <div className="about-modal-body">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/lZfgKpY076A"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="about-modal-footer">
              <button className="about-btn primary" onClick={() => setShowExampleVideoModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

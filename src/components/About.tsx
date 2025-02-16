import { useState } from "react";
import { ExampleNudgeControls, ExamplePad } from "../utils/examplesForAbout";


export default function About() {
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showExampleVideoModal, setShowExampleVideoModal] = useState(false);

  return (
    <div className="container mt-5 ps-4 pe-4 lead">
      <h2 className="mb-4">How To Use Youtube Sequencer</h2>

      <section className="mb-5">
        <h3>What is Youtube Sequencer?</h3>
        <p>
          Have you ever hit the number keys while watching Youtube? That simple action jumps the video to different timestamps -
          and creative musicians have discovered you can use this like a primitive sampler. This observation sparked an idea.
        </p>
        <p>
          As someone who loves experimenting with drum machines like the Arturia Drumbrute, I wanted to take this
          Youtube "feature" and transform it into something musical. I built Youtube Sequencer using TypeScript
          and Redux to create a robust, reliable music-making tool that doesn't miss a beat. The result is a
          sequencer that turns any Youtube video into an instrument.
        </p>
        <p>
          Traditional sampling can be time-consuming, requiring you to download, trim, and import audio files.
          Youtube Sequencer removes these barriers - just paste a URL and start creating.
        </p>
      </section>
      <section className="mb-5">
        <div className="d-flex flex-column flex-md-row align-items-start">
          <button
            className="btn btn-outline-light mb-3 mb-md-0"
            onClick={() => setShowKeyboardModal(true)}
          >
            <i className="bi bi-keyboard me-2"></i>
            Show Keyboard Diagram
          </button>

          <button
            className="btn btn-outline-light ms-md-3"
            onClick={() => setShowExampleVideoModal(true)}
          >
            <i className="bi bi-play-circle me-2"></i>
            Show Example Video
          </button>
        </div>
      </section>

      <section className="mb-5">
        <h3>Features</h3>
        <ul className="list-group list-group-flush bg-transparent">
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-grid me-2"></i>
            32-step sequencer grid
          </li>
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-youtube me-2"></i>
            Use any Youtube video as a sound source
          </li>
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-sliders me-2"></i>
            Adjust volume per track
          </li>
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-clock-history me-2"></i>
            Variable tempo control
          </li>
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-alarm me-2"></i>
            Built-in metronome with adjustable time divisions
          </li>
        </ul>
      </section>


      <section className="mb-5">
        <h3>Getting Started</h3>
        <ol className="list-group list-group-numbered list-group-flush bg-transparent">
          <li className="list-group-item bg-transparent text-light d-flex align-items-center py-3 position-relative">
            <span className="ms-4">
              Paste a Youtube URL into one of the track slots and click
              <button className="btn btn-primary ms-2 mx-2 btn-sm">
                Load Video <i className="bi bi-floppy ms-1"></i>
              </button>
            </span>
          </li>

          <li className="list-group-item bg-transparent text-light py-3 position-relative d-flex ">
            <div className="d-flex flex-column">
              <span className="ms-4">
                Select a pad <ExamplePad /> and assign it a command to create your pattern. Assign commands using your keyboard or the Addl. Command Select module.
              </span>

              <div className="ms-5 mt-3">
                <h5 className="mb-2">Available Commands:</h5>
                <table className="table table-dark table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Icon</th>
                      <th style={{ width: '100px' }}>Key</th>
                      <th>Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><i className="bi bi-1-square-fill fs-4"></i></td>
                      <td><kbd>0-9</kbd></td>
                      <td>Jump to video timestamp. <i className="bi bi-1-square-fill fs-5"></i> seeks to 10% of video duration, <i className="bi bi-2-square-fill fs-5"></i> to 20%, and so on, up to 90%</td>


                    </tr>
                    <tr>
                      <td><i className="bi bi-play-circle-fill fs-4"></i></td>
                      <td><kbd>p</kbd></td>
                      <td>Play video</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-pause-circle-fill fs-4"></i></td>
                      <td><kbd>o</kbd></td>
                      <td>Pause video</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-arrow-left-square-fill fs-4"></i></td>
                      <td><kbd>[</kbd></td>
                      <td>Seek backward 5 seconds</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-arrow-right-square-fill fs-4"></i></td>
                      <td><kbd>]</kbd></td>
                      <td>Seek forward 5 seconds</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-volume-mute-fill fs-4"></i></td>
                      <td><kbd>m</kbd></td>
                      <td>Mute</td>
                    </tr>
                    <tr>
                      <td><i className="bi bi-volume-up-fill fs-4"></i></td>
                      <td><kbd>u</kbd></td>
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

          <li className="list-group-item bg-transparent text-light d-flex align-items-center py-3 position-relative">
            <span className="ms-4">
              Press <button className="btn btn-outline-danger btn-sm mx-2" style={{ minWidth: '90px' }}><i className="bi bi-play-fill"></i> Play</button> to hear your sequence
            </span>
          </li>
          <li className="list-group-item bg-transparent text-light d-flex align-items-center py-3 position-relative">
            <span className="ms-4">Add more videos to create a full composition</span>
          </li>
        </ol>
      </section>

      <section className="mb-5">
        <h3>Nudge Controls</h3>
        <p>
          Fine-tune the timing of your seek commands (<i className="bi bi-1-square-fill"></i> - <i className="bi bi-9-square-fill"></i>) using the nudge controls. Select any pad and adjust its timing with millisecond precision. For example, a pad with a seek command of <i className="bi bi-1-square-fill ms-1 me-1"></i> and a nudge value of <span style={{ fontFamily: 'monospace' }}>0.030s</span> will seek to 10% of the video duration plus 30 milliseconds.
        </p>
        <div className="ms-4">
          <ExampleNudgeControls />
        </div>

        <p className="mt-4">You'll see a thin blue bar under each pad indicating the pad's nudge value.</p>

      </section>

      <section className="mb-5">
        <h3>Performance Controls</h3>
        <p>
          Quick keyboard controls let you mute tracks and switch sequence banks on the fly while performing:
        </p>

        <div className="ms-4">
          <h5 className="mb-3">Quick Mute Controls</h5>
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>y</kbd></td>
                <td>Toggle mute for Track 1</td>
              </tr>
              <tr>
                <td><kbd>u</kbd></td>
                <td>Toggle mute for Track 2</td>
              </tr>
              <tr>
                <td><kbd>h</kbd></td>
                <td>Toggle mute for Track 3</td>
              </tr>
              <tr>
                <td><kbd>j</kbd></td>
                <td>Toggle mute for Track 4</td>
              </tr>
            </tbody>
          </table>

          <h5 className="mb-3 mt-4">Sequence Bank Controls</h5>
          <p>
            Each track has two sequence banks (A and B) that can store different patterns. Switch between them instantly:
          </p>
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>e</kbd></td>
                <td>Toggle Track 1 between Bank A/B</td>
              </tr>
              <tr>
                <td><kbd>r</kbd></td>
                <td>Toggle Track 2 between Bank A/B</td>
              </tr>
              <tr>
                <td><kbd>d</kbd></td>
                <td>Toggle Track 3 between Bank A/B</td>
              </tr>
              <tr>
                <td><kbd>f</kbd></td>
                <td>Toggle Track 4 between Bank A/B</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>


      <section className="mb-5">
        <h3>Save & Load</h3>
        <p>
          Save and load patterns using the Save / Load buttons in Global Controls:
        </p>
        <div className="ms-4 d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: '155px' }}>
            <i className="bi bi-download me-2"></i>
            Save Pattern
          </button>
          <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: '155px' }}>
            <i className="bi bi-upload me-2"></i>
            Load Pattern
          </button>
        </div>
        <p className="mt-3">
          Your sequences are saved as <code>.dance</code> files, containing all your video sources, patterns, and timing settings. Share these files with friends to let them play your sequences!
        </p>
        <p className="mt-2">
          After loading a <code>.dance</code> file, remember to click <button className="btn btn-primary btn-sm mx-2">Load Video <i className="bi bi-floppy ms-1"></i></button> for each track to load the videos.
        </p>
      </section>

      <section className="mb-5">
        <h3>Tips</h3>
        <div className="list-group list-group-flush bg-transparent">
          <div className="list-group-item bg-transparent text-light">
            <i className="bi bi-lightbulb me-2"></i>
            Look for videos that feature a single sound / instrument. Just using videos of drum samples is cheating ;). Drum breaks are allowed though.
          </div>
          <div className="list-group-item bg-transparent text-light">
            <i className="bi bi-lightbulb me-2"></i>
            Toggle <button className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 mx-1">
              <i className="bi bi-volume-up"></i>
              <span>Mute</span>
            </button> below the video to determine if the <kbd>Y</kbd> <kbd>U</kbd> <kbd>H</kbd> <kbd>J</kbd> performance keys are causing the sound to <span className="text-success">play</span> or to be <span className="text-danger">muted</span>.
          </div>
          <div className="list-group-item bg-transparent text-light">
            <i className="bi bi-lightbulb me-2"></i>
            Try using the A sequencer command bank for the main sound and the B sequencer command bank for "fills"
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="mb-4">Let's Connect</h3>

        <div className="connect-message mb-4">
          <p className="lead">
            If you were inspired by this project, feel free to reach out - I'd love to hear about what you're working on too!
            <i className="bi bi-stars ms-2 text-warning"></i>
          </p>

          <div className="mt-3">
            <p className="h5 mb-2">- Andrew</p>
          </div>
        </div>

        <div className="social-links d-flex flex-wrap gap-3">
          <a
            href="https://andrew-boylan.com/"
            className="btn btn-outline-light btn-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-globe me-2"></i>andrew-boylan.com
          </a>

          <a
            href="https://www.linkedin.com/in/andrew-boylan-92842810a/"
            className="btn btn-outline-light btn-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-linkedin me-2"></i>LinkedIn
          </a>

          <a
            href="https://www.instagram.com/ndrewboylan/"
            className="btn btn-outline-light btn-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-instagram me-2"></i>Instagram
          </a>

          <a
            href={`mailto:${['andreweboylan', 'gmail.com'].join('@')}`}
            className="btn btn-outline-light btn-lg"
          >
            <i className="bi bi-envelope me-2"></i>Email
          </a>
        </div>
      </section>


      {showKeyboardModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">
                  <i className="bi bi-keyboard me-2"></i>
                  Keyboard Controls
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowKeyboardModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src="/images/keyboard_diagram.png"
                  alt="Keyboard Controls Diagram"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowKeyboardModal(false)}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExampleVideoModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">
                  <i className="bi bi-play-circle me-2"></i>
                  Example Video
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExampleVideoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/lZfgKpY076A"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowExampleVideoModal(false)}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}






    </div>


  );
}

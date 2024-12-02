import NudgeControls from "./Sequencer/SequencerPadView/SequencerControls/NudgeControls";

const ExamplePad = () => (
  <div
    className="d-inline-block mx-2"
    style={{
      width: '30px',
      aspectRatio: '1',
      backgroundColor: '#e9ecef',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: 'none',
      transition: 'background-color 0.3s ease',
    }}
  >
    <span className="text-dark" style={{
      position: 'absolute',
      bottom: '6px',
      right: '4px',
      fontSize: '0.7rem',
      opacity: 0.7,
      userSelect: 'none'
    }}>
      1
    </span>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '5px',
      backgroundColor: 'lightgrey',
    }} />
  </div>
);

const ExampleNudgeControls = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', maxWidth: '400px' }}>
      <div className="d-flex flex-wrap align-items-center gap-2">
        <label htmlFor="nudgeSlider" style={{ fontWeight: 500 }}>Nudge:</label>
        <div style={{ position: 'relative', flex: '1', minWidth: '50px' }}>
          {/* Background track */}
          <div style={{
            position: 'absolute',
            bottom: 13,
            left: 0,
            width: '100%',
            height: '5px',
            backgroundColor: 'lightgrey',
          }} />
          {/* Nudge value bar */}
          <div style={{
            position: 'absolute',
            bottom: 13,
            left: '50%',
            width: '13%',
            height: '5px',
            backgroundColor: '#007bff',
          }} />
          <input
            id="nudgeSlider"
            type="range"
            value="640"
            min="0"
            max="1000"
            disabled
            style={{
              position: 'relative',
              width: '100%',
              height: '20px',
              WebkitAppearance: 'none',
              background: 'transparent',
              pointerEvents: 'none',
              marginTop: '6px'
            }}
          />
        </div>
        <span style={{ minWidth: '60px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px' }}>
          0.030s
        </span>
      </div>
      <div className="d-flex flex-wrap justify-content-center gap-1">
        <button className="btn btn-outline-light btn-sm">-0.001s</button>
        <button className="btn btn-outline-light btn-sm">-0.01s</button>
        <button className="btn btn-outline-light btn-sm" style={{ width: '70px' }}>Zero</button>
        <button className="btn btn-outline-light btn-sm">+0.01s</button>
        <button className="btn btn-outline-light btn-sm">+0.001s</button>
      </div>
    </div>
  );
};






export default function About() {
  return (
    <div className="container mt-4 ps-4 pe-4">
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
          Youtube Sequencer removes these barriers - just paste a URL and start creating. It's immediate,
          experimental, and most importantly, fun.
        </p>
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
                      <td><kbd>1-9</kbd></td>
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
            <span className="ms-4">Press play to hear your sequence</span>
          </li>
          <li className="list-group-item bg-transparent text-light d-flex align-items-center py-3 position-relative">
            <span className="ms-4">Add more videos to create a full composition</span>
          </li>
        </ol>
      </section>

      <section className="mb-5">
        <h3>Nudge Controls</h3>
        <p>
          After selecting a pad, use the nudge controls to adjust the timing of a seek command
          (<i className="bi bi-1-square-fill"></i> - <i className="bi bi-9-square-fill"></i>)
          with millisecond precision. For example, a pad with a seek command of <i className="bi bi-1-square-fill ms-1 me-1"></i> and a nudge value of <span style={{ fontFamily: 'monospace' }}>0.030s</span> will seek to 10% of the video duration plus 30 milliseconds.
        </p>

        <div className="ms-4">
          <ExampleNudgeControls />
        </div>
      </section>


      <section className="mb-5">
        <h3>Features</h3>
        <ul className="list-group list-group-flush bg-transparent">
          <li className="list-group-item bg-transparent text-light">
            <i className="bi bi-grid me-2"></i>
            16-step sequencer grid
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
        </ul>
      </section>

      <section>
        <h3>Tips</h3>
        <ul className="list-group list-group-flush bg-transparent">
          <li className="list-group-item bg-transparent text-light">Try short videos for more precise timing</li>
          <li className="list-group-item bg-transparent text-light">Experiment with different video combinations</li>
          <li className="list-group-item bg-transparent text-light">Use the mute buttons to isolate specific tracks</li>
        </ul>
      </section>
    </div>
  );
}

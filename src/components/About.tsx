export default function About() {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">How To Use Youtube Sequencer</h2>
        
        <section className="mb-5">
          <h3>What is Youtube Sequencer?</h3>
          <p>
            Youtube Sequencer is a creative tool that lets you make music using Youtube videos as your instruments. 
            Think of it as a drum machine, but instead of drum sounds, you're using any Youtube video as a sound source.
          </p>
        </section>
  
        <section className="mb-5">
          <h3>Getting Started</h3>
          <ol className="list-group list-group-numbered list-group-flush bg-transparent">
            <li className="list-group-item bg-transparent text-light">Paste a Youtube URL into one of the track slots</li>
            <li className="list-group-item bg-transparent text-light">Click the squares in the grid to create a pattern</li>
            <li className="list-group-item bg-transparent text-light">Press play to hear your sequence</li>
            <li className="list-group-item bg-transparent text-light">Add more videos to create a full composition</li>
          </ol>
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
  
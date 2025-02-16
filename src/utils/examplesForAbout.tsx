export const ExamplePad = () => (
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

export const ExampleNudgeControls = () => {
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

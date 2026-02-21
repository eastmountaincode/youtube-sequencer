export const ExamplePad = () => (
    <div
        className="d-inline-block mx-2"
        style={{
            width: '24px',
            aspectRatio: '1',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}
    >
        <span style={{
            position: 'absolute',
            bottom: '2px',
            right: '3px',
            fontSize: '8px',
            color: 'var(--text-muted)',
            userSelect: 'none'
        }}>
            1
        </span>
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            backgroundColor: 'var(--accent)',
        }} />
    </div>
);

export const ExampleNudgeControls = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            maxWidth: '350px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    NUDGE
                </label>
                <div style={{ position: 'relative', flex: '1', minWidth: '50px' }}>
                    <div style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--bg-tertiary)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        width: '13%',
                        height: '4px',
                        backgroundColor: 'var(--accent)',
                    }} />
                    <input
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
                        }}
                    />
                </div>
                <span style={{
                    minWidth: '50px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: 'var(--accent)'
                }}>
                    0.030s
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                {['-0.01', '-0.001', '0', '+0.001', '+0.01'].map(val => (
                    <button
                        key={val}
                        style={{
                            padding: '4px 8px',
                            backgroundColor: val === '0' ? 'var(--accent)' : 'transparent',
                            border: '1px solid var(--border-color)',
                            color: val === '0' ? '#000' : 'var(--text-secondary)',
                            fontSize: '9px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        {val}
                    </button>
                ))}
            </div>
        </div>
    );
};

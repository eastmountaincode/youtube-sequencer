import './KeyboardDiagram.css';

type Cat = 'timestamp' | 'playback' | 'seek' | 'mute' | 'quick-mute' | 'bank' | 'speed' | 'nav' | 'utility';

interface KeyProps {
  label: string;
  sub?: string;
  w?: number;
  cat?: Cat;
}

function Key({ label, sub, w = 1, cat }: KeyProps) {
  const width = w * 43 - 3;
  return (
    <div
      className={`kb-key${cat ? ` kb-${cat}` : ''}`}
      style={{ width: `${width}px` }}
    >
      <span className="kb-label">{label}</span>
      {sub && <span className="kb-sub">{sub}</span>}
    </div>
  );
}

const LEGEND: { title: string; items: { cat: Cat; label: string }[] }[] = [
  {
    title: 'Pad Commands',
    items: [
      { cat: 'timestamp', label: 'Timestamp Jump' },
      { cat: 'playback', label: 'Play / Pause' },
      { cat: 'seek', label: 'Seek ±5s' },
      { cat: 'mute', label: 'Mute / Unmute' },
      { cat: 'utility', label: 'Clear Pad' },
    ],
  },
  {
    title: 'Performance',
    items: [
      { cat: 'quick-mute', label: 'Quick Mute Track' },
      { cat: 'bank', label: 'Bank Switch A/B' },
      { cat: 'speed', label: 'Speed Control' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { cat: 'nav', label: 'Navigate Pads' },
    ],
  },
];

export default function KeyboardDiagram() {
  return (
    <div className="kb-diagram">
      <div className="kb-body">
        <div className="kb-main">
          {/* Number row */}
          <div className="kb-row">
            <Key label="~" />
            <Key label="1" sub="10%" cat="timestamp" />
            <Key label="2" sub="20%" cat="timestamp" />
            <Key label="3" sub="30%" cat="timestamp" />
            <Key label="4" sub="40%" cat="timestamp" />
            <Key label="5" sub="50%" cat="timestamp" />
            <Key label="6" sub="60%" cat="timestamp" />
            <Key label="7" sub="70%" cat="timestamp" />
            <Key label="8" sub="80%" cat="timestamp" />
            <Key label="9" sub="90%" cat="timestamp" />
            <Key label="0" sub="0%" cat="timestamp" />
            <Key label="-" />
            <Key label="=" />
            <Key label="⌫" sub="clear" w={2} cat="utility" />
          </div>

          {/* QWERTY row */}
          <div className="kb-row">
            <Key label="Tab" w={1.5} />
            <Key label="Q" />
            <Key label="W" />
            <Key label="E" sub="T1 A/B" cat="bank" />
            <Key label="R" sub="T2 A/B" cat="bank" />
            <Key label="T" />
            <Key label="Y" sub="T1" cat="quick-mute" />
            <Key label="U" sub="T2" cat="quick-mute" />
            <Key label="I" />
            <Key label="O" sub="pause" cat="playback" />
            <Key label="P" sub="play" cat="playback" />
            <Key label="[" sub="◀ 5s" cat="seek" />
            <Key label="]" sub="5s ▶" cat="seek" />
            <Key label="\\" w={1.5} />
          </div>

          {/* Home row */}
          <div className="kb-row">
            <Key label="Caps" w={1.75} />
            <Key label="A" />
            <Key label="S" />
            <Key label="D" sub="T3 A/B" cat="bank" />
            <Key label="F" sub="T4 A/B" cat="bank" />
            <Key label="G" />
            <Key label="H" sub="T3" cat="quick-mute" />
            <Key label="J" sub="T4" cat="quick-mute" />
            <Key label="K" />
            <Key label="L" />
            <Key label=";" />
            <Key label="'" />
            <Key label="Enter" w={2.25} />
          </div>

          {/* Bottom alpha row */}
          <div className="kb-row">
            <Key label="Shift" w={2.25} />
            <Key label="Z" sub=".5×" cat="speed" />
            <Key label="X" sub=".75×" cat="speed" />
            <Key label="C" sub="1×" cat="speed" />
            <Key label="V" sub="1.25×" cat="speed" />
            <Key label="B" sub="1.5×" cat="speed" />
            <Key label="N" sub="unmute" cat="mute" />
            <Key label="M" sub="mute" cat="mute" />
            <Key label="," sub="2×" cat="speed" />
            <Key label="." />
            <Key label="/" />
            <Key label="Shift" w={2.75} />
          </div>

          {/* Space bar row */}
          <div className="kb-row">
            <Key label="Ctrl" w={1.25} />
            <Key label="Opt" w={1.25} />
            <Key label="Cmd" w={1.25} />
            <Key label="" w={6.25} />
            <Key label="Cmd" w={1.25} />
            <Key label="Opt" w={1.25} />
            <Key label="Ctrl" w={1.25} />
          </div>
        </div>

        {/* Arrow keys */}
        <div className="kb-side">
          <div className="kb-arrow-top">
            <Key label="↑" cat="nav" />
          </div>
          <div className="kb-arrow-bottom">
            <Key label="←" cat="nav" />
            <Key label="↓" cat="nav" />
            <Key label="→" cat="nav" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="kb-legend">
        {LEGEND.map((group) => (
          <div key={group.title} className="kb-legend-group">
            <h5>{group.title}</h5>
            <div className="kb-legend-items">
              {group.items.map((item) => (
                <div key={item.cat} className="kb-legend-item">
                  <span className={`kb-swatch kb-${item.cat}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

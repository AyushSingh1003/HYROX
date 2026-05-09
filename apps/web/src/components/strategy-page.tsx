import { breathingProtocol, heartRateZones, stationSplits, stationTargets } from "@hyrox/shared";

export function StrategyPage() {
  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Race Execution</div>
          <h1>HYROX strategy board</h1>
        </div>
        <div className="chip-row">
          <span className="chip green">Transitions under 3:00</span>
          <span className="chip">Run together</span>
          <span className="chip">No early redline</span>
        </div>
      </header>

      <section className="grid grid-2">
        <div className="table-wrap">
          <div className="section-title">
            <h2>Doubles station split</h2>
          </div>
          <table className="split-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>You</th>
                <th>Partner</th>
                <th>Cue</th>
              </tr>
            </thead>
            <tbody>
              {stationSplits.map((split) => (
                <tr key={split.station}>
                  <td><strong>{split.station}</strong></td>
                  <td>{split.you}</td>
                  <td>{split.partner}</td>
                  <td className="muted">{split.coachingCue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrap">
          <div className="section-title">
            <h2>Target station times</h2>
          </div>
          <table className="split-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Goal</th>
              </tr>
            </thead>
            <tbody>
              {stationTargets.map((target) => (
                <tr key={target.station}>
                  <td><strong>{target.station}</strong></td>
                  <td>{target.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="eyebrow">Run pacing</div>
          <h2>Partner pace governs</h2>
          <ul>
            <li>First 4 km: 5:00-5:10/km</li>
            <li>Middle: 5:05-5:20/km</li>
            <li>Final 2 km: empty tank progressively</li>
            <li>No repeated surges</li>
          </ul>
        </div>
        <div className="card">
          <div className="eyebrow">Transitions</div>
          <h2>Free speed</h2>
          <ul>
            <li>Walk directly to the next station</li>
            <li>No standing still</li>
            <li>Call the split before arriving</li>
            <li>Practice transitions weekly</li>
          </ul>
        </div>
        <div className="card">
          <div className="eyebrow">Side stitch protocol</div>
          <h2>Breathing discipline</h2>
          <ul>
            {breathingProtocol.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="section-title">
          <h2>Heart-rate and pace zones</h2>
        </div>
        <div className="grid grid-3">
          {heartRateZones.map((zone) => (
            <div className="block" key={zone.name}>
              <strong>{zone.name}</strong>
              <ul>
                <li>{zone.effort}</li>
                <li>You: {zone.you}</li>
                <li>Partner: {zone.partner}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


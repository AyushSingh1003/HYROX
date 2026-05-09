"use client";

import { Maximize2, Pause, Play, RotateCcw, SkipForward, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatTimer } from "../lib/format";

const presets = [
  { label: "Countdown", mode: "Countdown", seconds: 600, rounds: 1 },
  { label: "Interval", mode: "Work", seconds: 300, rest: 90, rounds: 6 },
  { label: "EMOM", mode: "EMOM", seconds: 60, rounds: 12 },
  { label: "AMRAP", mode: "AMRAP", seconds: 900, rounds: 1 },
  { label: "Station", mode: "Station", seconds: 240, rest: 45, rounds: 8 }
];

export function TimerPanel({ initialSeconds = 600 }: { initialSeconds?: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState({ ...presets[0], seconds: initialSeconds });
  const [round, setRound] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          if ("vibrate" in navigator) navigator.vibrate?.([180, 80, 180]);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const progress = useMemo(() => {
    if (!selected.seconds) return 0;
    return Math.round(((selected.seconds - seconds) / selected.seconds) * 100);
  }, [seconds, selected]);

  function choosePreset(preset: typeof presets[number]) {
    setRunning(false);
    setSelected(preset);
    setSeconds(preset.seconds);
    setRound(1);
  }

  function skipRound() {
    if (round < selected.rounds) {
      setRound((value) => value + 1);
      setSeconds(selected.seconds);
      if ("vibrate" in navigator) navigator.vibrate?.(80);
    } else {
      setRunning(false);
      setSeconds(0);
    }
  }

  return (
    <div className={`card timer-panel ${fullscreen ? "timer-fullscreen" : ""}`}>
      <div className="section-title">
        <div>
          <div className="eyebrow">HYROX Timer</div>
          <h2>Work / rest control</h2>
        </div>
        <span className="chip green">Round {round}/{selected.rounds} - {progress}%</span>
      </div>

      <div className="tabs" role="tablist" aria-label="Timer presets">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className={`tab ${selected.label === preset.label ? "active" : ""}`}
            type="button"
            onClick={() => choosePreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="timer-face">
        <div>
          <div className="eyebrow">{selected.mode}</div>
          <div className="timer-time">{formatTimer(seconds)}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn primary" type="button" onClick={() => setRunning((value) => !value)}>
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? "Pause" : "Start"}
        </button>
        <button className="btn" type="button" onClick={() => setSeconds(selected.seconds)}>
          <RotateCcw size={18} />
          Reset
        </button>
        <button className="btn ghost" type="button" onClick={skipRound}>
          <SkipForward size={18} />
          Skip
        </button>
        <button className="btn ghost" type="button" onClick={() => choosePreset({ label: "Station rest", mode: "Rest", seconds: 90, rounds: 1 })}>
          <TimerReset size={18} />
          Rest
        </button>
        <button className="btn ghost" type="button" onClick={() => setFullscreen((value) => !value)}>
          <Maximize2 size={18} />
          Full
        </button>
      </div>
    </div>
  );
}

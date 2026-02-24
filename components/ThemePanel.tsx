"use client";

import { useEffect, useState } from "react";

type ThemeName = "red" | "purple" | "dark" | "cyan" | "gold" | "emerald" | "blue";
type BgStyle = "vct" | "grid" | "noise" | "none";

type Settings = {
  theme: ThemeName;
  bg: BgStyle;
  intensity: number;
  reduceMotion: boolean;
};

const KEY = "fh_settings_v2";

const DEFAULTS: Settings = {
  theme: "red",
  bg: "vct",
  intensity: 0.85,
  reduceMotion: false,
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const j = JSON.parse(raw);
      setS({
        ...DEFAULTS,
        ...j,
        intensity: clamp(Number(j.intensity ?? DEFAULTS.intensity), 0, 1),
      });
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    // notify BackgroundLayer to update instantly
    try { window.dispatchEvent(new Event("fh:settings")); } catch {}
    document.documentElement.setAttribute("data-theme", s.theme);
  }, [s]);

  const Chip = ({ active, children, onClick }: any) => (
    <button className={`fh-chip ${active ? "active" : ""}`} onClick={onClick} type="button">
      {children}
    </button>
  );

  return (
    <div style={{ position: "relative" }}>
      <button
        className="fh-gear"
        onClick={() => setOpen(v => !v)}
        aria-label="Configurações"
        title="Configurações"
        style={{
          width: 36, height: 36, borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.35)",
          color: "white",
          display: "grid", placeItems: "center",
          cursor: "pointer"
        }}
      >
        {open ? "✕" : "⚙️"}
      </button>

      {open ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            width: 330,
            padding: 12,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(10,10,14,0.88)",
            backdropFilter: "blur(10px)",
            zIndex: 50
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Personalização</div>

          <div style={{ opacity: .8, marginTop: 10 }}>Tema</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {(["red","purple","dark","cyan","gold","emerald","blue"] as ThemeName[]).map(t => (
              <Chip key={t} active={s.theme === t} onClick={() => setS(v => ({...v, theme: t}))}>
                {t.toUpperCase()}
              </Chip>
            ))}
          </div>

          <div style={{ opacity: .8, marginTop: 14 }}>Fundo</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {(["vct","grid","noise","none"] as BgStyle[]).map(bg => (
              <Chip key={bg} active={s.bg === bg} onClick={() => setS(v => ({...v, bg}))}>
                {bg === "vct" ? "VCT" : bg === "grid" ? "GRID" : bg === "noise" ? "NOISE" : "OFF"}
              </Chip>
            ))}
          </div>

          <div style={{ opacity: .8, marginTop: 14 }}>Intensidade {Math.round(s.intensity * 100)}%</div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(s.intensity * 100)}
            onChange={(e) => setS(v => ({...v, intensity: clamp(Number(e.target.value)/100, 0, 1)}))}
            style={{ width: "100%" }}
          />

          <div style={{ display:"flex", gap: 8, flexWrap:"wrap", marginTop: 14 }}>
            <Chip active={s.reduceMotion} onClick={() => setS(v => ({...v, reduceMotion: !v.reduceMotion}))}>
              Reduce Motion {s.reduceMotion ? "ON" : "OFF"}
            </Chip>
            <Chip active={false} onClick={() => setS(DEFAULTS)}>
              Reset
            </Chip>
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Fundo + tema ficam salvos no seu dispositivo.
          </p>

          <style jsx>{`
            .fh-chip{
              padding: 8px 10px;
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.12);
              background: rgba(255,255,255,0.06);
              color: white;
              cursor: pointer;
              font-weight: 900;
              font-size: 12px;
              letter-spacing: .02em;
            }
            .fh-chip.active{
              border-color: rgba(var(--accent),0.55);
              box-shadow: 0 0 0 2px rgba(var(--accent),0.18) inset;
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
}

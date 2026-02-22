"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeName = "red" | "purple" | "dark" | "cyan" | "gold" | "emerald" | "blue";
type BgStyle = "gradient" | "particles" | "broadcast" | "grid";

type Settings = {
  theme: ThemeName;
  bg: BgStyle;
  intensity: number; // 0..1
  speed: number; // 0.5..2
  vignette: boolean;
  noise: boolean;
  reduceMotion: boolean;
};

const STORAGE_KEY = "fh_settings_v2";

const DEFAULTS: Settings = {
  theme: "red",
  bg: "gradient",
  intensity: 0.82,
  speed: 0.95,
  vignette: false,
  noise: true,
  reduceMotion: false,
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function safeParse(json: string | null): Settings | null {
  if (!json) return null;
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return null;
    return {
      ...DEFAULTS,
      ...obj,
      intensity: clamp(Number(obj.intensity ?? DEFAULTS.intensity), 0, 1),
      speed: clamp(Number(obj.speed ?? DEFAULTS.speed), 0.5, 2),
    } as Settings;
  } catch {
    return null;
  }
}

function applyThemeToDom(theme: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // ✅ helper que estava faltando (corrige o erro do build)
  const setTheme = (t: ThemeName) => {
    setSettings((s) => ({ ...s, theme: t }));
  };

  // Persist + apply
  useEffect(() => {
    const saved = safeParse(typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null);
    if (saved) setSettings(saved);
  }, []);

  useEffect(() => {
    applyThemeToDom(settings.theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const icon = useMemo(() => (open ? "✕" : "⚙️"), [open]);

  return (
    <div className="fh-panel-root" style={{ position: "relative" }}>
      <button
        className="fh-gear"
        onClick={() => setOpen((v) => !v)}
        aria-label="Configurações"
        title="Configurações"
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.35)",
          color: "white",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
      >
        {icon}
      </button>

      {open ? (
        <div
          className="fh-panel"
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            width: 320,
            padding: 12,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(10,10,14,0.85)",
            backdropFilter: "blur(10px)",
            color: "white",
            zIndex: 50,
          }}
        >
          <div className="fh-panel-label" style={{ fontWeight: 800, marginBottom: 8 }}>
            Personalização
          </div>

          <div className="fh-panel-label" style={{ opacity: 0.8, marginTop: 10 }}>
            Tema
          </div>
          <div className="fh-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button className={`fh-chip ${settings.theme === "red" ? "active" : ""}`} onClick={() => setTheme("red")}>
              Red
            </button>
            <button className={`fh-chip ${settings.theme === "purple" ? "active" : ""}`} onClick={() => setTheme("purple")}>
              Purple
            </button>
            <button className={`fh-chip ${settings.theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>
              Dark
            </button>
            <button className={`fh-chip ${settings.theme === "cyan" ? "active" : ""}`} onClick={() => setTheme("cyan")}>
              Cyan
            </button>
            <button className={`fh-chip ${settings.theme === "gold" ? "active" : ""}`} onClick={() => setTheme("gold")}>
              Gold
            </button>
            <button className={`fh-chip ${settings.theme === "emerald" ? "active" : ""}`} onClick={() => setTheme("emerald")}>
              Emerald
            </button>
            <button className={`fh-chip ${settings.theme === "blue" ? "active" : ""}`} onClick={() => setTheme("blue")}>
              Blue
            </button>
          </div>

          <div className="fh-panel-label" style={{ opacity: 0.8, marginTop: 14 }}>
            Estilo
          </div>
          <div className="fh-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {(["gradient", "particles", "broadcast", "grid"] as BgStyle[]).map((bg) => (
              <button
                key={bg}
                className={`fh-chip ${settings.bg === bg ? "active" : ""}`}
                onClick={() => setSettings((s) => ({ ...s, bg }))}
              >
                {bg === "gradient" ? "Gradiente" : bg === "particles" ? "Partículas" : bg === "broadcast" ? "Broadcast" : "Grid Neon"}
              </button>
            ))}
          </div>

          <div className="fh-panel-label" style={{ opacity: 0.8, marginTop: 14 }}>
            Intensidade {Math.round(settings.intensity * 100)}%
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.intensity * 100)}
            onChange={(e) => setSettings((s) => ({ ...s, intensity: clamp(Number(e.target.value) / 100, 0, 1) }))}
            style={{ width: "100%" }}
          />

          <div className="fh-panel-label" style={{ opacity: 0.8, marginTop: 14 }}>
            Velocidade {settings.speed.toFixed(2)}x
          </div>
          <input
            type="range"
            min={50}
            max={200}
            value={Math.round(settings.speed * 100)}
            onChange={(e) => setSettings((s) => ({ ...s, speed: clamp(Number(e.target.value) / 100, 0.5, 2) }))}
            style={{ width: "100%" }}
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <button className={`fh-chip ${settings.vignette ? "active" : ""}`} onClick={() => setSettings((s) => ({ ...s, vignette: !s.vignette }))}>
              Vignette {settings.vignette ? "ON" : "OFF"}
            </button>
            <button className={`fh-chip ${settings.noise ? "active" : ""}`} onClick={() => setSettings((s) => ({ ...s, noise: !s.noise }))}>
              Noise {settings.noise ? "ON" : "OFF"}
            </button>
            <button
              className={`fh-chip ${settings.reduceMotion ? "active" : ""}`}
              onClick={() => setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }))}
            >
              Reduce motion {settings.reduceMotion ? "ON" : "OFF"}
            </button>
            <button className="fh-chip" onClick={() => setSettings(DEFAULTS)}>
              Reset
            </button>
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Dica: no mobile, toque no ⚙️ para abrir/fechar. Preferências ficam salvas.
          </p>

          <style jsx>{`
            .fh-chip{
              padding: 8px 10px;
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.12);
              background: rgba(255,255,255,0.06);
              color: white;
              cursor: pointer;
              font-weight: 700;
              font-size: 12px;
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

"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "red" | "purple" | "dark" | "cyan" | "gold" | "emerald" | "blue";
type Style = "gradient" | "particles" | "broadcast" | "grid";

type Settings = {
  theme: Theme;
  style: Style;
  intensity: number; // 0..1
  speed: number; // 0.5..2
  vignette: boolean;
  noise: boolean;
  reduceMotion: boolean;
};

const STORAGE_KEY = "fivehub-ui";

const DEFAULTS: Settings = {
  theme: "red",
  style: "broadcast",
  intensity: 0.82,
  speed: 0.95,
  vignette: true,
  noise: true,
  reduceMotion: false,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ThemePanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("fivehub:toggle-theme-panel", onToggle as any);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("fivehub:toggle-theme-panel", onToggle as any);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  const styleClass = useMemo(() => {
    switch (settings.style) {
      case "particles":
        return "bg-style-particles";
      case "broadcast":
        return "bg-style-broadcast";
      case "grid":
        return "bg-style-grid";
      default:
        return ""; // gradient
    }
  }, [settings.style]);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          intensity:
            typeof parsed.intensity === "number"
              ? clamp(parsed.intensity, 0, 1)
              : prev.intensity,
          speed:
            typeof parsed.speed === "number"
              ? clamp(parsed.speed, 0.5, 2)
              : prev.speed,
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  // apply
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", settings.theme);

    root.classList.remove("bg-style-particles", "bg-style-broadcast", "bg-style-grid");
    if (styleClass) root.classList.add(styleClass);

    root.style.setProperty("--bg-intensity", String(settings.intensity));
    root.style.setProperty("--bg-speed", String(settings.speed));
    root.style.setProperty("--bg-vignette", settings.vignette ? "1" : "0");
    root.style.setProperty("--bg-noise", settings.noise ? "1" : "0");

    if (settings.reduceMotion) root.classList.add("fh-reduce-motion");
    else root.classList.remove("fh-reduce-motion");

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, styleClass]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.querySelector("#fh-reduce-motion-style")) {
      const style = document.createElement("style");
      style.id = "fh-reduce-motion-style";
      style.innerHTML = `
        html.fh-reduce-motion body::before,
        html.fh-reduce-motion body::after { animation: none !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const reset = () => setSettings(DEFAULTS);

  return (
    <div className={`fh-theme-panel ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="fh-panel-header">
        <div>
          <div className="fh-panel-title">Personalização</div>
          <div className="fh-panel-subtitle">Tema • Background • Motion</div>
        </div>
        <button className="btn-icon" onClick={() => setOpen(false)} aria-label="Fechar">✕</button>
      </div>

      <div className="fh-panel-body">
        <div className="fh-panel-group">
          <div className="fh-panel-label">Tema</div>
          <div className="fh-grid fh-grid-themes">
            <button className={`fh-chip ${settings.theme === "red" ? "active" : ""}`} onClick={() => set("theme","red")}>🔴 Red</button>
            <button className={`fh-chip ${settings.theme === "purple" ? "active" : ""}`} onClick={() => set("theme","purple")}>🟣 Purple</button>
            <button className={`fh-chip ${settings.theme === "dark" ? "active" : ""}`} onClick={() => set("theme","dark")}>⚫ Dark</button>
            <button className={`fh-chip ${settings.theme === "cyan" ? "active" : ""}`} onClick={() => set("theme","cyan")}>🩵 Cyan</button>
            <button className={`fh-chip ${settings.theme === "gold" ? "active" : ""}`} onClick={() => set("theme","gold")}>🟡 Gold</button>
            <button className={`fh-chip ${settings.theme === "emerald" ? "active" : ""}`} onClick={() => set("theme","emerald")}>🟢 Emerald</button>
            <button className={`fh-chip ${settings.theme === "blue" ? "active" : ""}`} onClick={() => set("theme","blue")}>🔵 Blue</button>
          </div>
        </div>

        <div className="fh-panel-group">
          <div className="fh-panel-label">Estilo</div>
          <div className="fh-grid">
            <button className={`fh-chip ${settings.style === "gradient" ? "active" : ""}`} onClick={() => set("style","gradient")}>Gradiente</button>
            <button className={`fh-chip ${settings.style === "particles" ? "active" : ""}`} onClick={() => set("style","particles")}>Partículas</button>
            <button className={`fh-chip ${settings.style === "broadcast" ? "active" : ""}`} onClick={() => set("style","broadcast")}>Broadcast</button>
            <button className={`fh-chip ${settings.style === "grid" ? "active" : ""}`} onClick={() => set("style","grid")}>Grid Neon</button>
          </div>
        </div>

        <div className="fh-panel-group">
          <div className="fh-slider-row">
            <span className="fh-panel-label">Intensidade</span>
            <span className="fh-panel-value">{Math.round(settings.intensity * 100)}%</span>
          </div>
          <input className="fh-slider" type="range" min={0} max={1} step={0.01} value={settings.intensity}
            onChange={(e) => set("intensity", Number(e.target.value))} />
        </div>

        <div className="fh-panel-group">
          <div className="fh-slider-row">
            <span className="fh-panel-label">Velocidade</span>
            <span className="fh-panel-value">{settings.speed.toFixed(2)}x</span>
          </div>
          <input className="fh-slider" type="range" min={0.5} max={2} step={0.01} value={settings.speed}
            onChange={(e) => set("speed", Number(e.target.value))} />
        </div>

        <div className="fh-panel-group">
          <div className="fh-row fh-row-wrap">
            <button className={`fh-toggle ${settings.vignette ? "on" : ""}`} onClick={() => set("vignette", !settings.vignette)}>Vignette {settings.vignette ? "ON" : "OFF"}</button>
            <button className={`fh-toggle ${settings.noise ? "on" : ""}`} onClick={() => set("noise", !settings.noise)}>Noise {settings.noise ? "ON" : "OFF"}</button>
            <button className={`fh-toggle ${settings.reduceMotion ? "on" : ""}`} onClick={() => set("reduceMotion", !settings.reduceMotion)}>Reduce motion {settings.reduceMotion ? "ON" : "OFF"}</button>
            <button className="fh-toggle" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="fh-panel-footnote">
          Dica: clique na ⚙️ no topo (perto do Login) para abrir/fechar. Preferências ficam salvas.
        </div>
      </div>
    </div>
  );
}

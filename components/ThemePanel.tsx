"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "red" | "purple";
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
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] rounded-full px-4 py-3 bg-black/70 border border-white/10 backdrop-blur hover:border-white/20"
        aria-label="Abrir painel de tema"
      >
        🎛️
      </button>

      <div
        className={`fixed bottom-20 right-5 z-[60] w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl transition ${
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Personalização</div>
            <div className="text-xs opacity-70">Tema • Background • Motion</div>
          </div>
          <button onClick={() => setOpen(false)} className="text-sm opacity-80 hover:opacity-100">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide opacity-70">Tema</div>
            <div className="flex gap-2">
              <button
                onClick={() => set("theme", "red")}
                className={`flex-1 rounded-lg px-3 py-2 border ${
                  settings.theme === "red" ? "border-red-500/60 bg-red-500/15" : "border-white/10 bg-white/5"
                }`}
              >
                🔴 Red VCT
              </button>
              <button
                onClick={() => set("theme", "purple")}
                className={`flex-1 rounded-lg px-3 py-2 border ${
                  settings.theme === "purple" ? "border-purple-500/60 bg-purple-500/15" : "border-white/10 bg-white/5"
                }`}
              >
                🟣 Purple VCT
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide opacity-70">Estilo</div>
            <div className="grid grid-cols-2 gap-2">
              {(["gradient", "particles", "broadcast", "grid"] as Style[]).map((st) => (
                <button
                  key={st}
                  onClick={() => set("style", st)}
                  className={`rounded-lg px-3 py-2 border text-sm ${
                    settings.style === st ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  {st === "gradient" && "Gradiente"}
                  {st === "particles" && "Partículas"}
                  {st === "broadcast" && "Broadcast"}
                  {st === "grid" && "Grid Neon"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-70">
                <span>Intensidade</span>
                <span className="opacity-80">{Math.round(settings.intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={settings.intensity}
                onChange={(e) => set("intensity", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-70">
                <span>Velocidade</span>
                <span className="opacity-80">{settings.speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={settings.speed}
                onChange={(e) => set("speed", Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Toggle label="Vignette" value={settings.vignette} onChange={(v) => set("vignette", v)} />
            <Toggle label="Noise" value={settings.noise} onChange={(v) => set("noise", v)} />
            <Toggle label="Reduce motion" value={settings.reduceMotion} onChange={(v) => set("reduceMotion", v)} />
            <button onClick={reset} className="rounded-lg px-3 py-2 border border-white/10 bg-white/5 text-sm">
              Reset
            </button>
          </div>

          <div className="text-[11px] opacity-60">
            Dica: no mobile, toque no 🎛️ para abrir/fechar. Preferências ficam salvas.
          </div>
        </div>
      </div>
    </>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`rounded-lg px-3 py-2 border text-sm flex items-center justify-between ${
        value ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5"
      }`}
    >
      <span>{label}</span>
      <span className="opacity-80">{value ? "ON" : "OFF"}</span>
    </button>
  );
}

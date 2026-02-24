"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeName = "red" | "purple" | "dark" | "cyan" | "gold" | "emerald" | "blue";
type BgStyle = "vct" | "grid" | "noise" | "none";

type Settings = {
  theme: ThemeName;
  bg: BgStyle;
  intensity: number; // 0..1
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

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const j = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...j,
      intensity: clamp(Number(j.intensity ?? DEFAULTS.intensity), 0, 1),
      reduceMotion: Boolean(j.reduceMotion ?? DEFAULTS.reduceMotion),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function BackgroundLayer() {
  const [s, setS] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    setS(readSettings());

    const onCustom = () => setS(readSettings());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setS(readSettings());
    };

    window.addEventListener("fh:settings", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("fh:settings", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", s.theme);
    document.documentElement.setAttribute("data-bg", s.bg);
  }, [s.theme, s.bg]);

  const style = useMemo(() => {
    const o = s.intensity;
    const anim = s.reduceMotion ? "none" : undefined;
    return { ["--kzOpacity" as any]: o, ["--kzAnim" as any]: anim } as any;
  }, [s.intensity, s.reduceMotion]);

  return <div className="kz-bg" style={style} aria-hidden="true" />;
}

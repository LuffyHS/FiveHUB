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

export default function BackgroundLayer() {
  const [s, setS] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const j = JSON.parse(raw);
      const next: Settings = {
        ...DEFAULTS,
        ...j,
        intensity: clamp(Number(j.intensity ?? DEFAULTS.intensity), 0, 1),
      };
      setS(next);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", s.theme);
  }, [s.theme]);

  const style = useMemo(() => {
    const o = s.intensity;
    const anim = s.reduceMotion ? "none" : undefined;
    return { ["--kzOpacity" as any]: o, ["--kzAnim" as any]: anim } as any;
  }, [s.intensity, s.reduceMotion]);

  return (
    <div className={`kz-bg kz-${s.bg}`} style={style} aria-hidden="true" />
  );
}

"use client";

import { useEffect, useState } from "react";

type ThemeName = "red" | "purple" | "dark" | "cyan" | "gold" | "emerald" | "blue";

const THEMES: { key: ThemeName; label: string }[] = [
  { key: "red", label: "Red" },
  { key: "purple", label: "Purple" },
  { key: "dark", label: "Dark" },
  { key: "cyan", label: "Cyan" },
  { key: "gold", label: "Gold" },
  { key: "emerald", label: "Emerald" },
  { key: "blue", label: "Blue" },
];

const STORAGE_KEY = "kz_theme";

export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeName>("red");

  useEffect(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) as ThemeName | null) || "red";
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, [theme]);

  return (
    <div className="kz-theme">
      <button
        type="button"
        className="kz-gear"
        aria-label="Configurações"
        title="Configurações"
        onClick={() => setOpen((v) => !v)}
      >
        ⚙️
      </button>

      {open ? (
        <div className="kz-panel">
          <div className="kz-panel-title">Tema</div>
          <div className="kz-panel-grid">
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`kz-chip ${theme === t.key ? "active" : ""}`}
                onClick={() => setTheme(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

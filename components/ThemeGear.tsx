"use client";

export function ThemeGear() {
  return (
    <button
      type="button"
      className="btn-icon"
      aria-label="Configurações do tema"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("fivehub:toggle-theme-panel"));
      }}
      title="Configurações"
    >
      ⚙️
    </button>
  );
}


"use client";

export default function ChampionsBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at center, #ff004c22, transparent 70%)",
        zIndex: -1,
      }}
    />
  );
}

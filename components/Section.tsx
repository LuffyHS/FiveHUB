import { ReactNode } from "react";

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section className="section" id={id}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

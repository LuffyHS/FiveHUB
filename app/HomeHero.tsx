
// app/(site)/_components/HomeHero.tsx
export default function HomeHero() {
  return (
    <section
      className="
        relative overflow-hidden
        min-h-[calc(100vh-var(--header-h))]
        pt-[var(--header-h)]
      "
    >
      {/* Background arena */}
      <div className="absolute inset-0 -z-10">
        <div
          className="
            absolute inset-0
            bg-[url('/images/arena-clean.jpg')]
            bg-cover bg-center
            scale-[1.03]
          "
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex min-h-[calc(100vh-var(--header-h))] items-center">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.22em] text-white/70">
              KILLZONE HUB
            </p>

            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
              O hub premium para tudo de Killzone.
            </h1>

            <p className="mt-5 text-pretty text-base text-white/75 md:text-lg">
              Notícias, guias, builds e conteúdo curado — com uma experiência cinematográfica.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/hub"
                className="
                  inline-flex items-center justify-center
                  rounded-full px-6 py-3 text-sm font-medium
                  bg-white text-black hover:bg-white/90
                  transition
                "
              >
                Entrar no HUB
              </a>

              <a
                href="/explorar"
                className="
                  inline-flex items-center justify-center
                  rounded-full px-6 py-3 text-sm font-medium
                  border border-white/20 text-white hover:border-white/35
                  bg-white/0 hover:bg-white/5
                  transition
                "
              >
                Explorar conteúdo
              </a>
            </div>

            <div className="mt-10 h-px w-64 bg-gradient-to-r from-white/0 via-white/35 to-white/0" />
          </div>
        </div>
      </div>
    </section>
  );
}

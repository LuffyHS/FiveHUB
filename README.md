# Killzone HUB Valorant (estrutura profissional)

Projeto em **Next.js (App Router)** pronto para **deploy na Vercel** com:
- páginas separadas (home, times, time, jogadores, jogador, login, perfil)
- funções serverless em `/app/api/*`
- login Discord (OAuth2) + sessão JWT (cookie httpOnly)
- Vercel KV (Redis) para salvar Riot ID por usuário
- proxy de imagens `/api/img` para evitar mixed content/hotlink + cache
- integrações: orlandomm (VLR) + vlrggapi (news/live/rankings/stats)

## Requisitos
- Node.js 18+
- Conta na Vercel
- App no Discord Developer Portal (OAuth2)

## Rodando localmente
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente
Veja `.env.example`.

## Deploy na Vercel + GitHub
1. Suba este repo no GitHub
2. Na Vercel: **New Project** → importe o repo
3. Configure as env vars (Vercel → Settings → Environment Variables)
4. Deploy

## Observações importantes (Tracker.gg / Riot)
- O **Tracker Network Developer API** é público, mas **não oferece VALORANT stats** para uso geral (há relatos oficiais no fórum deles).
- Neste MVP, o perfil salva Riot ID e fornece link para o perfil público do Tracker.
- Para stats “de verdade” no perfil, a rota recomendada é usar o **Riot Developer Portal** (VAL APIs) e/ou integrar um provedor autorizado.

## Próximos passos sugeridos
- Tier 1 real (VCT) via allowlist/cron (cache no KV)
- endpoint de agentes mais usados por player + cálculo de role 100% “VLR-like”
- roster automático (match player↔team) com normalização e cache
- favoritos + adsense + charts

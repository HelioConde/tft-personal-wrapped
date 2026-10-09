# QA — TFT Wrapped MVP

## Implementado automaticamente

- [x] PT-BR como padrão e EN persistente;
- [x] períodos 7 dias / 30 dias / Set;
- [x] atualização de métricas sem reload;
- [x] Riot API key fora do frontend;
- [x] fallback demonstrativo explícito;
- [x] loading, vazio, Riot ID inválido, 404, 429 e erro de upstream;
- [x] Browser E2E com payload TFT realista mockado;
- [x] viewport mobile 360px sem overflow horizontal;
- [x] card PNG compartilhável;
- [x] deep links de perfil/período/idioma;
- [x] workflow de QA;
- [x] workflow de GitHub Pages.

## Gate humano / produção

- [x] confirmar QA automático verde após integração ao endpoint direto `public-tft-profile`;
- [ ] **Habilitar Pages manualmente** em Settings → Pages → Source: GitHub Actions; falta permissão administrativa nesta conexão, por isso o deploy falha em `configure-pages`. Depois reexecutar o workflow e verificar publicação.
- [x] validar **backend real** `AlchemyFlames#BR1` com 20 partidas via [Live Riot Smoke](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37975786629);
- [ ] testar `AlchemyFlames#BR1` na **página publicada** após habilitar Pages;
- [ ] testar pelo menos mais 2 Riot IDs TFT;
- [ ] validar conta sem histórico recente;
- [ ] revisar nomes de traits/unidades/augments retornados pela Riot;
- [x] validar capturas de demo e painel preenchido (desktop/mobile) via [Visual Snapshot](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37976197891), sem overflow, imagens quebradas ou erros;
- [ ] revisar visual desktop/mobile **publicado** após habilitar Pages;
- [ ] gerar e compartilhar o PNG em navegador/celular real.

**MVP técnico funcional; publicação e homologação externa pendentes.** Novas features congeladas; abrir somente correções P0/P1, acessibilidade, segurança e compliance.

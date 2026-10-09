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
- [x] GitHub Pages habilitado pelo proprietário e [deploy publicado com sucesso](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978660982).
- [x] validar **backend real** `AlchemyFlames#BR1` com 20 partidas via [Live Riot Smoke](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37975786629);
- [x] [Navegador na página publicada com `AlchemyFlames#BR1`](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978819124): fluxo carregou e passou (1 teste). A API direta em separado confirmou 20 partidas.
- [ ] testar pelo menos mais 2 Riot IDs TFT;
- [ ] validar conta sem histórico recente;
- [ ] revisar nomes de traits/unidades/augments retornados pela Riot;
- [x] validar capturas de demo e painel preenchido (desktop/mobile) via [Visual Snapshot](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37976197891), sem overflow, imagens quebradas ou erros;
- [ ] revisar visual desktop/mobile **publicado** após habilitar Pages;
- [ ] gerar e compartilhar o PNG em navegador/celular real.

**MVP técnico publicado em beta; homologação humana e externa pendente.** Novas features congeladas; abrir somente correções P0/P1, acessibilidade, segurança e compliance.

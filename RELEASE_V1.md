# TFT Wrapped 1.0 — encerramento técnico e gate de publicação

**Data:** 09/10/2026
**Status:** núcleo funcional concluído e **publicado no GitHub Pages em 09/10/2026 como beta técnico**. O deploy e o teste da página real passaram; homologação de dispositivos, outros jogadores e requisitos Riot ainda é necessária antes de abertura comercial ampla.

## Evidências verificadas

- [x] **API TFT real:** `public-tft-profile` no Supabase gamer `bieihhaobdztjyoweewa` retornou HTTP 200 e **20 partidas reais** do Riot ID `AlchemyFlames#BR1` em ~9,2 segundos. [Live Riot Smoke](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37975786629).
- [x] **Erro identificado e eliminado:** `riot-legacy-tft-profile` esperava somente 5,5 segundos pelo endpoint interno e podia responder 200 com cache vazio antigo. O TFT Wrapped passou a consultar diretamente a função que retornou as partidas atuais; timeout cliente de 35 segundos.
- [x] **Browser QA:** [8 passed, 1 skipped intencional (smoke reservado à página publicada)](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37976440319).
- [x] **Capturas automáticas:** [Visual Snapshot](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37976197891) aprovou quatro estados: demonstração desktop/mobile e painel preenchido desktop/mobile com dados simulados no formato Riot. Todos **sem overflow, imagens quebradas, falhas de rede, erros de console ou alvos de toque abaixo do mínimo**. [Metadados](screenshots/metadata.json).
- [x] **Regressão de UX:** busca posterior vence resposta atrasada, Riot IDs acima do limite são rejeitados sem truncamento, fallback antigo recebe rótulo de cache e cache vazio não é classificado como ausência real de partidas.
- [x] **Limite dos dados:** semana/mês/set filtram uma **amostra de até 20 partidas recentes**; não apresentar os resultados como retrospectiva exaustiva de todo o set.
- [x] **Privacidade:** [página de transparência](privacidade.html) criada, aviso legal Riot incluído e publicidade sem aprovação ocultada. O navegador não contém chaves da Riot.
- [x] **Atualização de versão:** somente registros de SW e caches do escopo TFT Wrapped podem ser modificados, preservando os demais projetos do mesmo domínio.
- [x] **Histórico TFT:** renderização de métricas, comps, augments, unidades, recordes e PNG 1200×630 implementados; fluxo de UI coberto com dados mockados.

## Publicação — concluída

O proprietário habilitou **Settings → Pages → Source: GitHub Actions**; o repositório passou a informar `has_pages=true`.

- [x] [Deploy GitHub Pages passou](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978660982), commit `ffc06659dc4aa7d2c956f6def8a1dd86d5958b7d`.
- [x] [QA completo do workflow aprovado](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978736711).
- [x] [Teste de navegador publicado com Riot ID de teste aprovado](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978819124), 1 teste Playwright na página pública.
- [x] Publicação do conjunto mínimo de arquivos `index.html`, estilos, scripts e privacidade; `version.json` é carimbado com SHA de deploy real.
- [x] Workflow `Live Riot Smoke` dispara o teste da página após cada Pages bem-sucedido; a consulta de backend separada continua independente.

**Link:** https://helioconde.github.io/tft-personal-wrapped/

**Limite do teste publicado:** confirma renderização e fluxo da consulta na página real; o teste de backend em separado confirma 20 partidas. Não substitui teste de PNG no aparelho, outras regiões ou aprovação da Riot.

## Gates externos/humanos

- [x] Concluir Pages, publicar e executar teste de navegação no link de produção.
- [ ] Validar com dois outros Riot IDs que possuam partidas TFT, preferencialmente de regiões diferentes, e conta com 0 partidas recentes.
- [ ] Validar tradução dos nomes de traits/unidades/augments com dados reais de diferentes sets; a normalização atual remove prefixos técnicos e não substitui um dicionário oficial localizado.
- [ ] Exportar PNG e testar o compartilhamento em celular real; o fluxo em código não substitui o teste no aparelho.
- [ ] Confirmar a política Riot e as credenciais corretas para um lançamento público amplo; nenhuma chave privada deve ser enviada ao frontend.
- [ ] Considerar anúncios/afiliados somente após aprovação, consentimento adequado e revisão da experiência visual.

**Regra de manutenção:** congelar novas funcionalidades do MVP até conclusão desses gates; aceitar somente correções P0/P1, segurança, conformidade e feedback documentado.

Repositório: https://github.com/HelioConde/tft-personal-wrapped
Issue de homologação: https://github.com/HelioConde/tft-personal-wrapped/issues/1

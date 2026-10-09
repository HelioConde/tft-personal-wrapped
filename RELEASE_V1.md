# TFT Wrapped 1.0 — encerramento técnico e gate de publicação

**Data:** 09/10/2026
**Status:** núcleo funcional concluído e testado; **ainda não publicado no GitHub Pages**. Não anunciar o MVP como lançado antes de concluir a configuração administrativa e testar a versão pública.

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

## Bloqueio de publicação (requer ação de quem administra o GitHub)

O repositório informa `has_pages=false`. O workflow [Deploy GitHub Pages](https://github.com/HelioConde/tft-personal-wrapped/actions/workflows/pages.yml) falha no `actions/configure-pages@v5` antes de publicar:

`Create Pages site failed. Resource not accessible by integration`

A conexão atual pode modificar o repositório mas não possui autorização administrativa para criar o Pages site. **Não é corrigível apenas com uma mudança no workflow.**

1. Abrir [Settings → Pages](https://github.com/HelioConde/tft-personal-wrapped/settings/pages) autenticado como proprietário.
2. Em **Build and deployment**, selecionar **Source: GitHub Actions** e salvar.
3. Abrir [Deploy GitHub Pages](https://github.com/HelioConde/tft-personal-wrapped/actions/workflows/pages.yml) e executar **Run workflow** em `main`.
4. Após publicação, abrir `https://helioconde.github.io/tft-personal-wrapped/` e verificar o formulário e o perfil.
5. Rodar [Live Riot Smoke](https://github.com/HelioConde/tft-personal-wrapped/actions/workflows/live-riot-smoke.yml) **manualmente**, o que acrescenta o teste Playwright do site real ao teste da API.

## Gates externos/humanos

- [ ] Concluir Pages, publicar e validar o link de produção.
- [ ] Validar com dois outros Riot IDs que possuam partidas TFT, preferencialmente de regiões diferentes, e conta com 0 partidas recentes.
- [ ] Validar tradução dos nomes de traits/unidades/augments com dados reais de diferentes sets; a normalização atual remove prefixos técnicos e não substitui um dicionário oficial localizado.
- [ ] Exportar PNG e testar o compartilhamento em celular real; o fluxo em código não substitui o teste no aparelho.
- [ ] Confirmar a política Riot e as credenciais corretas para um lançamento público amplo; nenhuma chave privada deve ser enviada ao frontend.
- [ ] Considerar anúncios/afiliados somente após aprovação, consentimento adequado e revisão da experiência visual.

**Regra de manutenção:** congelar novas funcionalidades do MVP até conclusão desses gates; aceitar somente correções P0/P1, segurança, conformidade e feedback documentado.

Repositório: https://github.com/HelioConde/tft-personal-wrapped
Issue de homologação: https://github.com/HelioConde/tft-personal-wrapped/issues/1

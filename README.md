# TFT Wrapped

Retrospectiva pessoal e compartilhável de Teamfight Tactics por semana, mês ou set.

## Objetivo

Transformar histórico bruto de partidas em uma história visual simples de entender: o que o jogador mais usou, onde teve melhores resultados, quais foram seus recordes e como seu estilo mudou no período.

## MVP

- busca por Riot ID + servidor;
- períodos: semana, mês e set;
- resumo: partidas, média de colocação, Top 4, vitórias e melhor sequência;
- comps mais jogadas;
- unidades mais usadas;
- augments mais frequentes e de melhor desempenho;
- distribuição de colocações;
- melhores partidas e recordes;
- identidade do período;
- cards compartilháveis;
- PT-BR padrão + EN;
- espaços de anúncios sem bloquear o fluxo;
- atualização automática em tempo real após novo deploy.

## Dados

**Fonte atual:** `public-tft-profile` no Supabase gamer compartilhado do ZeroTwo. Em 09/10/2026 a API direta retornou 20 partidas reais de `AlchemyFlames#BR1` em ~9 segundos; o antigo intermediário `riot-legacy-tft-profile` tinha timeout de 5,5 s e devolvia um cache antigo vazio. O frontend agora usa o endpoint direto e até 35 s para concluir a consulta. A chave Riot permanece somente no servidor. Em falha, o modo demonstrativo fica explicitamente identificado.

**Limitação essencial:** semana, mês e set filtram **no máximo 20 partidas recentes recebidas**; não significam um histórico integral do set ou da conta.

## Regras de produto

- não virar tracker genérico;
- cada bloco responde uma pergunta do jogador;
- não repetir a mesma informação em vários cards;
- mobile-first e visualmente compartilhável;
- nenhuma análise live de adversários;
- monetização por anúncios sem prejudicar leitura ou ações;
- PT-BR é fonte principal e fallback; EN obrigatório.

## Estado atual

Repositório oficial: `HelioConde/tft-personal-wrapped`.

### Implementado

- shell visual TFT-first responsivo;
- filtros 7 dias / 30 dias / Set;
- métricas e distribuição de colocações;
- comps, unidades, augments e recordes;
- identidade do período;
- PT-BR/EN com preferência persistida;
- slot de anúncio reservado;
- regra global de live update;
- checklist de QA.

### Estado de finalização

Implementado em 07/10/2026:

- histórico TFT real via backend gamer;
- normalização de 7 dias / 30 dias / Set;
- comps derivadas de traits/unidades observadas;
- unidades e augments mais recorrentes;
- distribuição real de colocações e recordes do período;
- estados de loading, vazio, Riot ID inválido, 404, 429 e indisponibilidade;
- deep link com Riot ID/servidor/período/idioma;
- card PNG 1200×630 com Web Share e fallback para download;
- Browser E2E para dados reais mockados, mobile e rate limit;
- workflows de QA e GitHub Pages.

**Status técnico de 09/10/2026:** QA e capturas automáticas aprovados; regressões de cache antigo, Riot ID inválido, buscas concorrentes, limite de 20 partidas e privacidade cobertas. O endpoint TFT real respondeu com 20 partidas. Foram adicionadas capturas de painel preenchido em desktop e mobile.

**Publicação concluída em 09/10/2026:** Pages habilitado pelo proprietário, [deploy aprovado](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978660982), [teste de navegador na produção com consulta Riot aprovado](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/37978819124). Acesse o [TFT Wrapped publicado](https://helioconde.github.io/tft-personal-wrapped/). O workflow de deploy agora publica somente os assets do site e inclui o SHA real em `version.json`.

O workflow `Live Riot Smoke` valida a API real independentemente do Pages e roda o teste da página publicada automaticamente após cada deploy de produção bem-sucedido. Consulte o [relatório técnico do MVP](RELEASE_V1.md).

## Desenvolvimento local

```bash
python -m http.server 8080
```


## Regra de encerramento

O **núcleo técnico do MVP está publicado como beta**, mas o lançamento 1.0 amplo depende de homologação em dispositivo real, mais contas TFT e requisitos da Riot. Novas features estão congeladas até feedback real, bug P0/P1, segurança/compliance ou mudança relevante da Riot.

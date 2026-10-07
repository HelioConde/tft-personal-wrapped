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

O frontend já está conectado ao backend gamer compartilhado do ZeroTwo por `riot-legacy-tft-profile`. A Riot API key permanece somente no servidor. Quando a consulta real falha, o modo demonstrativo continua explicitamente identificado.

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

O gate restante é confirmar CI/Pages verdes e concluir a validação real com Riot IDs TFT antes de congelar features. O repositório agora inclui `tests/live-riot.spec.js` e o workflow `Live Riot Smoke`, que testa a versão publicada com `AlchemyFlames#BR1` sem tornar o E2E comum dependente da API externa.

## Desenvolvimento local

```bash
python -m http.server 8080
```


## Regra de encerramento

Depois que QA/Pages estiverem verdes e a rodada real confirmar os dados, o **MVP 1.0 fica concluído**. A partir daí novas features ficam congeladas até feedback real, bug P0/P1, segurança/compliance ou mudança relevante da Riot.

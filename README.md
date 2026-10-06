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

O protótipo começa com dados demonstrativos explicitamente identificados. A integração real deve acontecer no backend gamer/Supabase usando Riot API. A Riot API key nunca deve ir para o frontend.

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

### Próxima etapa

Conectar histórico real do TFT ao backend gamer, normalizar as partidas e substituir os dados demonstrativos; depois gerar o card PNG compartilhável.

## Desenvolvimento local

```bash
python -m http.server 8080
```

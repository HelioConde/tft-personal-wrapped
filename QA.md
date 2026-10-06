# QA — TFT Wrapped MVP

## Fluxos essenciais

- [ ] carregar em PT-BR por padrão;
- [ ] alternar para EN e persistir preferência;
- [ ] alternar 7 dias / 30 dias / Set;
- [ ] atualizar métricas sem reload;
- [ ] busca por Riot ID não expõe chave Riot no frontend;
- [ ] modo demonstrativo fica explícito quando não há backend real;
- [ ] layout 360px sem scroll horizontal;
- [ ] cards não repetem o mesmo insight;
- [ ] slot de anúncio não bloqueia CTA ou análise;
- [ ] live update falha de forma silenciosa e nunca derruba a página.

## Próximos testes

1. integrar endpoint real de perfil/histórico TFT;
2. normalizar match history para modelo de retrospectiva;
3. validar algoritmos de comp, unidade e augment;
4. gerar PNG real do card compartilhável;
5. testar Riot IDs reais em BR1;
6. adicionar loading, vazio, erro 404/429 e indisponibilidade Riot;
7. Lighthouse e acessibilidade;
8. GitHub Pages no repositório físico.

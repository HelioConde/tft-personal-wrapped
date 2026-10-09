# TFT Wrapped — pacote de 20 imagens

A arte foi gerada e otimizada para uso no site. O pacote ZIP disponibilizado na conversa contém duas pastas: `illustrations/` (10 imagens grandes) e `icons/` (10 detalhes/botões). Todos são WebP.

**Importante:** as imagens binárias ainda **não foram enviadas ao repositório**. A integração GitHub aceita alterações de texto, mas não consegue acessar os bytes binários criados no ambiente de imagens nesta sessão. Não confundir este documento e o deploy com publicação dos assets.

## Destino no repositório

Extraia o ZIP e envie as imagens para:
- `assets/tft-wrapped/illustrations/`
- `assets/tft-wrapped/icons/`

Após a entrada desses arquivos no GitHub, o workflow `Deploy GitHub Pages` já está configurado para copiar toda a pasta `assets/` para `_site/assets/` e disparar novo deploy quando `assets/**` mudar.

### Ilustrações (10)

| Arquivo | Uso previsto |
| --- | --- |
| hero-cosmic-arena.webp | topo/hero da homepage |
| search-riot-id.webp | como pesquisar perfil |
| recent-matches.webp | dados de partidas recentes |
| share-wrapped.webp | seção de compartilhamento |
| favorite-comps.webp | comps favoritas |
| augments-and-units.webp | augments e unidades |
| placements-and-records.webp | colocações e recordes |
| mobile-wrapped.webp | imagem vertical mobile |
| privacy-archive.webp | privacidade |
| demo-mode.webp | estado demonstrativo |

### Ícones (10)

| Arquivo | Uso previsto |
| --- | --- |
| crown.webp | melhor colocação |
| swords.webp | comps/batalhas |
| shield.webp | proteção/tanques |
| star.webp | recordes/destaques |
| analytics.webp | estatísticas |
| share.webp | exportar/compartilhar |
| augment.webp | augments |
| mascot.webp | marca/ajuda |
| lock.webp | privacidade |
| search.webp | botão pesquisar |

Os ícones possuem transparência e resolução de 384×384. No CSS, exibir como decoração a 24–44 px e manter o **texto acessível dos botões**; não usar o ícone sozinho como rótulo. Ilustrações devem ser carregadas com `loading="lazy"` quando estiverem fora da primeira dobra, e devem receber textos alternativos adequados. O banner principal precisa ser priorizado e ter dimensão estável para evitar CLS.

**Estado da implementação:** workflow preparado, upload binário e incorporação ao layout pendentes.

# TFT Wrapped — pacote de 20 imagens

A arte foi gerada e otimizada para uso no site. O pacote ZIP disponibilizado na conversa contém duas pastas: `illustrations/` (10 imagens grandes) e `icons/` (10 detalhes/botões). Todos são WebP.

**Importante:** as imagens binárias ainda **não foram enviadas ao repositório**. A integração GitHub aceita alterações de texto, mas não consegue acessar os bytes binários criados no ambiente de imagens nesta sessão. Não confundir este documento e o deploy com publicação dos assets.

## Envio simplificado — um único arquivo

A integração de arquivos binários do ChatGPT não consegue anexar diretamente os 20 WebP ao GitHub. Para concluir, **basta enviar o ZIP original** `tft-wrapped-20-imagens-otimizadas.zip` para a raiz do repositório pelo [Upload files](https://github.com/HelioConde/tft-personal-wrapped/upload/main) e clicar **Commit changes**. Não envie o ZIP externo `tft-wrapped-upload-pronto.zip`, que contém também um script para Windows.

O workflow [Import TFT Wrapped Images](.github/workflows/import-images.yml) valida a lista dos 20 nomes e o formato WebP, extrai para `assets/tft-wrapped/`, remove o arquivo ZIP de transferência, cria o commit e dispara o Pages automaticamente. A página só ativa o pacote de ilustrações após verificar que as 20 imagens estão presentes.

**Atenção:** enquanto o ZIP não for enviado, este repositório contém a configuração e os scripts, não as imagens binárias.

## Integração no layout — revisão de 09/10/2026

O código já está preparado para mostrar os 20 WebP sem sacrificar a usabilidade:

- Hero/identidade: arena cósmica em fundo sutil.
- Busca e cabeçalho: ícones transparentes de pesquisa e mascote.
- Cards de comps, colocações, unidades e recordes: ilustrações decorativas com opacidade reduzida, mantendo os números legíveis.
- Três passos explicativos: pesquisar Riot ID, consultar partidas recentes e compartilhar o PNG.
- Card de compartilhamento, aviso de demonstração e página de privacidade: visuais secundários.
- Carregamento sob demanda: a ilustração começa a ser solicitada quando o card entra perto da área visível. Ícones são carregados prioritariamente.
- Sem upload: as imagens continuam ocultas e **não geram pedidos 404**.
- Liberação automática: `assets-enabled.js` é gerado pelo Pages e só ativa o pacote quando **20/20 WebP** são encontrados no deploy.

Verificações: [Browser QA](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/38010135001) aprovou o fallback sem arquivos e a simulação de imagens ativadas. [Capture Visual Snapshot](https://github.com/HelioConde/tft-personal-wrapped/actions/runs/38010198663) passou em desktop e mobile, ambos em demonstração e dados preenchidos (sem arquivos reais instalados).

**Não confundir:** imagens simuladas nos testes não significam upload ao GitHub; a importação real ainda exige o envio do ZIP.

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

**Estado da implementação:** importador, layout e deploy automático preparados. **Upload do ZIP original pendente**. Os slots de imagens no hero e botões são opcionais e não exibem imagem quebrada.

# Homepage Horizonte

A homepage em `/` porta a composição e os estilos do [exemplo 2 aprovado](https://viajafacil-nova-home.nsilva1999.chatgpt.site/exemplo-2/) para React/Next.js. Mantém o cabeçalho com sublinhado em Voos, hero panorâmico, tipografia DM Sans/DM Serif Display/Manrope, formulário com rádios, campos e botão a toda a largura, cartões sem moldura, quatro vantagens, FAQ, CTA escuro e rodapé. A barra de comparação dos modelos e os avisos exclusivos do protótipo foram removidos.

`HorizonteShell` aplica o cabeçalho/rodapé apenas à homepage. `horizonte.css` contém os estilos originais dentro de `.horizonte-home`, incluindo os breakpoints. As outras rotas mantêm o layout anterior. As fontes são servidas por `next/font` e as fotografias por `next/image`.

`HorizonteSearch` usa o estado compartilhado de `useSearchForm`, `PassengerSelect`, `BookingProvider` e `buildSearchParams`. Começa em ida/volta com origem Luanda. Origem, destino e classe usam `CustomSelect`; as datas usam `DateSelect`, com calendário próprio em português, mínimo de partida e validação de regresso. Todos abrem painéis no desktop e `BottomSheet` no mobile, seguindo o seletor de passageiros. A validação do formulário também é própria, sem mensagens nativas do navegador. Os seletores suportam teclado, Escape e retorno do foco; o calendário permite navegar entre dias com as setas. Preserva adultos/crianças e suporta até seis voos em multicidade. A classe escolhida inicializa o filtro existente nos resultados. Os cartões preenchem o formulário e focam o destino, como na referência.

O rodapé inclui os contactos oficiais fornecidos: telefone `+244 928 243 835`, WhatsApp, Instagram `@viajafacilapp` e TikTok `@viajafacil.app`. Telefone usa `tel:`; WhatsApp usa `wa.me` com o indicativo de Angola.

A grelha inclui seis destinos: Benguela, Lubango, Lisboa, Dubai, Joanesburgo e São Paulo. Os novos cartões reutilizam os destinos existentes e preenchem os códigos DXB/JNB/GRU na pesquisa. A imagem de Joanesburgo foi corrigida para uma vista da cidade de [Steffen Lemmerzahl no Unsplash](https://unsplash.com/photos/city-skyline-during-sunset-with-cloudy-sky-iAsUCcNUpGI).

## Validação

- `npm run build`: passou, incluindo TypeScript e geração das páginas.
- ESLint dos componentes novos/alterados: passou sem erros.
- `git diff --check`: passou.
- Comparação visual da implementação e do exemplo no browser: cabeçalho, hero, formulário, destinos, vantagens, FAQ, CTA e rodapé.
- Browser: filtro internacional e cartão Lisboa a preencher a pesquisa; envio de ida/volta em 10–17 de novembro de 2026, com classe Executiva, para `/search` com parâmetros completos e filtro Business ativo.
- Browser mobile: menu e envio multicidade Luanda–Lisboa–Dubai, com as datas de cada percurso nos resultados.
- Controlos personalizados: seleção de aeroportos/classe, calendário por teclado, Escape com retorno do foco e ausência de selects/inputs de data nativos na pesquisa.
- Mobile a 390 px: folhas inferiores de destino, classe, datas e passageiros; alteração de contagem preserva foco. Sem overflow horizontal.
- Lint global na primeira validação: 3 erros existentes em `MultiCityLegRow.tsx` (leitura de ref durante render), além de avisos anteriores. Esse ficheiro não foi alterado.

## Revisão antes de produção

O repositório continua a utilizar dados mock de voos e aeroportos, com disponibilidade de agosto/setembro de 2026. Pesquisas para datas atuais podem não devolver voos. Esta alteração não implementa integração de inventário nem pagamentos reais.

As fotografias são as mesmas da proposta visual aprovada. A disponibilização pública requer confirmação dos direitos de utilização comercial ou substituição por fotografias próprias/licenciadas:

- `public/home/leba.jpg`: Serra da Leba, referência editorial [Freewheely](https://freewheely.com/2014/05/fantastic-scenery-around-lubango-mucubals-and-serra-da-leba/).
- `public/home/benguela.jpg`: referência editorial [Alma de Viajante](https://www.almadeviajante.com/).
- `public/home/lisboa.jpg`: fotografia [Unsplash](https://images.unsplash.com/photo-1585208798174-6cedd86e019a), já referenciada pelos dados do projeto.

O logo usa o asset existente `public/viajafacil.png`. O PR não publica nem altera o domínio oficial.

## Redes sociais

`HorizonteSocial` mostra três publicações reais do Instagram da marca, selecionadas em 9/10/2026, com miniaturas locais para evitar URLs temporários e scripts de terceiros. Os cartões abrem a publicação original; os atalhos levam ao Instagram e TikTok. A curadoria é manual: atualizar `posts` no componente e as imagens em `public/home/social/` para trocar destaques. Não existe feed automático, métricas inventadas ou reprodução de vídeos.

Fontes das imagens e datas:
- https://www.instagram.com/viajafacilapp/p/DeNLSbpRWGX/ — 7/10/2026.
- https://www.instagram.com/viajafacilapp/p/Dd_-Ln4DN3Y/ — 2/10/2026.
- https://www.instagram.com/viajafacilapp/p/Dd9VBYQjMqe/ — 1/10/2026.

As publicações são apresentadas em carrossel horizontal com setas, scroll-snap, teclado e suporte a movimentos reduzidos. O formato de dados distingue Instagram/TikTok; a inclusão de vídeos reais do TikTok aguarda links individuais, porque o perfil não carrega no navegador disponível. Hover/foco do CTA final usam fundo claro e texto escuro com regras específicas para impedir sobreposição das cores do botão principal. O envio desta alteração à PR foi autorizado; não foi realizado deployment.

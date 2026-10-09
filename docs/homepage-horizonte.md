# Homepage Horizonte

A homepage em `/` porta a composição e os estilos do [exemplo 2 aprovado](https://viajafacil-nova-home.nsilva1999.chatgpt.site/exemplo-2/) para React/Next.js. Mantém o cabeçalho com sublinhado em Voos, hero panorâmico, tipografia DM Sans/DM Serif Display/Manrope, formulário com rádios, campos e botão a toda a largura, cartões sem moldura, quatro vantagens, FAQ, CTA escuro e rodapé. A barra de comparação dos modelos e os avisos exclusivos do protótipo foram removidos.

`HorizonteShell` aplica o cabeçalho/rodapé apenas à homepage. `horizonte.css` contém os estilos originais dentro de `.horizonte-home`, incluindo os breakpoints. As outras rotas mantêm o layout anterior. As fontes são servidas por `next/font` e as fotografias por `next/image`.

`HorizonteSearch` usa o estado compartilhado de `useSearchForm`, `PassengerSelect`, `BookingProvider` e `buildSearchParams`. Começa em ida/volta com origem Luanda. As datas usam os inputs nativos do exemplo, com campos obrigatórios, mínimo de partida e validação de regresso. Preserva adultos/crianças e suporta até seis voos em multicidade. A classe escolhida inicializa o filtro existente nos resultados. Os cartões preenchem o formulário e focam o destino, como na referência.

## Validação

- `npm run build`: passou, incluindo TypeScript e geração das páginas.
- ESLint dos componentes novos/alterados: passou sem erros.
- `git diff --check`: passou.
- Comparação visual da implementação e do exemplo no browser: cabeçalho, hero, formulário, destinos, vantagens, FAQ, CTA e rodapé.
- Browser: filtro internacional e cartão Lisboa a preencher a pesquisa; envio de ida/volta em 10–17 de novembro de 2026, com classe Executiva, para `/search` com parâmetros completos e filtro Business ativo.
- Browser mobile: menu e envio multicidade Luanda–Lisboa–Dubai, com as datas de cada percurso nos resultados.
- Layout mobile a 390 px: sem overflow horizontal.
- Lint global na primeira validação: 3 erros existentes em `MultiCityLegRow.tsx` (leitura de ref durante render), além de avisos anteriores. Esse ficheiro não foi alterado.

## Revisão antes de produção

O repositório continua a utilizar dados mock de voos e aeroportos, com disponibilidade de agosto/setembro de 2026. Pesquisas para datas atuais podem não devolver voos. Esta alteração não implementa integração de inventário nem pagamentos reais.

As fotografias são as mesmas da proposta visual aprovada. A disponibilização pública requer confirmação dos direitos de utilização comercial ou substituição por fotografias próprias/licenciadas:

- `public/home/leba.jpg`: Serra da Leba, referência editorial [Freewheely](https://freewheely.com/2014/05/fantastic-scenery-around-lubango-mucubals-and-serra-da-leba/).
- `public/home/benguela.jpg`: referência editorial [Alma de Viajante](https://www.almadeviajante.com/).
- `public/home/lisboa.jpg`: fotografia [Unsplash](https://images.unsplash.com/photo-1585208798174-6cedd86e019a), já referenciada pelos dados do projeto.

O logo usa o asset existente `public/viajafacil.png`. O PR não publica nem altera o domínio oficial.

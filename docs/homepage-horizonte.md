# Homepage Horizonte

A homepage em `/` adapta o modelo 2 aprovado à aplicação Next.js. O formulário continua a usar `HomeSearch`, `SearchCard` e `useSearchForm`; os cartões usam `handleBookDestination` e os códigos de rota existentes. Autenticação, área administrativa, resultados, checkout e navegação inferior mantêm os seus fluxos.

A nova composição inclui hero panorâmico, DM Serif Display servida por `next/font`, pesquisa sobreposta, destinos filtráveis, vantagens, FAQ nativa com `details` e chamada para pesquisa. Os estilos estão isolados em `home.module.css`. Não introduz dependências nem apresenta preços ou métricas estáticas na homepage.

## Validação

- `npm run build`: passou, incluindo TypeScript e geração das 23 páginas.
- ESLint dos três ficheiros TypeScript alterados: passou.
- `git diff --check`: passou.
- Browser: origem/destino, calendário só ida e envio para `/search` com os parâmetros selecionados; filtro internacional; cartão Lisboa; abertura da FAQ; calendário mobile ida/volta; adição de trecho multicidade.
- Layout mobile a 390 px: sem overflow horizontal. Fotografias carregadas.
- Lint global: 3 erros existentes em `MultiCityLegRow.tsx` (leitura de ref durante render), além dos avisos anteriores. Esse ficheiro não foi alterado.

## Limitações existentes e revisão antes de produção

O repositório continua a utilizar dados mock de voos e aeroportos. Na validação em outubro, a disponibilidade só ida apresentada era de agosto/setembro de 2026 e não havia datas disponíveis no calendário ida/volta de outubro. Esta alteração não implementa integração de inventário nem pagamentos reais.

As fotografias são as mesmas da proposta visual aprovada. A disponibilização pública requer confirmação dos direitos de utilização comercial ou substituição por fotografias próprias/licenciadas:

- `public/home/leba.jpg`: Serra da Leba, referência editorial [Freewheely](https://freewheely.com/2014/05/fantastic-scenery-around-lubango-mucubals-and-serra-da-leba/).
- `public/home/benguela.jpg`: referência editorial [Alma de Viajante](https://www.almadeviajante.com/).
- `public/home/lisboa.jpg`: fotografia [Unsplash](https://images.unsplash.com/photo-1585208798174-6cedd86e019a), já referenciada pelos dados do projeto.

O logo usa o asset existente `public/viajafacil.png`. A refatoração é entregue em PR para revisão; não publica nem altera o domínio oficial.

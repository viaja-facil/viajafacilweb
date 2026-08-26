import { NextResponse } from "next/server";

export async function GET() {
  const content = `# ViajaFácil - Passagens Aéreas Angola

> ViajaFácil é a plataforma líder para compra de passagens aéreas em Angola.
> Oferecemos voos domésticos e internacionais com os melhores preços.
> Reserva online 24/7 com confirmação instantânea.

## Sobre Nós

ViajaFácil é uma plataforma angolana de reserva de passagens aéreas fundada em 2024 em Luanda.
Conectamos viajantes às melhores companhias aéreas com preços competitivos.
Mais de 10.000 viajantes confiam na nossa plataforma.

## Rotas Populares

### Domésticas (Angola)
- Luanda → Benguela: Voos diários, a partir de 48.000 Kz, 1h 30min direto
- Luanda → Lubango: Conexões convenientes, a partir de 135.000 Kz, 1h 30min
- Luanda → Namibe: Voos diretos, a partir de 147.500 Kz, 1h 45min
- Luanda → Malanje: Voos rápidos, a partir de 52.000 Kz, 1h 15min
- Luanda → Saurimo: A partir de 120.000 Kz, 2h

### Internacionais
- Luanda → Lisboa: Voos diretos TAP, a partir de 750.000 Kz, 6h 30min
- Luanda → Dubai: Emirates, a partir de 520.000 Kz, 7h 45min
- Luanda → Joanesburgo: A partir de 320.000 Kz, 4h 15min
- Luanda → São Paulo: A partir de 362.000 Kz, 8h

## Companhias Aéreas Parceiras

- **TAAG Angola Airlines** - Companhia nacional, voos domésticos e internacionais
- **TAP Air Portugal** - Voos para Lisboa e Europa
- **Emirates** - Conexões globais via Dubai
- **LAM Mozambique Airlines** - Voos para Moçambique
- **Reserve Air** - Voos charter e regulares
- **Diáspora Air** - Serviços para a diáspora

## Serviços

- **Reserva Online**: Compre passagens 24/7 em poucos cliques
- **Check-in Online**: Faça check-in antes de ir ao aeroporto
- **Bilhete Eletrônico**: Receba seu bilhete por e-mail
- **Seleção de Assentos**: Escolha seu lugar no avião
- **Pagamento Flexível**: Multicaixa Express, cartão de crédito/débito
- **Alerta de Preços**: Notificações quando os preços baixam

## Informações de Contato

- **Website**: https://viajafacil.app
- **E-mail**: info@viajafacil.app
- **Telefone**: +244 923 456 789
- **WhatsApp**: +244 923 456 789
- **Localização**: Luanda, Angola

## Perguntas Frequentes

### Como comprar passagens na ViajaFácil?
Selecione a origem, destino, datas e número de passageiros. Escolha o voo ideal e finalize a compra com Multicaixa Express ou cartão de crédito. Confirmação em menos de 2 minutos.

### Posso cancelar minha reserva?
Sim. Acesse "Minhas Reservas" com seu e-mail. Cancelamentos seguem a política da companhia aérea.

### A ViajaFácil cobra taxa?
Não. Você paga apenas o valor da passagem exibido na busca. Sem taxas escondidas.

### Quais formas de pagamento são aceitas?
Multicaixa Express, cartão de crédito e cartão de débito. Pagamento seguro com criptografia.

### Como faço check-in online?
Após a reserva, receba um e-mail com instruções para check-in 24h antes do voo.

---

Última atualização: ${new Date().toISOString()}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

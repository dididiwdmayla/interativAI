// Os passos de cada unidade da zona "Ser encontrado" para o roteiro
// `ser-encontrado-zona.mjs`: uma lista por fase, com um objeto por objetivo
// ({ id, passos }). Passos: { previsao: <opção> }, { editar: [[de, para]] }
// (troca um trecho do código), { ajuda: true } (o Me ajuda até a solução) e
// { fazer: async (contexto) => ... } para o que é próprio da unidade.
// `ferramentasNovas`: o que a unidade apresenta (o resto vem como já visto).

import { selecionarNo } from "./util.mjs";

const trocar = (de, para) => ({ editar: [[de, para]] });

/** Um clique de verdade na prévia (o data-evento vira evento medido); no toque, um toque nas coordenadas. */
const clicarNaPrevia = (seletor) => ({
  fazer: async ({ pagina, fecharBalao, assentar, toque }) => {
    await fecharBalao();
    const alvo = pagina.frameLocator("section[data-previa] iframe").first().locator(seletor).first();
    await alvo.scrollIntoViewIfNeeded();
    const caixa = await alvo.boundingBox();
    const x = caixa.x + Math.min(20, caixa.width / 2);
    const y = caixa.y + caixa.height / 2;
    if (toque) await pagina.touchscreen.tap(x, y);
    else await pagina.mouse.click(x, y);
    await assentar();
  },
});

/** Mexe na campanha (aba Campanha): lance, orçamento e palavra-chave (o id da opção). */
const campanha = ({ lance, orcamento, palavra }) => ({
  fazer: async ({ pagina, aba, assentar, fecharBalao }) => {
    await fecharBalao();
    await aba("Campanha");
    if (palavra !== undefined) {
      const campo = pagina.locator('[data-campo-campanha="palavra"]');
      await campo.scrollIntoViewIfNeeded();
      await campo.selectOption(palavra);
    }
    for (const [nome, valor] of [["orcamento", orcamento], ["lance", lance]]) {
      if (valor === undefined) continue;
      const campo = pagina.locator(`[data-campo-campanha="${nome}"]`);
      await campo.scrollIntoViewIfNeeded();
      await campo.fill(String(valor));
    }
    await assentar();
  },
});

/** O botão Analisar da aba Lighthouse. */
const analisar = {
  fazer: async ({ pagina, tocar, aba, assentar, fecharBalao }) => {
    await fecharBalao();
    await aba("Lighthouse");
    await tocar(pagina.locator("[data-analisar-auditoria]"));
    await assentar();
  },
};

/** Monta o link rastreável na aba Medição, põe no link selecionado (pela árvore) e simula uma visita. */
const linkRastreavel = (seletor, [origem, meio, campanha]) => ({
  fazer: async ({ pagina, tocar, aba, assentar, fecharBalao }) => {
    await aba("Elementos");
    await selecionarNo(pagina, seletor);
    await aba("Medição");
    for (const [campo, valor] of [["source", origem], ["medium", meio], ["campaign", campanha]]) {
      const entrada = pagina.locator(`[data-campo-utm="${campo}"]`);
      await entrada.scrollIntoViewIfNeeded();
      await entrada.fill(valor);
    }
    await fecharBalao();
    await tocar(pagina.locator("[data-por-no-link]"));
    await assentar();
    await fecharBalao();
    await tocar(pagina.locator("[data-simular-visita]"));
    await assentar();
  },
});

/** A apresentação de uma ferramenta, com o "Experimente" tocando no alvo dela. */
const apresentar = (id, alvo) => ({
  fazer: async ({ pagina, tocar, fecharBalao, passarApresentacao, falhar }) => {
    await passarApresentacao(
      pagina,
      id,
      async () => {
        await fecharBalao();
        await tocar(pagina.locator(alvo).first());
      },
      falhar,
    );
  },
});

export const PASSOS = {
  "sites-ser-encontrado-u2": {
    fases: [
      // F1: o h1
      [
        { id: "nome-vira-h1", passos: [{ previsao: 1 }, { ajuda: true }] },
        { id: "um-h1-so", passos: [trocar('<h1 id="promo">Promoção de inverno</h1>', '<h2 id="promo">Promoção de inverno</h2>')] },
      ],
      // F2: texto que responde e enchimento
      [
        {
          id: "resposta-com-preco",
          passos: [{ previsao: 2 }, trocar("Aqui você encontra tudo o que precisa para o seu vidro.", "Box de banheiro a partir de R$ 480, instalado em 3 dias.")],
        },
        { id: "resposta-com-horario", passos: [trocar("Atendemos em horário comercial.", "Abrimos de segunda a sexta, das 8h às 18h.")] },
        {
          id: "apagar-enchimento",
          passos: [
            { previsao: 0 },
            trocar('<p id="enchimento-topo" class="enchimento">vidraçaria barata, vidraçaria em Campinas, vidraçaria 24 horas, vidraçaria perto de mim, vidraçaria boa e barata</p>', ""),
          ],
        },
        {
          id: "achar-enchimento-escondido",
          passos: [trocar('<p id="enchimento-rodape" class="enchimento">vidro temperado barato vidro temperado Campinas vidro temperado orçamento vidro temperado grátis</p>', "")],
        },
      ],
      // F3: links e fotos
      [
        { id: "trocar-clique-aqui", passos: [{ previsao: 1 }, trocar(">clique aqui<", ">Veja o catálogo completo<")] },
        { id: "trocar-saiba-mais", passos: [trocar(">saiba mais<", ">Conheça o clube de leitura<")] },
        {
          id: "alt-nas-fotos",
          passos: [trocar('<img id="foto-loja"', '<img alt="Estantes cheias de livros" id="foto-loja"'), trocar('<img id="foto-cafe"', '<img alt="Xícara de café" id="foto-cafe"')],
        },
      ],
      // F4: velocidade
      [
        { id: "foto-de-baixo-preguicosa", passos: [{ previsao: 2 }, trocar('<img id="foto-1"', '<img loading="lazy" id="foto-1"')] },
        {
          id: "galeria-toda-menos-a-capa",
          passos: [trocar('<img id="foto-2"', '<img loading="lazy" id="foto-2"'), trocar('<img id="foto-3"', '<img loading="lazy" id="foto-3"')],
        },
      ],
      // F5: o desafio (as partes marcam ao vivo)
      {
        desafio: [
          trocar('<div id="nome" class="nome">Casa de Chá Lótus</div>', '<h1 id="nome" class="nome">Casa de Chá Lótus</h1>'),
          trocar('<h1 id="oferta">Ofertas da semana</h1>', '<h2 id="oferta">Ofertas da semana</h2>'),
          trocar("Temos chás e docinhos para todos os gostos.", "Bule de chá com dois docinhos por R$ 32, das 9h às 19h."),
          trocar('<p class="enchimento">casa de chá barata casa de chá Florianópolis casa de chá boa casa de chá perto de mim</p>', ""),
          trocar(">clique aqui<", ">Veja o cardápio de chás e docinhos<"),
          trocar('<img id="capa"', '<img alt="Bule de chá verde" id="capa"'),
          trocar('<img id="galeria-1"', '<img alt="Docinhos" loading="lazy" id="galeria-1"'),
          trocar('<img id="galeria-2"', '<img alt="Chá de hibisco" loading="lazy" id="galeria-2"'),
          trocar('<img id="galeria-3"', '<img alt="Bandeja de chás" loading="lazy" id="galeria-3"'),
        ],
      },
    ],
  },

  "sites-ser-encontrado-u3": {
    ferramentasNovas: ["dados-estruturados"],
    fases: [
      // F1: os mesmos dados em todo lugar
      [
        { id: "telefone-igual", passos: [{ previsao: 0 }, trocar('<span id="tel-rodape">(21) 3555-0124</span>', '<span id="tel-rodape">(21) 3555-0142</span>')] },
        { id: "endereco-igual", passos: [trocar('<p id="endereco-contato">Rua das Acácias, 54, Niterói</p>', '<p id="endereco-contato">Rua das Acácias, 45, Niterói</p>')] },
      ],
      // F2: avaliações
      [
        { id: "responder-avaliacao-ruim", passos: [{ previsao: 2 }, { ajuda: true }] },
        {
          id: "agradecer-avaliacao",
          passos: [trocar('<p class="resposta-dono" id="resposta-3">Sem resposta do restaurante.</p>', '<p class="resposta-dono" id="resposta-3">Que bom que gostou da feijoada! Anotamos a sobremesa.</p>')],
        },
      ],
      // F3: o JSON que a busca lê (apresenta o Teste de dados estruturados)
      [
        {
          id: "consertar-o-json",
          passos: [{ previsao: 1 }, apresentar("dados-estruturados", '[data-ferramenta~="dados-estruturados"]'), trocar('"(27) 3555-0188",\n}', '"(27) 3555-0188"\n}')],
        },
        {
          id: "acrescentar-endereco",
          passos: [
            trocar(
              '"telephone": "(27) 3555-0188"\n}',
              '"telephone": "(27) 3555-0188",\n  "address": { "@type": "PostalAddress", "streetAddress": "Rua Sete de Setembro, 95", "addressLocality": "Vitória" }\n}',
            ),
          ],
        },
      ],
      // F4: o tipo certo de negócio
      [
        {
          id: "sorveteria-especifica",
          passos: [{ previsao: 0 }, trocar('"@type": "LocalBusiness",\n  "name": "Sorveteria Gelato Bello"', '"@type": "IceCreamShop",\n  "name": "Sorveteria Gelato Bello"')],
        },
        { id: "encanador-especifico", passos: [trocar('"@type": "LocalBusiness",\n  "name": "Hidráulica Seu Nilo"', '"@type": "Plumber",\n  "name": "Hidráulica Seu Nilo"')] },
      ],
      // F5: o desafio
      {
        desafio: [
          trocar('<span id="end-contato">Rua das Flores, 102, Sarandi</span>', '<span id="end-contato">Rua das Flores, 120, Sarandi</span>'),
          trocar('<span id="end-rodape">R. das Flores, 210, Sarandi</span>', '<span id="end-rodape">Rua das Flores, 120, Sarandi</span>'),
          trocar('"streetAddress": "Rua das Flores, 210"', '"streetAddress": "Rua das Flores, 120"'),
          trocar('"telephone": "(44) 3555-0100",\n}', '"telephone": "(44) 3555-0100"\n}'),
          trocar('"@type": "LocalBusiness"', '"@type": "Bakery"'),
          trocar('<p class="resposta-dono" id="resposta-1">Sem resposta da padaria.</p>', '<p class="resposta-dono" id="resposta-1">Sentimos muito. Vamos assar de hora em hora.</p>'),
        ],
      },
    ],
  },

  "sites-ser-encontrado-u4": {
    ferramentasNovas: ["medicao", "link-rastreavel"],
    fases: [
      // F1: o que as pessoas fazem no site (apresenta a aba Medição)
      [
        {
          id: "medir-whatsapp",
          passos: [
            { previsao: 1 },
            apresentar("medicao", '[data-ferramenta~="medicao"]'),
            clicarNaPrevia("#pedir-whatsapp"),
          ],
        },
        {
          id: "medir-pedido",
          passos: [trocar('<button id="enviar-pedido" type="button">', '<button id="enviar-pedido" data-evento="pedido_enviado" type="button">'), clicarNaPrevia("#enviar-pedido")],
        },
        {
          id: "medir-ligacao",
          passos: [trocar('<a id="ligar" class="ligar"', '<a id="ligar" data-evento="clique_ligar" class="ligar"'), clicarNaPrevia("#ligar")],
        },
      ],
      // F2: o que a busca vê do seu site
      [
        { id: "voltar-para-a-busca", passos: [{ previsao: 2 }, trocar('<meta name="robots" content="noindex">', "")] },
        { id: "title-com-a-pesquisa", passos: [trocar("<title>Loja Vale Verde | Início</title>", "<title>Loja Vale Verde | Vasos de cerâmica em Goiânia</title>")] },
      ],
      // F3: links rastreáveis (apresenta o construtor de link)
      [
        {
          id: "link-do-instagram",
          passos: [
            { previsao: 0 },
            apresentar("link-rastreavel", '[data-ferramenta~="link-rastreavel"]'),
            linkRastreavel("#link-insta", ["instagram", "social", "natal"]),
          ],
        },
        { id: "link-do-email", passos: [linkRastreavel("#link-email", ["email", "email", "natal"])] },
      ],
      // F4: o desafio
      {
        desafio: [
          linkRastreavel("#link-insta", ["instagram", "social", "verao"]),
          linkRastreavel("#link-folheto", ["folheto", "impresso", "verao"]),
          trocar('<button id="fazer-pedido" type="button">', '<button id="fazer-pedido" data-evento="pedido_enviado" type="button">'),
          clicarNaPrevia("#fazer-pedido"),
        ],
      },
    ],
  },

  "sites-ser-encontrado-u5": {
    // O tipo simulador-campanha não é "desafio": a unidade não tem meta.desafioId, então não há meta.
    semMeta: true,
    ferramentasNovas: ["simulador-campanha"],
    fases: [
      // F1: o leilão (apresenta a aba Campanha)
      [
        {
          id: "primeiro-lugar",
          passos: [{ previsao: 1 }, apresentar("simulador-campanha", '[data-ferramenta~="simulador-campanha"]'), campanha({ lance: 4 })],
        },
        { id: "custo-por-clique", passos: [{ previsao: 2 }, campanha({ lance: 2.8 })] },
        { id: "outra-palavra-chave", passos: [campanha({ palavra: "pizzaria-no-cambui" })] },
      ],
      // F2: verba e palavras-chave
      [
        { id: "orcamento-acabou", passos: [{ previsao: 0 }, campanha({ orcamento: 150 })] },
        { id: "comecar-pequeno", passos: [campanha({ palavra: "oculos-de-sol" })] },
      ],
      // F3: a página que decide
      [
        { id: "diagnostico-da-pagina", passos: [{ previsao: 1 }, analisar] },
        {
          id: "melhorar-a-busca-da-pagina",
          passos: [
            { previsao: 2 },
            trocar(
              '<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Doceria Casa de Bolo | Bolos de pote e doces em Recife</title>\n<meta name="description" content="Bolos de pote e doces para festa feitos por encomenda em Recife. Peça pelo WhatsApp e receba o orçamento na hora.">',
            ),
          ],
        },
        { id: "alt-e-custo-por-cliente", passos: [trocar('<img class="foto"', '<img alt="Potes de bolo com brigadeiro" class="foto"')] },
      ],
      // F4: o desafio (só sozinho)
      [
        {
          id: "melhorar-a-pagina",
          passos: [
            trocar(
              '<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Pet Shop Rabo Feliz | Banho e tosa em Aracaju</title>\n<meta name="description" content="Banho e tosa, ração e veterinário em Aracaju, com leva e traz. Agende pelo WhatsApp e receba o horário na hora.">',
            ),
          ],
        },
        { id: "a-conta-fecha", passos: [trocar('<img class="foto"', '<img alt="Cachorro tomando banho de espuma" class="foto"')] },
      ],
    ],
  },
};

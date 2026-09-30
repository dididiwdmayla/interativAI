// Os passos de cada unidade da zona "Ser encontrado" para o roteiro
// `ser-encontrado-zona.mjs`: uma lista por fase, com um objeto por objetivo
// ({ id, passos }). Passos: { previsao: <opção> }, { editar: [[de, para]] }
// (troca um trecho do código), { ajuda: true } (o Me ajuda até a solução) e
// { fazer: async (contexto) => ... } para o que é próprio da unidade.
// `ferramentasNovas`: o que a unidade apresenta (o resto vem como já visto).

const trocar = (de, para) => ({ editar: [[de, para]] });

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
};

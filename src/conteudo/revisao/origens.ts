/*
 * Revisão: os conceitos das salas 1 e 2 do Museu das Origens (rodada 36).
 *
 * A Revisão do dia não aceita a área exposicao, então os itens são
 * previsões sobre uma vitrine pequena (um mini-site próprio de cada item,
 * diferente das salas): o cartão, as lâmpadas, a cor, a linha do tempo.
 */
import type { IdConceito, ItemRevisao } from "../tipos";

const CSS_VITRINE = `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.vitrine {
  border: 3px solid #b98458;
  border-radius: 12px;
  padding: 12px;
  background: #fffaf0;
}

.peca {
  font-family: monospace;
  font-size: 22px;
  letter-spacing: 4px;
}
`;

/** Uma vitrine do museu com uma placa e a peça (texto). */
export function vitrine(url: string, placa: string, peca: string): ItemRevisao["siteAlvo"] {
  return {
    url,
    titulo: "Museu das Origens",
    body: `<div class="vitrine"><p class="placa">${placa}</p><p class="peca">${peca}</p></div>`,
    css: CSS_VITRINE,
  };
}

const ENUNCIADO = { mouse: "Olhe a vitrine e escolha sua previsão.", toque: "Olhe a vitrine e escolha sua previsão." };

export function item(id: string, conceito: IdConceito, siteAlvo: ItemRevisao["siteAlvo"], previsao: NonNullable<ItemRevisao["previsao"]>, ajudas: ItemRevisao["ajudas"]): ItemRevisao {
  return { id, conceito, tipo: "previsao", enunciado: ENUNCIADO, siteAlvo, previsao, ajudas, solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: previsao.correta }] };
}

export const ITENS_ORIGENS: readonly ItemRevisao[] = [
  // Sala 1
  item(
    "bit-1",
    "bit",
    vitrine("vitrine-interruptor.exemplo", "Um interruptor de luz", "LIGADO / DESLIGADO"),
    {
      pergunta: "Quantas possibilidades cabem num bit, como neste interruptor?",
      opcoes: ["Duas", "Dez", "Infinitas"],
      correta: 0,
      explicacao: "Um bit só tem duas: ligado ou desligado, 1 ou 0, furo ou sem furo.",
    },
    { pergunta: "O interruptor fica em quantas posições?", dica: "O bit é a menor informação: só dois estados." },
  ),
  item(
    "bit-2",
    "bit",
    vitrine("vitrine-tres-cartoes.exemplo", "Um cartão com 3 lugares para furar", "[ ] [ ] [ ]"),
    {
      pergunta: "Cada lugar do cartão pode ter furo ou não. Quantos bits este cartão guarda?",
      opcoes: ["1", "3", "6"],
      correta: 1,
      explicacao: "Cada lugar é uma escolha de dois jeitos: um bit. Três lugares, três bits.",
    },
    { pergunta: "Quantas escolhas de furo ou sem furo o cartão tem?", dica: "Um lugar do cartão é um bit." },
  ),
  item(
    "binario-1",
    "binario",
    vitrine("vitrine-quatro-lampadas.exemplo", "Pesos: 8 4 2 1", "1 0 0 1"),
    {
      pergunta: "As lâmpadas mostram 1 0 0 1, com os pesos 8, 4, 2 e 1. Que número é?",
      opcoes: ["1001", "9", "2"],
      correta: 1,
      explicacao: "Acesas a do 8 e a do 1: 8 + 1 = 9.",
    },
    { pergunta: "Quais pesos estão acesos?", dica: "Some os pesos das posições com 1." },
  ),
  item(
    "binario-2",
    "binario",
    vitrine("vitrine-cinco-lampadas.exemplo", "Cinco lâmpadas", "16 8 4 2 1"),
    {
      pergunta: "Se a próxima lâmpada à esquerda do 8 existe, quanto ela vale?",
      opcoes: ["9", "10", "16"],
      correta: 2,
      explicacao: "Cada posição vale o dobro da vizinha da direita: depois do 8 vem o 16.",
    },
    { pergunta: "Como os pesos crescem: 1, 2, 4, 8...?", dica: "Em binário, cada posição vale o dobro da anterior." },
  ),
  item(
    "instrucao-de-maquina-1",
    "instrucao-de-maquina",
    vitrine("vitrine-tres-ordens.exemplo", "Uma linha virou instruções", "PEGA a / SOMA b / GUARDA c"),
    {
      pergunta: "Qual destas é uma instrução que o processador cumpre de uma vez?",
      opcoes: ["Calcular o frete e mostrar na tela", "SOMA b", "Fazer um site de loja"],
      correta: 1,
      explicacao: "Instrução é uma ordem pequena, como somar um número. Pedidos grandes viram muitas instruções.",
    },
    { pergunta: "Qual ordem é pequena o bastante para um passo só?", dica: "O processador cumpre ordens simples: pegar, somar, guardar." },
  ),
  item(
    "instrucao-de-maquina-2",
    "instrucao-de-maquina",
    vitrine("vitrine-uma-linha.exemplo", "let media = (a + b) / 2;", "? instruções"),
    {
      pergunta: "Essa linha de JavaScript vira uma instrução só para o processador?",
      opcoes: ["Não, várias: pegar, somar, dividir, guardar", "Sim, uma só", "Nenhuma: o processador lê JavaScript direto"],
      correta: 0,
      explicacao: "Cada linha que a gente escreve costuma virar várias instruções pequenas, uma depois da outra.",
    },
    { pergunta: "Quantas contas e guardadas essa linha faz?", dica: "O tradutor quebra a linha em ordens pequenas." },
  ),
  item(
    "linguagem-de-maquina-1",
    "linguagem-de-maquina",
    vitrine("vitrine-fileira-de-bits.exemplo", "O que o processador lê", "0010 0111"),
    {
      pergunta: "Essa fileira de uns e zeros é escrita em qual linguagem?",
      opcoes: ["JavaScript", "Linguagem de máquina", "HTML"],
      correta: 1,
      explicacao: "Instruções escritas em bits, do jeito que o processador lê, são a linguagem de máquina.",
    },
    { pergunta: "Quem lê uns e zeros direto?", dica: "A camada de baixo de todo programa é feita de bits." },
  ),
  item(
    "linguagem-de-maquina-2",
    "linguagem-de-maquina",
    vitrine("vitrine-tradutor.exemplo", "Por que quase ninguém escreve assim?", "0001 0110 0010 0111 0011 1000"),
    {
      pergunta: "Por que quase ninguém programa direto em linguagem de máquina hoje?",
      opcoes: ["Porque é difícil de ler e um tradutor faz isso por nós", "Porque é proibido", "Porque o computador não entende bits"],
      correta: 0,
      explicacao: "Bits são ótimos para a máquina e péssimos para gente. Um tradutor (compilador ou interpretador) faz essa parte.",
    },
    { pergunta: "É fácil achar um erro numa fileira de bits?", dica: "A gente escreve na camada de cima; o tradutor desce até a máquina." },
  ),
  item(
    "linguagem-de-programacao-1",
    "linguagem-de-programacao",
    vitrine("vitrine-camada-de-cima.exemplo", "A camada de cima", "let total = preco + frete;"),
    {
      pergunta: "Essa linha foi feita para quem ler primeiro?",
      opcoes: ["Para gente", "Para o processador, direto", "Para a impressora"],
      correta: 0,
      explicacao: "Linguagem de programação é para gente ler e escrever. Depois um tradutor passa para a máquina.",
    },
    { pergunta: "Você entende a linha sem decorar bits?", dica: "A linguagem de programação é a camada que gente lê." },
  ),
  item(
    "linguagem-de-programacao-2",
    "linguagem-de-programacao",
    vitrine("vitrine-navegador-traduz.exemplo", "No navegador", "arquivo.js"),
    {
      pergunta: "Quem traduz o JavaScript de uma página para a linguagem de máquina?",
      opcoes: ["A pessoa que abriu o site", "O próprio navegador, enquanto a página roda", "Ninguém: a máquina lê o texto"],
      correta: 1,
      explicacao: "O navegador tem um motor de JavaScript que traduz e executa o código, escondido, enquanto a página roda.",
    },
    { pergunta: "Você precisa traduzir o JavaScript à mão para o site funcionar?", dica: "Todo navegador tem um tradutor de JavaScript dentro." },
  ),
  item(
    "byte-1",
    "byte",
    vitrine("vitrine-oito-lampadas.exemplo", "Oito lâmpadas juntas", "0 0 0 0 0 0 0 0"),
    {
      pergunta: "Oito bits juntos formam o quê?",
      opcoes: ["Um byte", "Um pixel", "Um kilo"],
      correta: 0,
      explicacao: "Um byte é um grupo de 8 bits: guarda um número de 0 a 255.",
    },
    { pergunta: "Qual é o nome do grupo de 8 bits?", dica: "Byte: 8 bits, de 0 a 255." },
  ),
  item(
    "byte-2",
    "byte",
    vitrine("vitrine-byte-cheio.exemplo", "Um byte com tudo aceso", "1 1 1 1 1 1 1 1"),
    {
      pergunta: "Com as oito lâmpadas acesas, qual número o byte mostra?",
      opcoes: ["8", "128", "255"],
      correta: 2,
      explicacao: "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255, o maior número de um byte.",
    },
    { pergunta: "Os pesos vão de 128 até 1. Quanto dá a soma de todos?", dica: "O maior número de um byte é 255." },
  ),
  item(
    "hexadecimal-1",
    "hexadecimal",
    vitrine("vitrine-digitos-hex.exemplo", "Os dígitos do hexadecimal", "0 1 2 3 4 5 6 7 8 9 a b c d e f"),
    {
      pergunta: "Em hexadecimal, quanto vale o dígito f?",
      opcoes: ["15", "16", "6"],
      correta: 0,
      explicacao: "Depois do 9 vêm a (10), b (11), c (12), d (13), e (14) e f (15).",
    },
    { pergunta: "Se a é 10, quanto é f?", dica: "O hexadecimal conta de 0 a f: são 16 dígitos, de 0 a 15." },
  ),
  item(
    "hexadecimal-2",
    "hexadecimal",
    vitrine("vitrine-verde-hex.exemplo", "Uma cor do CSS", "#00ff00"),
    {
      pergunta: "Em #00ff00, só o par do meio está no máximo. Que cor é?",
      opcoes: ["Vermelho", "Verde", "Azul"],
      correta: 1,
      explicacao: "Os pares são vermelho, verde e azul. Só o verde está em ff: verde puro.",
    },
    { pergunta: "Qual é a ordem dos pares numa cor #RRGGBB?", dica: "Vermelho, verde e azul, de 00 (nada) a ff (tudo)." },
  ),
  // Sala 2
  item(
    "cartao-perfurado-1",
    "cartao-perfurado",
    vitrine("vitrine-cartao-escritorio.exemplo", "Um cartão de escritório", "o . o o . . o"),
    {
      pergunta: "Antes das telas, para que serviam os furos de um cartão perfurado?",
      opcoes: ["Enfeite", "Guardar informação e ordens", "Deixar o cartão mais leve"],
      correta: 1,
      explicacao: "Cada furo (ou a falta dele) guardava um pedaço de informação: um desenho no tear, uma resposta no censo, um programa.",
    },
    { pergunta: "O tear lia o que nos cartões?", dica: "O cartão perfurado guardava informação e ordens em furos." },
  ),
  item(
    "cartao-perfurado-2",
    "cartao-perfurado",
    vitrine("vitrine-caixa-de-cartoes.exemplo", "Uma caixa de cartões de programa", "[cartão 1] [cartão 2] [cartão 3] ..."),
    {
      pergunta: "Num programa em cartões, o que acontecia se a caixa caísse e os cartões se misturassem?",
      opcoes: ["Nada: a máquina reorganizava sozinha", "Os furos sumiam", "O programa ficava fora de ordem"],
      correta: 2,
      explicacao: "Cada cartão era uma parte do programa, em ordem. Misturou, a máquina lia as ordens trocadas.",
    },
    { pergunta: "A ordem dos cartões importava?", dica: "O programa era uma fila de cartões, um depois do outro." },
  ),
  item(
    "historia-da-computacao-1",
    "historia-da-computacao",
    vitrine("vitrine-tres-maquinas.exemplo", "Três parentes", "válvulas / computador pessoal / tear"),
    {
      pergunta: "Qual destes veio primeiro?",
      opcoes: ["As válvulas", "O computador pessoal", "O tear de cartões"],
      correta: 2,
      explicacao: "O tear de Jacquard é do início dos anos 1800; as válvulas, dos anos 1940; o computador pessoal, do fim dos anos 1970.",
    },
    { pergunta: "Qual deles nem usava eletricidade?", dica: "A ordem é tear, válvulas, computador pessoal." },
  ),
  item(
    "historia-da-computacao-2",
    "historia-da-computacao",
    vitrine("vitrine-ia.exemplo", "A mais nova da família", "IA que conversa"),
    {
      pergunta: "A IA que conversa e escreve código é de qual época?",
      opcoes: ["Anos 2020", "Anos 1940", "Anos 1980"],
      correta: 0,
      explicacao: "Os modelos de linguagem que conversam com qualquer pessoa se espalharam nos anos 2020.",
    },
    { pergunta: "Ela veio antes ou depois do celular?", dica: "É a geração mais nova da família, depois do smartphone." },
  ),
  item(
    "transistor-1",
    "transistor",
    vitrine("vitrine-chavinha.exemplo", "Uma chavinha sem vidro", "transistor"),
    {
      pergunta: "O transistor veio para substituir qual peça?",
      opcoes: ["A válvula", "O teclado", "O disquete"],
      correta: 0,
      explicacao: "Ele faz o serviço da válvula (ligar e desligar) sendo menor, mais frio e mais barato.",
    },
    { pergunta: "Qual peça esquentava e ocupava espaço nos anos 1940?", dica: "O transistor trocou a válvula." },
  ),
  item(
    "transistor-2",
    "transistor",
    vitrine("vitrine-chip-moderno.exemplo", "Um chip de hoje", "bilhões de chavinhas"),
    {
      pergunta: "Quantos transistores cabem num chip de computador de hoje?",
      opcoes: ["Uns dez", "Uns mil", "Bilhões"],
      correta: 2,
      explicacao: "Os chips de hoje têm bilhões de transistores, cada um menor do que dá para ver.",
    },
    { pergunta: "Eles ficaram maiores ou menores com o tempo?", dica: "Cada geração encolheu o transistor; hoje são bilhões num chip." },
  ),
  item(
    "computador-pessoal-1",
    "computador-pessoal",
    vitrine("vitrine-mesa-de-casa.exemplo", "Na mesa de casa", "monitor + teclado + disquete"),
    {
      pergunta: "O que o computador pessoal mudou?",
      opcoes: ["Levou o computador para casas e escolas", "Inventou a válvula", "Acabou com os teclados"],
      correta: 0,
      explicacao: "Ele saiu das empresas e foi morar nas casas e nas escolas, um computador para uma pessoa.",
    },
    { pergunta: "Antes dele, onde ficavam os computadores?", dica: "Pessoal: um computador numa mesa, de uma pessoa." },
  ),
  item(
    "computador-pessoal-2",
    "computador-pessoal",
    vitrine("vitrine-antes-ou-depois.exemplo", "Quem veio antes?", "computador pessoal ? web"),
    {
      pergunta: "O que veio primeiro: o computador pessoal ou a web?",
      opcoes: ["A web", "O computador pessoal", "Os dois juntos"],
      correta: 1,
      explicacao: "O computador pessoal chegou às casas no fim dos anos 1970 e nos 1980. A web veio nos anos 1990, ligando esses computadores.",
    },
    { pergunta: "Para abrir a web, a pessoa precisava ter o quê?", dica: "Primeiro o computador em casa, depois a web." },
  ),
  item(
    "web-1",
    "web",
    vitrine("vitrine-links.exemplo", "Páginas ligadas", "página A -> link -> página B"),
    {
      pergunta: "O que é a web?",
      opcoes: ["Os cabos que ligam os computadores", "Páginas ligadas por links, abertas num navegador", "Um tipo de celular"],
      correta: 1,
      explicacao: "A web são as páginas e os links. Ela roda em cima da internet, que é a rede (cabos, antenas e servidores).",
    },
    { pergunta: "Você abre a web com qual programa?", dica: "Web: páginas e links no navegador; internet: a rede por baixo." },
  ),
  item(
    "web-2",
    "web",
    vitrine("vitrine-web-ou-internet.exemplo", "Web ou internet?", "e-mail / site / mensagem"),
    {
      pergunta: "Web e internet são exatamente a mesma coisa?",
      opcoes: ["Sim, dois nomes para a mesma coisa", "Não: a internet roda em cima da web", "Não: a web roda em cima da internet"],
      correta: 2,
      explicacao: "A internet é a rede que liga os computadores. A web é um dos serviços que usam essa rede, como o e-mail também é.",
    },
    { pergunta: "O que existe primeiro: a rede ou as páginas?", dica: "A internet é a estrada; a web é um dos veículos." },
  ),
];

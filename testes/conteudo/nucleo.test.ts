/*
 * O núcleo do painel e os validadores: as peças que o conteúdo usa.
 * Se isto quebrar, os testes de conteúdo perdem o sentido.
 */
import { describe, expect, it } from "vitest";
import { FASE_U2_F4 } from "@/conteudo/ilhas/sites/elementos/unidade-2/fase-4-desafio";
import type { FasePratica, Validador } from "@/conteudo/tipos";
import { CLASSE_ESCONDER } from "@/lib/esconder";
import { ErroAcao } from "@/motor/executarAcao";
import { LIMITE_HISTORICO } from "@/motor/nucleoPainel";
import { criarSimulacao } from "@/motor/simulacao";
import { recalcularPartesFeitas, validadorTravado } from "@/motor/validadores";

const FASE: FasePratica = {
  id: "teste-u0-f1",
  tipo: "pratica",
  unidadeId: "teste-u0",
  titulo: "Teste",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: [],
  introducao: [{ texto: "Oi", expressao: "feliz" }],
  conclusao: [{ texto: "Tchau", expressao: "feliz" }],
  siteAlvo: {
    url: "teste.site",
    titulo: "Teste",
    head: "<title>Teste</title>",
    body: `<header id="topo">Topo</header>
<main>
  <section id="lista">
    <article id="a1" class="card"><h3>Um</h3><p>Texto um</p></article>
    <article id="a2" class="card"><h3>Dois</h3><p>Texto dois</p></article>
  </section>
</main>
<footer id="rodape">Rodapé</footer>`,
  },
  objetivos: [],
};

function nova() {
  const simulacao = criarSimulacao(FASE);
  simulacao.comecarObjetivo(null);
  return simulacao;
}

const passa = (simulacao: ReturnType<typeof nova>, validador: Validador) => simulacao.avaliar(validador).passou;

describe("núcleo do painel", () => {
  it("apagar leva a seleção para o próximo irmão e, sem ele, para o pai", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "apagar", seletor: "#a1" }]);
    expect(passa(simulacao, { tipo: "naoExiste", seletor: "#a1" })).toBe(true);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#a2" })).toBe(true);
    simulacao.executar([{ tipo: "apagar", seletor: "#a2" }]);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#lista" })).toBe(true);
  });

  it("duplicar põe a cópia logo depois e seleciona a cópia", () => {
    const simulacao = nova();
    simulacao.executar([
      { tipo: "duplicar", seletor: "#a1" },
      { tipo: "definirTexto", seletor: "$0 h3", valor: "Cópia" },
    ]);
    const titulos = Array.from(simulacao.documento.querySelectorAll("article h3")).map((item) => item.textContent);
    expect(titulos).toEqual(["Um", "Cópia", "Dois"]);
    expect(passa(simulacao, { tipo: "textoDiferenteDoInicial", seletor: "article h3" })).toBe(true);
    expect(passa(simulacao, { tipo: "evento", evento: "duplicou" })).toBe(true);
  });

  it("esconder usa a classe do Chrome e mantém o elemento; a tecla H alterna", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "esconder", seletor: "#topo" }]);
    expect(simulacao.documento.querySelector("#topo")?.classList.contains(CLASSE_ESCONDER)).toBe(true);
    expect(passa(simulacao, { tipo: "escondido", seletor: "#topo" })).toBe(true);
    expect(passa(simulacao, { tipo: "existe", seletor: "#topo" })).toBe(true);
    const caminho = simulacao.nucleo.selecao()?.caminho ?? [];
    simulacao.nucleo.alternarEsconder(caminho);
    expect(passa(simulacao, { tipo: "escondido", seletor: "#topo" })).toBe(false);
  });

  it("desfazer e refazer voltam o body e a seleção", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "apagar", seletor: "#rodape" }]);
    simulacao.executar([{ tipo: "desfazer" }]);
    expect(passa(simulacao, { tipo: "existe", seletor: "#rodape" })).toBe(true);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#rodape" })).toBe(true);
    expect(simulacao.nucleo.refazer()).toBe(true);
    expect(passa(simulacao, { tipo: "naoExiste", seletor: "#rodape" })).toBe(true);
    expect(passa(simulacao, { tipo: "evento", evento: "desfez" })).toBe(true);
    expect(passa(simulacao, { tipo: "evento", evento: "refez" })).toBe(true);
  });

  it(`a pilha de desfazer guarda no máximo ${LIMITE_HISTORICO} passos`, () => {
    const simulacao = nova();
    for (let vez = 0; vez < LIMITE_HISTORICO + 5; vez++) {
      simulacao.executar([{ tipo: "definirTexto", seletor: "#topo", valor: `Topo ${vez}` }]);
    }
    let desfeitos = 0;
    while (simulacao.nucleo.desfazer()) desfeitos++;
    expect(desfeitos).toBe(LIMITE_HISTORICO);
  });

  it("a trilha só sobe para ancestrais do selecionado", () => {
    const simulacao = nova();
    simulacao.executar([
      { tipo: "selecionar", seletor: "#a2 h3" },
      { tipo: "selecionar", seletor: "article", via: "trilha" },
    ]);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#a2", via: "trilha" })).toBe(true);
    expect(() => simulacao.executar([{ tipo: "selecionar", seletor: "footer", via: "trilha" }])).toThrow(ErroAcao);
  });

  it("seletor que não acha nada gera erro claro", () => {
    const simulacao = nova();
    expect(() => simulacao.executar([{ tipo: "apagar", seletor: "#nao-existe" }])).toThrow(
      /ação 1 de 1 \(apagar #nao-existe\): o seletor "#nao-existe" não achou nenhum elemento/,
    );
  });
});

describe("validadores", () => {
  it("contagem com texto ignora itens vazios", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "inserirHTML", seletor: "#lista", posicao: "fim", html: "<article class='card'></article>" }]);
    expect(passa(simulacao, { tipo: "contagem", seletor: ".card", op: "==", valor: 3 })).toBe(true);
    expect(passa(simulacao, { tipo: "contagem", seletor: ".card", op: "==", valor: 2, comTexto: true })).toBe(true);
  });

  it("textoDiferenteDoInicial com mínimo pede textos novos e diferentes entre si", () => {
    const simulacao = nova();
    simulacao.executar([
      { tipo: "duplicar", seletor: "#a1" },
      { tipo: "definirTexto", seletor: "$0 h3", valor: "Novo" },
      { tipo: "duplicar", seletor: "#a2" },
      { tipo: "definirTexto", seletor: "$0 h3", valor: "Novo" },
    ]);
    const validador: Validador = { tipo: "textoDiferenteDoInicial", seletor: "article h3", minimo: 2 };
    expect(passa(simulacao, validador)).toBe(false);
    // Depois de editar, o $0 é o próprio h3 editado (o duplo clique seleciona o nó).
    simulacao.executar([{ tipo: "definirTexto", seletor: "$0", valor: "Outro" }]);
    expect(passa(simulacao, validador)).toBe(true);
  });

  it("textos são comparados normalizados", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "definirTexto", seletor: "#topo", valor: "  Meu   topo " }]);
    expect(passa(simulacao, { tipo: "textoIgual", seletor: "#topo", valor: "Meu topo" })).toBe(true);
  });

  it("selecionado com via confere por onde veio a seleção", () => {
    const simulacao = nova();
    simulacao.executar([{ tipo: "selecionar", seletor: "#a1", via: "inspecionar" }]);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#a1", via: "inspecionar" })).toBe(true);
    expect(passa(simulacao, { tipo: "selecionado", seletor: "#a1", via: "arvore" })).toBe(false);
    expect(passa(simulacao, { tipo: "evento", evento: "inspecionou" })).toBe(true);
  });

  it("compostos todos, algum e nao", () => {
    const simulacao = nova();
    const existeTopo: Validador = { tipo: "existe", seletor: "#topo" };
    const existeNada: Validador = { tipo: "existe", seletor: "#nada" };
    expect(passa(simulacao, { tipo: "todos", validadores: [existeTopo, existeNada] })).toBe(false);
    expect(passa(simulacao, { tipo: "algum", validadores: [existeTopo, existeNada] })).toBe(true);
    expect(passa(simulacao, { tipo: "nao", validador: existeNada })).toBe(true);
  });
});

describe("validadorTravado", () => {
  it("selecionado e evento travam; o resto é avaliado ao vivo", () => {
    expect(validadorTravado({ tipo: "selecionado", seletor: "#a1" })).toBe(true);
    expect(validadorTravado({ tipo: "evento", evento: "duplicou" })).toBe(true);
    expect(validadorTravado({ tipo: "naoExiste", seletor: "#a1" })).toBe(false);
    expect(validadorTravado({ tipo: "escondido", seletor: "#a1" })).toBe(false);
    expect(validadorTravado({ tipo: "contagem", seletor: "#a1", op: ">=", valor: 1 })).toBe(false);
  });

  it("todos, algum e nao travam se algum validador de dentro travar", () => {
    const trava: Validador = { tipo: "evento", evento: "trilha" };
    const naoTrava: Validador = { tipo: "naoExiste", seletor: "#a1" };
    expect(validadorTravado({ tipo: "todos", validadores: [naoTrava, trava] })).toBe(true);
    expect(validadorTravado({ tipo: "algum", validadores: [naoTrava, trava] })).toBe(true);
    expect(validadorTravado({ tipo: "todos", validadores: [naoTrava] })).toBe(false);
    expect(validadorTravado({ tipo: "nao", validador: trava })).toBe(true);
    expect(validadorTravado({ tipo: "nao", validador: naoTrava })).toBe(false);
  });
});

describe("checklist do desafio (recalcularPartesFeitas)", () => {
  it("no desafio da Unidade 2, apagar o pop-up marca a parte, e desfazer desmarca", () => {
    const simulacao = criarSimulacao(FASE_U2_F4);
    simulacao.comecarObjetivo(null);
    let feitas: string[] = [];

    simulacao.executar([{ tipo: "apagar", seletor: "#popup-oferta" }]);
    feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    expect(feitas).toContain("apagar-popup");

    simulacao.executar([{ tipo: "desfazer" }]);
    feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    expect(feitas).not.toContain("apagar-popup");
  });

  it("parte travada (seleção pela trilha) continua marcada mesmo perdendo a seleção depois", () => {
    const simulacao = criarSimulacao(FASE_U2_F4);
    simulacao.comecarObjetivo(null);
    let feitas: string[] = [];

    simulacao.executar([
      { tipo: "selecionar", seletor: "#vitrine .produto h3" },
      { tipo: "selecionar", seletor: "#vitrine", via: "trilha" },
    ]);
    feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    expect(feitas).toContain("selecionar-vitrine");

    simulacao.executar([{ tipo: "selecionar", seletor: "#banner-topo" }]);
    feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    expect(feitas).toContain("selecionar-vitrine");
  });

  it("o desafio só conclui quando as partes ao vivo passam juntas e as travadas já foram marcadas", () => {
    const simulacao = criarSimulacao(FASE_U2_F4);
    simulacao.comecarObjetivo(null);
    let feitas: string[] = [];
    for (const parte of FASE_U2_F4.partes) {
      simulacao.executar(parte.solucaoDeTeste);
      feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    }
    expect(feitas.length).toBe(FASE_U2_F4.partes.length);

    // Desfazer a última ação (parte de estado: duplicar produto) desmarca a parte dela.
    simulacao.executar([{ tipo: "desfazer" }]);
    feitas = recalcularPartesFeitas(FASE_U2_F4, feitas, simulacao.contexto());
    expect(feitas.length).toBeLessThan(FASE_U2_F4.partes.length);
  });
});

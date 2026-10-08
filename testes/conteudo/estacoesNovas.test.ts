/*
 * Os modelos das estações das salas 3 a 6 (rodada 38): o comparador, os
 * cartões de ligar e de ordem, o circuito do museu e as simulações por
 * comando e marco. Puros: os mesmos que a tela, a simulação e os
 * validadores usam.
 */
import { describe, expect, it } from "vitest";
import * as cartoes from "@/motor/exposicao/cartoes";
import * as circuito from "@/motor/exposicao/circuitoMuseu";
import * as comparador from "@/motor/exposicao/comparador";
import { embaralharFixo } from "@/motor/exposicao/comum";
import { estadoInicialExposicao, estadoValidoExposicao, lerEstadoDeEstacaoNova, aplicarAcaoExposicao, type DadosExposicao } from "@/motor/exposicao/modelo";
import { SIMULACOES } from "@/motor/exposicao/simulacoes";
import type { EstacaoArquivos } from "@/motor/exposicao/simulacoes/arquivos";
import type { EstacaoClique } from "@/motor/exposicao/simulacoes/clique";
import type { EstacaoPacote } from "@/motor/exposicao/simulacoes/pacote";
import type { EstacaoProcessador } from "@/motor/exposicao/simulacoes/processador";
import { completarAutomatico, type EstacaoSistema, fatiaDoEngasgo } from "@/motor/exposicao/simulacoes/sistema";
import type { EstacaoMemoria } from "@/motor/exposicao/simulacoes/memoria";
import type { Circuito } from "@/motor/circuito/modelo";

function rodar<D, E>(modelo: { inicial(d: D): E; comando(d: D, e: E, c: string): E | null }, dados: D, comandos: string[]): E {
  let estado = modelo.inicial(dados);
  for (const c of comandos) {
    const novo = modelo.comando(dados, estado, c);
    if (!novo) throw new Error(`o comando "${c}" não fez nada`);
    estado = novo;
  }
  return estado;
}

describe("comparador", () => {
  const estacao: comparador.EstacaoComparador = {
    id: "padaria",
    tipo: "comparador",
    titulo: "A padaria",
    partes: [
      { id: "soma", nome: "Somar", explica: "Soma tudo." },
      { id: "mostrar", nome: "Mostrar", explica: "Mostra." },
    ],
    programas: [
      { linguagem: "javascript", linhas: [{ texto: "let t = 1 + 2;", parte: "soma" }, { texto: 'console.log("T " + t);', parte: "mostrar" }], saida: ["T 3"] },
      { linguagem: "python", linhas: [{ texto: "t = 1 + 2", parte: "soma" }, { texto: 'print("T", t)', parte: "mostrar" }], saida: ["T 3"] },
      { linguagem: "c", linhas: [{ texto: "int t = 1 + 2;", parte: "soma" }, { texto: 'printf("T %d\\n", t);', parte: "mostrar" }], saida: ["T 3"] },
    ],
    editavel: "python",
    coral: true,
  };
  it("acende a parte só onde ela existe, roda, canta e edita", () => {
    let estado = comparador.estadoInicialComparador();
    expect(comparador.tocarParte(estacao, estado, "nada", "c")).toBeNull();
    estado = comparador.tocarParte(estacao, estado, "mostrar", "c") as comparador.EstadoComparador;
    expect(comparador.parteVista(estado, "mostrar", ["c"]).passou).toBe(true);
    expect(comparador.parteVista(estado, "mostrar", ["python"]).passou).toBe(false);
    estado = comparador.rodarNoComparador(estacao, estado, "python") as comparador.EstadoComparador;
    expect(comparador.linguagensRodadas(estacao, estado, ["python"]).passou).toBe(true);
    expect(comparador.linguagensRodadas(estacao, estado).passou).toBe(false);
    estado = comparador.cantarCoral(estacao, estado) as comparador.EstadoComparador;
    expect(comparador.linguagensRodadas(estacao, estado).passou).toBe(true);
    expect(comparador.escreverNoComparador(estacao, estado, "c", "x")).toBeNull();
    const editado = comparador.escreverNoComparador(estacao, estado, "python", "t = 5 + 2\nprint(t)") as comparador.EstadoComparador;
    // Mesmo número de linhas: as partes continuam.
    expect(comparador.linhasDeAgora(estacao, editado, "python").map((l) => l.parte)).toEqual(["soma", "mostrar"]);
    const outro = comparador.escreverNoComparador(estacao, editado, "python", "print(1)") as comparador.EstadoComparador;
    expect(comparador.linhasDeAgora(estacao, outro, "python").every((l) => !l.parte)).toBe(true);
    // Voltar ao original apaga a edição.
    const original = comparador.escreverNoComparador(estacao, outro, "python", comparador.codigoOriginal(estacao.programas[1])) as comparador.EstadoComparador;
    expect(original.codigos.python).toBeUndefined();
    expect(comparador.conferirComparador(estacao, "x")).toEqual([]);
  });
});

describe("cartões de ligar e de ordem", () => {
  const ligar: cartoes.EstacaoLigar = {
    id: "usos",
    tipo: "ligar",
    titulo: "Usos",
    pergunta: "Cada linguagem no seu serviço",
    alvos: [
      { id: "web", nome: "Páginas" },
      { id: "banco", nome: "Bancos" },
    ],
    cartoes: [
      { id: "js", texto: "JavaScript", alvo: "web" },
      { id: "cobol", texto: "COBOL", alvo: "banco" },
    ],
  };
  it("liga, troca de alvo e devolve; confere só os pedidos", () => {
    let estado = cartoes.estadoInicialLigar();
    estado = cartoes.ligarCartao(ligar, estado, "js", "banco") as cartoes.EstadoLigar;
    expect(cartoes.cartaoCerto(ligar, estado, "js")).toBe(false);
    estado = cartoes.ligarCartao(ligar, estado, "js", "web") as cartoes.EstadoLigar;
    expect(cartoes.cartoesLigados(ligar, estado, ["js"]).passou).toBe(true);
    expect(cartoes.cartoesLigados(ligar, estado).passou).toBe(false);
    expect(cartoes.ligarCartao(ligar, estado, "js", "web")).toBeNull();
    expect(cartoes.ligarCartao(ligar, estado, "cobol", null)).toBeNull();
    expect(cartoes.ligarCartao(ligar, estado, "js", null)?.ligacoes).toEqual({});
  });
  it("a ordem: no lugar em relação aos outros", () => {
    const ordem: cartoes.EstacaoOrdem = {
      id: "escada",
      tipo: "ordem",
      titulo: "A escada",
      aparencia: "escada",
      itens: ["bits", "assembly", "c", "python"].map((id) => ({ id, texto: id })),
      pontas: { inicio: "Perto da máquina", fim: "Perto da gente" },
    };
    let estado = cartoes.estadoInicialOrdem();
    estado = cartoes.porNaOrdem(ordem, estado, "c") as cartoes.EstadoOrdem;
    estado = cartoes.porNaOrdem(ordem, estado, "bits", 0) as cartoes.EstadoOrdem;
    expect(cartoes.itemNoLugar(ordem, estado, "c")).toBe(true);
    estado = cartoes.porNaOrdem(ordem, estado, "python", 1) as cartoes.EstadoOrdem;
    expect(cartoes.itemNoLugar(ordem, estado, "python")).toBe(false);
    expect(cartoes.ordemCerta(ordem, estado, ["bits", "c"]).passou).toBe(true);
    estado = cartoes.porNaOrdem(ordem, estado, "python") as cartoes.EstadoOrdem;
    estado = cartoes.porNaOrdem(ordem, estado, "assembly", 1) as cartoes.EstadoOrdem;
    expect(cartoes.ordemCerta(ordem, estado).passou).toBe(true);
  });
  it("o embaralhado nunca é a ordem certa", () => {
    for (let n = 2; n <= 8; n += 1) {
      const ids = Array.from({ length: n }, (_, i) => `i${i}`);
      for (let semente = 0; semente < 12; semente += 1) expect(embaralharFixo(ids, semente)).not.toEqual(ids);
    }
  });
});

describe("circuito do museu", () => {
  const somador: Circuito = {
    pecas: [
      { id: "a", tipo: "entrada", nome: "a", x: 20, y: 40, fixa: true },
      { id: "b", tipo: "entrada", nome: "b", x: 20, y: 200, fixa: true },
      { id: "x", tipo: "xou", x: 250, y: 40, fixa: true },
      { id: "e", tipo: "e", x: 250, y: 200, fixa: true },
      { id: "soma", tipo: "saida", nome: "soma", x: 520, y: 40, fixa: true },
      { id: "vai", tipo: "saida", nome: "vaiUm", x: 520, y: 200, fixa: true },
    ],
    fios: [],
  };
  const painel: circuito.EstacaoCircuito = { id: "painel", tipo: "circuito", titulo: "Painel", aparencia: "cabos", inicial: somador, paleta: [], legendas: { x: "acende se só uma", e: "acende se as duas" } };
  it("plugando os cabos vira o meio somador (1 + 1 = 10)", () => {
    let estado = circuito.estadoInicialCircuito(painel);
    for (const [de, para, porta] of [["a", "x", 0], ["b", "x", 1], ["a", "e", 0], ["b", "e", 1], ["x", "soma", 0], ["e", "vai", 0]] as const) {
      estado = circuito.mexerNoCircuito(painel, estado, { tipo: "fio", de, para, porta }) as circuito.EstadoCircuito;
    }
    const tabela = [
      { entradas: { a: false, b: false }, saida: { soma: false, vaiUm: false } },
      { entradas: { a: true, b: false }, saida: { soma: true, vaiUm: false } },
      { entradas: { a: true, b: true }, saida: { soma: false, vaiUm: true } },
    ];
    expect(circuito.circuitoDaTabela(estado.circuito, tabela).passou).toBe(true);
    expect(circuito.mexerNoCircuito(painel, estado, { tipo: "portao", portao: "e", id: "e9" })).toBeNull();
    estado = circuito.mexerNoCircuito(painel, estado, { tipo: "chave", entrada: "a" }) as circuito.EstadoCircuito;
    estado = circuito.mexerNoCircuito(painel, estado, { tipo: "chave", entrada: "b" }) as circuito.EstadoCircuito;
    expect(circuito.circuitoAgora(estado, { a: true, b: true }, { soma: false, vaiUm: true }).passou).toBe(true);
    expect(circuito.conferirCircuito(painel, "x")).toEqual([]);
  });
  it("a memória com realimentação lembra (o selo)", () => {
    const base: Circuito = {
      pecas: [
        { id: "liga", tipo: "entrada", nome: "liga", x: 20, y: 40, fixa: true },
        { id: "desliga", tipo: "entrada", nome: "desliga", x: 20, y: 200, fixa: true },
        { id: "luz", tipo: "saida", nome: "luz", x: 520, y: 100, fixa: true },
      ],
      fios: [],
    };
    const bancada: circuito.EstacaoCircuito = { id: "selo", tipo: "circuito", titulo: "Selo", aparencia: "portoes", inicial: base, paleta: ["e", "ou", "nao"] };
    let estado = circuito.estadoInicialCircuito(bancada);
    const mudancas: circuito.MudancaCircuito[] = [
      { tipo: "portao", portao: "ou", id: "ou1" },
      { tipo: "portao", portao: "nao", id: "nao1" },
      { tipo: "portao", portao: "e", id: "e1" },
      { tipo: "fio", de: "liga", para: "ou1", porta: 0 },
      { tipo: "fio", de: "e1", para: "ou1", porta: 1 },
      { tipo: "fio", de: "desliga", para: "nao1", porta: 0 },
      { tipo: "fio", de: "ou1", para: "e1", porta: 0 },
      { tipo: "fio", de: "nao1", para: "e1", porta: 1 },
    ];
    expect(circuito.circuitoLembra(estado.circuito, "luz", "liga", "desliga").passou).toBe(false);
    for (const m of mudancas) estado = circuito.mexerNoCircuito(bancada, estado, m) as circuito.EstadoCircuito;
    // Sem o fio até a luz, ela não acende.
    expect(circuito.circuitoLembra(estado.circuito, "luz", "liga", "desliga").passou).toBe(false);
    estado = circuito.mexerNoCircuito(bancada, estado, { tipo: "fio", de: "e1", para: "luz", porta: 0 }) as circuito.EstadoCircuito;
    expect(circuito.circuitoLembra(estado.circuito, "luz", "liga", "desliga")).toEqual({ passou: true, detalhe: "acende, lembra e apaga" });
    // Na tela: liga e solta, a luz fica.
    estado = circuito.mexerNoCircuito(bancada, estado, { tipo: "chave", entrada: "liga", ligada: true }) as circuito.EstadoCircuito;
    estado = circuito.mexerNoCircuito(bancada, estado, { tipo: "chave", entrada: "liga", ligada: false }) as circuito.EstadoCircuito;
    expect(circuito.simulacaoDoCircuito(estado).valores.luz).toBe(true);
  });
});

describe("simulações", () => {
  it("memória: o programa guarda, a bandeja troca", () => {
    const dados: EstacaoMemoria = {
      id: "m",
      tipo: "memoria",
      titulo: "Memória",
      caixas: 8,
      programa: [
        { texto: "let preco = 12;", endereco: 3, valor: 12, nome: "preco" },
        { texto: "let frete = 8;", endereco: 4, valor: 8, nome: "frete" },
      ],
      bandeja: [15, 20],
    };
    const estado = rodar(SIMULACOES.memoria, dados, ["passo", "passo", "escolher:4", "guardar:4=15"]);
    const marcos = SIMULACOES.memoria.marcos(dados, estado);
    expect(marcos).toEqual(expect.arrayContaining(["fim", "linha:2", "caixa:3=12", "caixa:4=15", "escolhida:4"]));
    expect(SIMULACOES.memoria.comando(dados, estado, "passo")).toBeNull();
    expect(SIMULACOES.memoria.comandoPossivel(dados, "guardar:4=99")).toBe(false);
    expect(SIMULACOES.memoria.conferir(dados, "x")).toEqual([]);
  });

  it("processador: buscar, entender, executar até parar", () => {
    const dados: EstacaoProcessador = {
      id: "p",
      tipo: "processador",
      titulo: "Processador",
      memoria: [{ ordem: "PEGA", endereco: 6 }, { ordem: "SOMA", endereco: 7 }, { ordem: "GUARDA", endereco: 8 }, { ordem: "PARA", endereco: 0 }, { valor: null }, { valor: null }, { valor: 12, nome: "preco" }, { valor: 8, nome: "frete" }, { valor: null, nome: "total" }],
    };
    expect(SIMULACOES.processador.conferir(dados, "x")).toEqual([]);
    const um = rodar(SIMULACOES.processador, dados, ["passo"]);
    expect(SIMULACOES.processador.marcos(dados, um)).toEqual(["buscou", "caixa:6=12", "caixa:7=8"]);
    const ciclo = rodar(SIMULACOES.processador, dados, ["passo", "passo", "passo"]);
    expect(SIMULACOES.processador.marcos(dados, ciclo)).toEqual(expect.arrayContaining(["executou", "ciclo:1", "acumulador=12"]));
    const fim = rodar(SIMULACOES.processador, dados, ["rodar"]);
    expect(SIMULACOES.processador.marcos(dados, fim)).toEqual(expect.arrayContaining(["fim", "caixa:8=20", "acumulador=20", "ciclo:4"]));
    expect(SIMULACOES.processador.comando(dados, fim, "passo")).toBeNull();
  });

  it("sistema: o automático nunca engasga; dar a vez errado engasga", () => {
    const dados: EstacaoSistema = {
      id: "s",
      tipo: "sistema",
      titulo: "Gerente",
      memoriaTotal: 8,
      programas: [
        { id: "musica", nome: "Música", figura: "musica", fatias: 4, memoria: 1, ritmo: 2 },
        { id: "navegador", nome: "Navegador", figura: "navegador", fatias: 3, memoria: 3 },
        { id: "jogo", nome: "Jogo", figura: "jogo", fatias: 4, memoria: 4 },
      ],
    };
    expect(SIMULACOES.sistema.conferir(dados, "x")).toEqual([]);
    expect(fatiaDoEngasgo(dados, completarAutomatico(dados, []))).toBeNull();
    const ruim = rodar(SIMULACOES.sistema, dados, ["vez:jogo", "vez:jogo", "vez:jogo"]);
    expect(SIMULACOES.sistema.marcos(dados, ruim)).toContain("engasgou");
    const bom = rodar(SIMULACOES.sistema, dados, ["vez:musica", "vez:navegador", "vez:jogo", "vez:musica", "vez:navegador", "vez:jogo", "vez:musica", "vez:navegador", "vez:jogo", "vez:musica", "vez:jogo"]);
    expect(SIMULACOES.sistema.marcos(dados, bom)).toEqual(expect.arrayContaining(["todos-terminaram", "terminou-sem-engasgo"]));
    const auto = rodar(SIMULACOES.sistema, dados, ["vez:musica", "automatico"]);
    expect(SIMULACOES.sistema.marcos(dados, auto)).toEqual(expect.arrayContaining(["automatico", "terminou-sem-engasgo"]));
    expect(SIMULACOES.sistema.comando(dados, auto, "vez:musica")).toBeNull();
  });

  it("arquivos: abrir, escolher, mover e o caminho", () => {
    const dados: EstacaoArquivos = {
      id: "a",
      tipo: "arquivos",
      titulo: "Arquivos",
      raiz: {
        id: "computador",
        nome: "Meu computador",
        tipo: "pasta",
        filhos: [
          { id: "documentos", nome: "Documentos", tipo: "pasta", filhos: [{ id: "receitas", nome: "Receitas", tipo: "pasta", filhos: [{ id: "bolo", nome: "bolo.txt", tipo: "arquivo" }] }] },
          { id: "downloads", nome: "Downloads", tipo: "pasta", filhos: [{ id: "cenoura", nome: "cenoura.txt", tipo: "arquivo" }] },
        ],
      },
    };
    expect(SIMULACOES.arquivos.conferir(dados, "x")).toEqual([]);
    const estado = rodar(SIMULACOES.arquivos, dados, ["abrir:documentos", "abrir:receitas", "escolher:bolo", "mover:cenoura>receitas", "ver-arvore"]);
    const marcos = SIMULACOES.arquivos.marcos(dados, estado);
    expect(marcos).toEqual(expect.arrayContaining(["aberta:documentos", "em:cenoura>receitas", "em:bolo>receitas", "viu-arvore", "escolhido:cenoura"]));
    expect(SIMULACOES.arquivos.comando(dados, estado, "mover:cenoura>receitas")).toBeNull();
  });

  it("clique: o caminho normal e os cenários de quebra", () => {
    const dados: EstacaoClique = { id: "c", tipo: "clique", titulo: "Clique", site: "padaria.com.br", cenarios: ["normal", "dns-fora", "servidor-lento"] };
    const normal = rodar(SIMULACOES.clique, dados, ["clicar", ...Array(6).fill("avancar")]);
    expect(SIMULACOES.clique.marcos(dados, normal)).toEqual(expect.arrayContaining(["pagina-montada", "viu:normal", "etapa:dns", "etapa:servidor"]));
    expect(SIMULACOES.clique.comando(dados, normal, "avancar")).toBeNull();
    const dns = rodar(SIMULACOES.clique, dados, ["cenario:dns-fora", "clicar", "avancar", "avancar"]);
    expect(SIMULACOES.clique.marcos(dados, dns)).toEqual(expect.arrayContaining(["viu:dns-fora", "etapa:dns-falhou"]));
    expect(SIMULACOES.clique.marcos(dados, dns)).not.toContain("pagina-montada");
    const lento = rodar(SIMULACOES.clique, dados, ["cenario:servidor-lento", "clicar", ...Array(7).fill("avancar")]);
    expect(SIMULACOES.clique.marcos(dados, lento)).toEqual(expect.arrayContaining(["viu:servidor-lento", "etapa:esperando", "pagina-montada"]));
  });

  it("pacote: só por cabo inteiro; o submarino atravessa o oceano", () => {
    const dados: EstacaoPacote = {
      id: "p",
      tipo: "pacote",
      titulo: "Pacote",
      ilhas: [],
      nos: [
        { id: "casa", nome: "Casa", figura: "casa", x: 10, y: 10 },
        { id: "bairro", nome: "Bairro", figura: "roteador", x: 30, y: 20 },
        { id: "costa", nome: "Costa", figura: "estacao-cabo", x: 40, y: 40 },
        { id: "outra-costa", nome: "Outra costa", figura: "estacao-cabo", x: 70, y: 40 },
        { id: "servidor", nome: "Servidor", figura: "servidor", x: 90, y: 20 },
      ],
      cabos: [
        { de: "casa", para: "bairro" },
        { de: "bairro", para: "costa" },
        { de: "bairro", para: "servidor", partido: true },
        { de: "costa", para: "outra-costa", submarino: true },
        { de: "outra-costa", para: "servidor" },
      ],
      origem: "casa",
      destino: "servidor",
    };
    expect(SIMULACOES.pacote.conferir(dados, "x")).toEqual([]);
    const meio = rodar(SIMULACOES.pacote, dados, ["pular:bairro"]);
    expect(SIMULACOES.pacote.comando(dados, meio, "pular:servidor")).toBeNull();
    const fim = rodar(SIMULACOES.pacote, dados, ["pular:bairro", "pular:costa", "pular:outra-costa", "pular:servidor"]);
    expect(SIMULACOES.pacote.marcos(dados, fim)).toEqual(expect.arrayContaining(["entregue", "atravessou-oceano", "chegou:costa"]));
    expect(SIMULACOES.pacote.comando(dados, fim, "voltar")).toBeNull();
  });
});

describe("a exposição com as estações novas", () => {
  const dados: DadosExposicao = {
    anfitriao: "internet",
    placa: { titulo: "Teste", texto: "Teste" },
    falas: { abrir: "Oi" },
    estacoes: [
      { id: "cidade", tipo: "cidade", titulo: "A cidade", lugares: [{ id: "semaforo", nome: "O semáforo", figura: "semaforo", codigo: ["a", "b"], explica: "x", quem: "y" }, { id: "carro", nome: "O carro", figura: "carro", codigo: ["a", "b"], explica: "x", quem: "y" }] },
      { id: "rede", tipo: "aba-rede", titulo: "A aba Rede", pagina: "x.com", requisicoes: [{ id: "pagina", nome: "x.com", tipo: "documento", status: 200, tamanhoKb: 10, inicioMs: 0, duracaoMs: 100 }, { id: "foto", nome: "foto.png", tipo: "imagem", status: 200, tamanhoKb: 900, inicioMs: 120, duracaoMs: 900 }, { id: "css", nome: "a.css", tipo: "estilo", status: 404, tamanhoKb: 1, inicioMs: 120, duracaoMs: 40 }] },
    ],
  };
  it("comandoNaEstacao muda só a simulação certa; o estado salvo volta lido", () => {
    let estado = estadoInicialExposicao(dados);
    expect(aplicarAcaoExposicao(dados, estado, { tipo: "comandoNaEstacao", estacao: "rede", comando: "escolher:foto" })).toBeNull();
    estado = aplicarAcaoExposicao(dados, estado, { tipo: "comandoNaEstacao", estacao: "rede", comando: "gravar" }) as typeof estado;
    estado = aplicarAcaoExposicao(dados, estado, { tipo: "comandoNaEstacao", estacao: "cidade", comando: "abrir:carro" }) as typeof estado;
    const salvo = JSON.parse(JSON.stringify(estado)) as typeof estado;
    const lido = { aberta: salvo.aberta, estacoes: Object.fromEntries(Object.entries(salvo.estacoes).map(([id, e]) => [id, lerEstadoDeEstacaoNova(e)])) } as typeof estado;
    expect(estadoValidoExposicao(dados, lido)).toEqual(estado);
  });
});

describe("mesa de cores: o alvo canal por canal", () => {
  it("tira o alvo do validador (inclusive dentro de todos) e ignora o de faixa", async () => {
    const { alvosDeCor } = await import("@/motor/exposicao/alvoDaCor");
    expect(
      alvosDeCor([
        { tipo: "corHex", estacao: "mesa", valor: "#FF8800" },
        { tipo: "todos", validadores: [{ tipo: "corHex", estacao: "outra", valor: "#ff0" }] },
        { tipo: "corHex", estacao: "faixa", canais: { r: [200, 255] } },
      ]),
    ).toEqual({ mesa: "#ff8800", outra: "#ffff00" });
  });

  it("diz qual canal está no alvo, abaixo ou acima", async () => {
    const { canaisNoAlvo } = await import("@/motor/exposicao/alvoDaCor");
    const canais = canaisNoAlvo("#ff9900", "#ff8800");
    expect(canais.r).toEqual({ valor: 255, alvo: 255, situacao: "certo" });
    expect(canais.g.situacao).toBe("acima");
    expect(canais.b.situacao).toBe("certo");
    expect(canaisNoAlvo("#000000", "#ffff00").g.situacao).toBe("abaixo");
  });
});
